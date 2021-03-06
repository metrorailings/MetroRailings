// ----------------- EXTERNAL MODULES --------------------------

let _url = require('url'),
	_Q = require('q'),
	_busboy = require('busboy'),

//	_queryString = require('querystring'),
//	_event = require('events'),

	router = global.OwlStakes.require('config/router');

// ----------------- PRIVATE FUNCTIONS --------------------------

/**
 * Function responsible for servicing all POST client requests
 *
 * @param {HTTPRequest} request - the HTTP request coming from a client machine
 * @param {Object} data - the data from the POST request
 * @param {Promise} deferred - the promise used to indicate that the request has been properly serviced or declined
 *
 * @returns {Object} data - the data to wire back to the client
 *
 * @author kinsho
 */
async function _servicePostRequest(request, data, deferred)
{
	console.log('Handling a POST request from ' + request.url.trim());

	let url = request.url.trim(),
		urlObj = _url.parse(url, true),
		routeSigns = urlObj.pathname.split('/'),
		action = routeSigns[2],
		cookie = request.headers.cookie, // All cookies sent along with the request
		controller, // Name of the controller that will service the request
		ctrl, // The instance of the actual controller to act upon
		responseData;

	// Find the route to the controller
	controller = router.findController(routeSigns[1]);

	// Hopefully, this will be one of the few examples in the entire code base in which a module will need to be
	// fetched dynamically.
	ctrl = global.OwlStakes.require(controller);

	// Find the correct action method indicated within the URL, then invoke that action method with
	// all the relevant parameters needed to properly service the POST request
	responseData = await ctrl[ router.findAction(action) ](data, cookie, request);

	deferred.resolve(responseData);
}

/**
 * Function responsible for processing all POST client requests
 *
 * @param {HTTPRequest} request - the HTTP request coming from a client machine
 *
 * @returns {Object} data - the data to wire back to the client
 *
 * @author kinsho
 */
function _handlePostRequest(request)
{
	let deferred = _Q.defer(),
		busboy = (request.headers['content-type'].indexOf('application/json') === -1) ? new _busboy({ headers: request.headers }) : null,
		data;

	console.log('In the process of receiving POST data...');

	if (busboy)
	{
		data = {};

		// Use Busboy to parse and store file data
		busboy.on('file', function(field, file, filename)
		{
			data[field] = data[field] || {};
			console.log('Uploading an image sent from the browser...');

			file.on('data', function(chunk)
			{
				// Store all the contents in allocated buffer
				data[field][filename] = data[field][filename] || Buffer.from([]);
				data[field][filename] = Buffer.concat([data[field][filename], chunk]);
			});

			file.on('end', function()
			{
				console.log('Upload finished!');
			});
		});

		busboy.on('field', function(field, value)
		{
			// Set the value into the object that will be used to pass parameters to the controller handling this request
			data[field] = value;
		});

		busboy.on('finish', async function()
		{
			await _servicePostRequest(request, data, deferred);
		});

		// Pipe all the data being sent over in the request through Busboy
		request.pipe(busboy);
	}
	else
	{
		data = '';

		// Gather the data from the request body and then parse that data using a JSON parser
		request.on('data', (chunk) =>
		{
			data += chunk.toString();
		});

		request.on('end', async function()
		{
			await _servicePostRequest(request, JSON.parse(data), deferred);
		});
	}

	// Using a promise here as we cannot use yield statements in this function gracefully, given that POST data
	// is asynchronously chunked to the server
	return deferred.promise;
}

/**
 * Function responsible for processing any non-specialized client request
 *
 * @param {HTTPRequest} request - the HTTP request coming from a client machine
 *
 * @returns {Object} data - the data to wire back to the client
 *
 * @author kinsho
 */
async function _handleStandardRequest(request)
{
	try
	{
		let url = request.url.trim(),
			urlObj = _url.parse(url, true),
			routeSigns = urlObj.pathname.split('/'),

			// If the URL indicates whether a style or image resource needs to be fetched, route to a controller
			// specifically designed to pull those type of resources
			isResourceWanted = router.isResourceWanted(url),

			action = ( isResourceWanted ? '' : routeSigns[2] ),
			// If a resource is being fetched, pass the URL to the resource controller as a parameter
			// Otherwise, extract the parameters from the URL
			params = (isResourceWanted ? url : urlObj.query),

			controller, // Name of the controller that will service the request
			ctrl, // The instance of the actual controller to act upon
			cookie = request.headers.cookie, // All cookies sent along with the request
			responseData;

		// Find the routes
		await router.populateRoutes();

		// Find the route to the controller
		controller = ( isResourceWanted ? router.findResourceController() : router.findController(routeSigns[1]));

		// Ready the parameters. If looking up a resource, set the URL as the parameter after stripping out any
		// leading slash that may be there
		url = (url.indexOf('/') === 0 || url.IndexOf('\\') === 0 ? url.substring(1, url.length) : url);

		// Hopefully, this will be one of the few examples in the entire code base in which a module will need to be
		// fetched dynamically.
		ctrl = global.OwlStakes.require(controller);

		// Figure out if the controller in context can satisfy the action requested. If not, default to whatever
		// initialization method has been defined within the controller in context
		if (!(ctrl[router.findAction(action)]))
		{
			action = '';
		}

		// Note the controller and action being invoked here
		console.log('CONTROLLER: ' + controller);
		console.log('ACTION: ' + router.findAction(action));

		// Find the correct action method indicated within the URL, then invoke that action method with
		// all the relevant parameters and any cookies needed to properly service the request
		responseData = await ctrl[router.findAction(action)](params, cookie, request);

		// Send the data back
		return responseData;
	}
	catch (exception)
	{
		console.log(exception);
		throw exception;
	}
}

// ----------------- MODULE --------------------------

module.exports =
{
	/**
	 * The main function responsible for delegating the client request to the the specialized function formulated
	 * to handle that request
	 *
	 * @param {HTTPRequest} request - the HTTP request coming from a client machine
	 *
	 * @returns {Object} data - the data to wire back to the client
	 *
	 * @author kinsho
	 */
	delegate : async function(request)
	{
		let responseData;

		switch(request.method)
		{
		case 'POST':
			responseData = await _handlePostRequest(request);
			break;
		default:
			responseData = await _handleStandardRequest(request);
			break;
		}

		return responseData;
	}
};