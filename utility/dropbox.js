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

	ORDERS_DIRECTORY = '/orders/',
	PAYMENTS_DIRECTORY = '/payments/',

	JPEG_EXTENSIONS =
	{
		jpg : true,
		jpeg : true
	},

	IMG_EXTENSIONS =
	{
		jpg : true,
		jpeg : true,
		png : true,
		gif : true,
		tif : true
	};

// ----------------- I/O FUNCTION TRANSFORMATIONS --------------------------

let jpegRotate = _Q.denodeify(_jpegrotator.rotate);

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function responsible for uploading an image into Dropbox
	 *
	 * @param {String} orderID - the ID of the order associated with this image
	 * @param {Object} files - the image to upload, indexed by their file name
	 * @param {Boolean} isPayment - flag that determines whether the image is related to a payment
	 *
	 * @returns {Array<Object>} - the metadatas for all the images newly uploaded to the Dropbox repository
	 *
	 * @author kinsho
	 */
	uploadImage: async function(orderID, files, isPayment)
	{
		let dropboxConnection = new _dropbox({ accessToken: config.DROPBOX_TOKEN }), // Instantiate a new dropbox
		// connection
			filenames = Object.keys(files),
			metadataCollection = [],
			fileNameComponents, fileExtension,
			shareLink, dropboxMetadata,
			file, path;

		for (let i = 0; i < filenames.length; i++)
		{
			file = files[filenames[i]];

			// Figure out the extension of the file being analyzed
			fileNameComponents = filenames[i].split('.');
			fileExtension = fileNameComponents[fileNameComponents.length - 1];

			// If the file extension does not indicate that the file is a valid image, then we must skip any
			// processing here
			if ( !(IMG_EXTENSIONS[fileExtension]) )
			{
				continue;
			}

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

			// Determine the path where we will store this image
			if (isPayment)
			{
				path = PAYMENTS_DIRECTORY + orderID + '-' + new Date().getTime() + '-';
			}
			else
			{
				// By default, we'll store everything in the 'Orders' sub-directory
				path = ORDERS_DIRECTORY + orderID + '-' + new Date().getTime() + '-';
			}

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
			console.log('Ran into an error trying to delete an image located at ' + path);
			return false;
		}
	}
};