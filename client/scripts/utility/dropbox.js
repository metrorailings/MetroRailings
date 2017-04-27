/**
 * @main dropbox
 */

// ----------------- EXTERNAL MODULES --------------------------

import axios from 'client/scripts/utility/axios';

// ----------------- ENUMS/CONSTANTS --------------------------

var UPLOAD_FILE_URL = 'https://content.dropboxapi.com/2/files/upload',
	FETCH_LINK_URL = 'https://api.dropboxapi.com/2/files/get_temporary_link',

	DROPBOX_IMAGE_PATH = '/drawings/',

	// Generic set of request headers that we can expect to send with every request to a Dropbox service endpoint
	AUTHORIZATION_HEADER = 'Bearer ' + window.MetroRailings.dropboxToken,
	DEFAULT_CONTENT_TYPE_HEADER = 'text/plain; charset=dropbox-cors-hack',
	OCTET_CONTENT_TYPE_HEADER = 'application/octet-stream',
	JSON_CONTENT_TYPE_HEADER = 'application/json';

// ----------------- PRIVATE MEMBERS --------------------------

// ----------------- PRIVATE FUNCTIONS --------------------------

/**
 * Generic function meant to construct an object representing request headers that will be used right before making
 * any sort of service call against a Dropbox service
 *
 * @param {String} [contentType] - the content-type to incorporate into the request headers
 * @param {Object} [args] - the arguments to incorporate into the service call
 *
 * @returns {Object} - a complete set of headers that will guide the AJAX request
 *
 * @author kinsho
 */
function _generateRequestHeaders(contentType, args)
{
	var headers =
		{
			'Authorization' : AUTHORIZATION_HEADER,
			'Content-Type' : DEFAULT_CONTENT_TYPE_HEADER
		};

	if (contentType)
	{
		headers['Content-Type'] = contentType;
	}

	if (args)
	{
		headers['Dropbox-API-Arg'] = JSON.stringify(args);
	}

	return headers;
}

// ----------------- MODULE ---------------------------

var dropboxModule =
	{
		/**
		 * Function that uploads a file into our Dropbox repository
		 *
		 * @param {File} file - the file to upload into Dropbox
		 * @param {String} fileName - the name to give to the file in the Dropbox repository
		 *
		 * @returns {Object} - the metadata of the uploaded file
		 *
		 * @author kinsho
		 */
		uploadFile: async function (file, fileName)
		{
			var serviceParams =
				{
					path: DROPBOX_IMAGE_PATH + fileName,
					autorename: true
				};

			return await axios.post(UPLOAD_FILE_URL, file, false, _generateRequestHeaders(OCTET_CONTENT_TYPE_HEADER, serviceParams));
		},

		/**
		 * Function that generates and returns a temporary link that will be used to view the image
		 *
		 * @param {Object} metadata - the image metadata to use in order to generate the link
		 *
		 * @returns {String} - the link to the image
		 *
		 * @author kinsho
		 */
		fetchLink: async function (metadata)
		{
			var serviceParams =
				{
					path: metadata.path_lower
				},
				results;

			results = await axios.post(FETCH_LINK_URL, serviceParams, false, _generateRequestHeaders(JSON_CONTENT_TYPE_HEADER));
			return results.data.link;
		}
	};

// ----------------- EXPORT ---------------------------

export default dropboxModule;