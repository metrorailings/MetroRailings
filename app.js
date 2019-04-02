// ----------------- APP_ROOT_PATH INSTANTIATION --------------------------

global.OwlStakes =
{
	require : require('app-root-path').require
};

// ----------------- EXTERNAL MODULES --------------------------

let _http = require('http'),
	_https = require('https'),

	config = global.OwlStakes.require('config/config'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),

	requestHandler = global.OwlStakes.require('utility/requestHandler'),
	responseHandler = global.OwlStakes.require('utility/responseHandler'),
	fileManager = global.OwlStakes.require('utility/fileManager'),

	databaseDriver = global.OwlStakes.require('data/DAO/utility/databaseDriver');

// ----------------- SERVER LOGIC --------------------------

/**
 * The logic the server would execute for every single request that comes in
 *
 * @param {HTTP Request} request
 * @param {HTTP Response} response
 *
 * @author kinsho
 */
function _process(request, response)
{
	console.log('Connection made from URL: ' + request.url.trim());

	// Tell the Node instance to allow for an infinite number of node listeners to be opened
	// Use only for development purposes
	// _event.setMaxListeners(0);

	(async function ()
	{
		try
		{
			// Manage the request through the requestManager
			let url = request.url.trim(),
				responseData = await requestHandler.delegate(request);

			// Send the response back
			responseHandler.delegateResponse(request, response, responseData, url);
		}
		catch (exception)
		{
			console.error('APP ---> ' + exception);
			console.trace();
			responseHandler.sendInternalServerErrorResponse(response, request.url.trim());
		}
	}());
}

// ----------------- OPENING LOGIC --------------------------

let privateKey,
	certificate;

(async function()
{
	// Open up a connection to the database
	await databaseDriver.initialize();

	// Fetch the SSL certificate data
	privateKey = await fileManager.fetchFile(config.SSL.KEY);
	certificate = await fileManager.fetchFile(config.SSL.CERTIFICATE);

	// Define a INSECURE server that will act as a gateway point for all insecure incoming server requests
	_http.createServer(async function(request, response)
	{
		// Reroute all insecure traffic to the port that can interpret SSL connections
		responseHandler.delegateResponse(request, response, await controllerHelper.renderRedirectView(config.BASE_URL + request.url.trim()), request.url.trim());
	}).listen(80);

	// Define a SECURE server that will act as a gateway point for all secure incoming server requests
	_https.createServer(
	{
		key: privateKey,
		cert: certificate
	}, _process).listen(443);

	console.log('Server started!');
	console.log('Listening on ports 80 and 443...');
}());