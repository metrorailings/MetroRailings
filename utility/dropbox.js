/**
 * @module dropbox
 */

// ----------------- EXTERNAL MODULES --------------------------

let _dropbox = require('dropbox'),
	_jpegrotator = require('jpeg-autorotate'),
	_Q = require('q'),

	config = global.OwlStakes.require('config/config');

// ----------------- PRIVATE VARIABLES --------------------------

const DROPBOX_DOMAIN = 'www.dropbox.com',
	DIRECT_LINK_DROPBOX_DOMAIN = 'dl.dropboxusercontent.com',

	JPEG_EXTENSIONS =
	{
		jpg : true,
		jpeg : true
	};

// ----------------- I/O FUNCTION TRANSFORMATIONS --------------------------

let jpegRotate = _Q.denodeify(_jpegrotator.rotate);

// ----------------- MODULE DEFINITION --------------------------

let dropboxModule =
{
	DIRECTORY:
	{
		PAYMENTS: '/payments/',
		ORDERS: '/orders/',
		DRAWINGS: '/drawings/',
		ORDER_FILES: '/orders/files/'
	},

	/**
	 * Function responsible for uploading a file into Dropbox
	 *
	 * @param {String} orderID - the ID of the order associated with this file
	 * @param {Object} files - the file to upload, indexed by their file name
	 * @param {Enum} directory - the directory in which to store the file
	 *
	 * @returns {Array<Object>} - the metadatas for all the files newly uploaded to the Dropbox repository
	 *
	 * @author kinsho
	 */
	uploadFile: async function(orderID, files, directory = dropboxModule.ORDERS)
	{
		let dropboxConnection = new _dropbox({ accessToken: config.DROPBOX_TOKEN }), // Instantiate a new dropbox connection
			filenames = Object.keys(files),
			metadataCollection = [],
			fileNameComponents, fileExtension,
			shareLink, dropboxMetadata, thumbnail,
			file, path;

		for (let i = 0; i < filenames.length; i++)
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

			// Conceive the path where the file will be stored within Dropbox
			path = directory + orderID + '-' + new Date().getTime() + '-';

			try
			{
				// Now push the image into Dropbox
				dropboxMetadata = await dropboxConnection.filesUpload(
				{
					contents: file,
					path: path,
					mode: { '.tag' : 'add' },
					autorename: true,
					mute: false
				});

				// Generate a thumbnail of the file
				thumbnail = await dropboxConnection.filesGetThumbnail(
					{
						path: dropboxMetadata.path_lower,
						size: 'w128h128',
						mode: 'bestfit'
					});
				dropboxMetadata.thumbnail = thumbnail.path_lower;

				// Mark the file as shareable so that we can store a link that points permanently to the file
				shareLink = await dropboxConnection.sharingCreateSharedLink(
				{
					path: dropboxMetadata.path_lower,
					short_url: false
				});
				dropboxMetadata.shareLink = shareLink.url.replace(DROPBOX_DOMAIN, DIRECT_LINK_DROPBOX_DOMAIN);

				// Mark the thumbnail as permanently shareable as well
				shareLink = await dropboxConnection.sharingCreateSharedLink(
				{
					path: dropboxMetadata.thumbnail,
					short_url: false
				});
				dropboxMetadata.thumbnail = shareLink.url.replace(DROPBOX_DOMAIN, DIRECT_LINK_DROPBOX_DOMAIN);

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
	deleteFile: async function(path)
	{
		// Instantiate a new dropbox connection
		let dropboxConnection = new _dropbox({ accessToken: config.DROPBOX_TOKEN }); 

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
			console.log('Ran into an error trying to delete a file located at ' + path);
			return false;
		}
	}
};

// ----------------- EXPORT MODULE --------------------------

module.exports = dropboxModule;