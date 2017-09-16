/**
 * @module dropbox
 */

// ----------------- EXTERNAL MODULES --------------------------

var _dropbox = require('dropbox'),

	config = global.OwlStakes.require('config/config');

// ----------------- PRIVATE VARIABLES --------------------------

var DROPBOX_DOMAIN = 'www.dropbox',
	DIRECT_LINK_DROPBOX_DOMAIN = 'dl.dropboxusercontent';

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function responsible for fetching links to all the gallery images
	 *
	 * @returns {Array<String>} - a collection of URLs pointing to the gallery images
	 *
	 * @author kinsho
	 */
	loadGallery: async function()
	{
		var dropboxConnection = new _dropbox({ accessToken: config.GALLERY_TOKEN }), // Instantiate a new dropbox connection
			results,
			URLs = [],
			i;

		// Pull the public universal links for all the gallery images
		results = await dropboxConnection.sharingGetSharedLinks({ path : '' });
		results = results.links;

		for (i = results.length - 1; i >= 0; i--)
		{
			// Do not forget to replace all the URLs that were returned to us with their direct-link equivalents
			URLs.push(results[i].url.replace(DROPBOX_DOMAIN, DIRECT_LINK_DROPBOX_DOMAIN));
		}

		return URLs;
	}
};