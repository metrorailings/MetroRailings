/**
 * @module dropbox
 */

// ----------------- EXTERNAL MODULES --------------------------

var _dropbox = require('dropbox'),
	_jpegrotator = require('jpeg-autorotate'),
	_Q = require('q'),

	config = global.OwlStakes.require('config/config');

// ----------------- PRIVATE VARIABLES --------------------------

var DROPBOX_DOMAIN = 'www.dropbox.com',
	DIRECT_LINK_DROPBOX_DOMAIN = 'dl.dropboxusercontent.com',

	ORDERS_DIRECTORY = '/orders/',

	JPEG_EXTENSIONS =
	{
		jpg : true,
		jpeg : true
	};

// ----------------- I/O FUNCTION TRANSFORMATIONS --------------------------

var jpegRotate = _Q.denodeify(_jpegrotator.rotate);

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
	},

	/**
	 * Function responsible for uploading an image into Dropbox
	 *
	 * @param {String} orderID - the ID of the order associated with this image
	 * @param {Object} files - the image to upload, indexed by their file name
	 *
	 * @returns {Array<Object>} - the metadatas for all the images newly uploaded to the Dropbox repository
	 *
	 * @author kinsho
	 */
	uploadImage: async function(orderID, files)
	{
		var dropboxConnection = new _dropbox({ accessToken: config.DROPBOX_TOKEN }), // Instantiate a new dropbox connection
			filenames = Object.keys(files),
			metadataCollection = [],
			fileNameComponents, fileExtension,
			shareLink, dropboxMetadata,
			file, i;

		for (i = 0; i < filenames.length; i++)
		{
			file = files[filenames[i]];

			// Figure out the extension of the file being analyzed
			fileNameComponents = filenames[i].split('.');
			fileExtension = fileNameComponents[fileNameComponents.length - 1];

			// If we are uploading a JPEG image, ensure that it has been stripped of its exif data
			if (JPEG_EXTENSIONS[fileExtension.toLowerCase()])
			{
				try
				{
					file = await jpegRotate(file, {});

					file = file[0];
				}
				catch(error)
				{
					// Do nothing should there be an issue trying to remove the exif data from the picture
				}
			}

			try
			{
				// Now push the image into Dropbox
				dropboxMetadata = await dropboxConnection.filesUpload(
				{
					contents: file,
					path: ORDERS_DIRECTORY + orderID + '-' + new Date().getTime() + '-' + filenames[i],
					mode: { '.tag' : 'add' },
					autorename: true,
					mute: false
				});

				// Mark the image as shareable so that we can store a link that points permanently to the image
				shareLink = await dropboxConnection.sharingCreateSharedLink(
				{
					path: dropboxMetadata.path_lower,
					short_url: false
				});

				dropboxMetadata.shareLink = shareLink.url.replace(DROPBOX_DOMAIN, DIRECT_LINK_DROPBOX_DOMAIN);

				metadataCollection.push(dropboxMetadata);
			}
			catch (error)
			{
				console.error(error);
			}
		}

		// Return all the image metadatas that Dropbox gave to us after uploading the images
		return metadataCollection;
	},

	/**
	 * Function responsible for deleting an image from Dropbox
	 *
	 * @param {String} path - the path where the image is located inside our Dropbox repository

	 * @returns {Boolean} - a flag indicating whether the image was successfully deleted
	 *
	 * @author kinsho
	 */
	deleteImage: async function(path)
	{
		var dropboxConnection = new _dropbox({ accessToken: config.DROPBOX_TOKEN }); // Instantiate a new dropbox connection

		try
		{
			await dropboxConnection.filesDeleteV2(
			{
				path: path
			});

			return true;
		}
		catch (error)
		{
			console.log('Ran into an error trying to delete an image located at ' + path);
			return false;
		}
	}
};