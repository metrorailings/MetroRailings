// ----------------- APP_ROOT_PATH INSTANTIATION --------------------------

global.OwlStakes =
{
	require : require('app-root-path').require
};

// ----------------- EXTERNAL MODULES --------------------------

var _http = require('http'),
	requestHandler = global.OwlStakes.require('utility/requestHandler'),
	responseHandler = global.OwlStakes.require('utility/responseHandler'),
	databaseDriver = global.OwlStakes.require('data/DAO/utility/databaseDriver');

// ----------------- OPENING LOGIC --------------------------

// Open up a connection to the database
(async function()
{
	await databaseDriver.initialize();
}());

// Define a server that will act as a gateway point for all incoming server requests
_http.createServer(function(request, response)
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
			var url = request.url.trim(),
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

}).listen(80);

// ----------------- END --------------------------

console.log('Server started!');
console.log('Listening on port 80...');