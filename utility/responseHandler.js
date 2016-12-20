/**
 * @module responseHandler
 */

// ----------------- EXTERNAL MODULES --------------------------

var router = global.OwlStakes.require('config/router');

// ----------------- ENUM/CONSTANTS --------------------------

var INTERNAL_SERVER_ERROR_MESSAGE = "Something's up with our server here. We apologize for any inconvenience here," +
	"but rest assured, the administrator has been notified and somebody will address this issue soon. Until " +
	"then, please come back to this site later. Once again, we apologize for having to do this.",

	JSON_CONTENT_TYPE = 'application/json';

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function responsible for relaying a successful HTTP response back to the client
	 *
	 * @param {HTTPResponse} response - the HTTP response object
	 * @param {String} responseData - the actual payload to send back to the client
	 * @param {String} url - the URL used to initiate the request to the server
	 *
	 * @author kinsho
	 */
	sendResponse: function(response, responseData, url)
	{
		try
		{
			// Write out the important headers before launching the response back to the client
			response.writeHead(200,
			{
				"Content-Type" : router.deduceContentType(url),
				"Content-Encoding" : ( ( router.isResourceWanted(url) && !(router.isImage(url)) ) ? 'gzip' : ''),
				"Access-Control-Allow-Origin" : "*"
			});

			console.log('Response ready to be returned from URL: /' + url);

			// Images must be returned in a binary format
			if (router.isImage(url))
			{
				response.end(responseData, 'binary');
			}
			else
			{
				response.end(responseData);
			}
		}
		catch(exception)
		{
			console.error('Error when sending back a supposedly successful response...');
			console.error(exception);
			this.sendInternalServerErrorResponse(response, url);
		}
	},

	/**
	 * Function responsible for relaying a successful HTTP post response back to the client
	 *
	 * @param {HTTPResponse} response - the HTTP response object
	 * @param {String} responseData - the actual payload to send back to the client
	 * @param {Number} statusCode - the status code to send to indicate the nature of the response
	 * @param {String} url - the URL used to initiate the request to the server
	 * @param {String} [cookie] - a serialized cookie to send over the wire if one is provided
	 *
	 * @author kinsho
	 */
	sendPostResponse: function(response, responseData, statusCode, url, cookie)
	{
		var responseHeaders =
			{
				"Content-Type" : JSON_CONTENT_TYPE,
				"Content-Encoding" : '',
				"Access-Control-Allow-Origin" : "*"
			};

		if (cookie)
		{
			responseHeaders['Set-Cookie'] = cookie;
		}

		try
		{
			// Write out the important headers before launching the response back to the client
			response.writeHead(statusCode, responseHeaders);

			console.log('Response ready to be returned from URL: /' + url);

			response.end(JSON.stringify(responseData));
		}
		catch(exception)
		{
			console.error('Error when sending back a supposedly successful response...');
			console.error(exception);
			this.sendInternalServerErrorResponse(response, url);
		}
	},

	/**
	 * Function responsible for relaying back to the client an HTTP response indicating that
	 * the server has run into some sort of issue that makes it impossible to properly service
	 * the HTTP request.
	 *
	 * @param {HTTPResponse} response - the HTTP response object
	 * @param {String} url - the URL used to initiate the request to the server
	 *
	 * @author kinsho
	 */
	sendInternalServerErrorResponse: function(response, url)
	{
		console.log('Errors were generated when trying to service the following URL: ' + url);

		// Send an e-mail to the admin to notify him that something went horribly wrong here...
		// @TODO write logic to send e-mails

		// Send a response back and close out this service call once and for all
		response.end(JSON.stringify(
		{
			error: INTERNAL_SERVER_ERROR_MESSAGE
		}));
	},

	/**
	 * The main function responsible for delegating a successful client response to the the specialized function
	 * formulated to handle the request currently in context
	 *
	 * @param {HTTPRequest} request - the HTTP request coming from a client machine
	 * @param {HTTPResponse} response - the HTTP response object
	 * @param {String} responseData - the actual payload to send back to the client
	 * @param {String} url - the URL used to initiate the request to the server
	 *
	 * @author kinsho
	 */
	delegateResponse: function(request, response, responseData, url)
	{
		switch(request.method)
		{
			case 'POST':
				responseData = this.sendPostResponse(response, responseData.data, responseData.statusCode, url, responseData.cookie);
				break;
			default:
				responseData = this.sendResponse(response, responseData, url);
				break;
		}
	}
};