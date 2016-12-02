// ----------------- EXTERNAL MODULES --------------------------

var _url = require('url'),
	_Q = require('q'),
//	_queryString = require('querystring'),
//	_event = require('events'),
	router = global.OwlStakes.require('config/router');

// ----------------- PRIVATE FUNCTIONS --------------------------

	/**
	 * Function responsible for processing all POST client requests
	 *
	 * @param {HTTPRequest} request - the HTTP request coming from a client machine
	 *
	 * @returns {Object} data - the data to wire back to the client
	 *
	 * @author kinsho
	 */
var _handlePostRequest = function(request)
	{
		var deferred = _Q.defer(),
			data = '';

		console.log('In the process of receiving POST data...');

		request.on('data', (chunk) =>
		{
			data += chunk.toString();
		});

		request.on('end', _Q.async(function* ()
		{
			console.log('Handling a POST request from ' + request.url.trim());

			var url = request.url.trim(),
				urlObj = _url.parse(url, true),
				routeSigns = urlObj.pathname.split('/'),
				action = routeSigns[2],
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
			responseData = yield ctrl[ router.findAction(action) ](JSON.parse(data));

			deferred.resolve(responseData);
		}));

		// Using a promise here as we cannot use yield statements in this function gracefully, given that POST data
		// is asynchronously chunked to the server
		return deferred.promise;
	},

	/**
	 * Function responsible for processing any non-specialized client request
	 *
	 * @param {HTTPRequest} request - the HTTP request coming from a client machine
	 *
	 * @returns {Object} data - the data to wire back to the client
	 *
	 * @author kinsho
	 */
	_handleStandardRequest = _Q.async(function* (request)
	{
		try
		{
			var url = request.url.trim(),
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
			yield router.populateRoutes();

			// Find the route to the controller
			controller = ( isResourceWanted ? router.findResourceController() : router.findController(routeSigns[1]));

			// Ready the parameters. If looking up a resource, set the URL as the parameter after stripping out any
			// leading slash that may be there
			url = (url.indexOf('/') === 0 || url.IndexOf("\\") === 0 ? url.substring(1, url.length) : url);

			// Hopefully, this will be one of the few examples in the entire code base in which a module will need to be
			// fetched dynamically.
			ctrl = global.OwlStakes.require(controller);

			// Find the correct action method indicated within the URL, then invoke that action method with
			// all the relevant parameters and any cookies needed to properly service the request
			responseData = yield ctrl[ router.findAction(action) ](params, cookie);

			// Send the data back
			return responseData;
		}
		catch (exception)
		{
			console.log(exception);
			throw exception;
		}
	});

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
	delegate : _Q.async(function* (request)
	{
		var responseData;

		switch(request.method)
		{
			case 'POST':
				responseData = yield _handlePostRequest(request);
				break;
			default:
				responseData = yield _handleStandardRequest(request);
				break;
		}

		return responseData;
	})
};