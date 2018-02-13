// ----------------- APP_ROOT_PATH INSTANTIATION --------------------------

global.OwlStakes =
{
	require : require('app-root-path').require
};

// ----------------- EXTERNAL MODULES --------------------------

var _dropbox = require('dropbox'),
	_jpegrotator = require('jpeg-autorotate'),
	_imagemin = require('imagemin'),
	_imageminJpegTran = require('imagemin-jpegtran'),
	_sharp = require('sharp'),
	_randomstring = require('randomstring'),
	_Q = require('q'),

	mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver'),

	config = global.OwlStakes.require('config/config');

// ----------------- ENUMS/CONSTANTS --------------------------

var GALLERY_METADATA_COLLECTION = 'gallery',

	GALLERY_IMAGE_DIRECTORY = 'client/images/gallery/',
	DESKTOP_THUMBNAIL_DIRECTORY = 'desktop/',
	TABLET_THUMBNAIL_DIRECTORY = 'tablet/',
	PHONE_THUMBNAIL_DIRECTORY = 'phone/',

	DROPBOX_DOMAIN = 'www.dropbox.com',
	DIRECT_LINK_DROPBOX_DOMAIN = 'dl.dropboxusercontent.com',

	THUMBNAIL_NAME_GENERATOR =
	{
		length: 6,
		charset: 'alphanumeric'
	};

// ----------------- I/O FUNCTION TRANSFORMATIONS --------------------------

var jpegRotate = _Q.denodeify(_jpegrotator.rotate);

// ----------------- INITIALIZATION --------------------------

(async function ()
{
	await mongo.initialize();

	var dropboxConnection = new _dropbox({ accessToken: config.GALLERY_TOKEN }), // Instantiate a new dropbox connection
		indexRecord,
		results,
		files = [], fileBlob,
		maxIndex = 0,
		newGalleryMeta = [],
		shareLink,
		thumbnail, thumbnailFileName, fileExtension,
		i;

	// Start pulling metadata for all the gallery images
	console.log('Fetching all the gallery pictures...');
	results = await dropboxConnection.filesListFolder(
	{
		path : '',
		recursive: false
	});
	files.push(...results.entries);

	// Continue pulling metadata if there's more images that need to be fetched
	while (results.has_more)
	{
		results = await dropboxConnection.filesListFolderContinue({ cursor: results.cursor });
		files.push(...results.entries);
	}
	console.log('Finished retrieving all the gallery pictures');

	// Find out what's the highest index that's been attributed to a photo
	indexRecord = await mongo.read(GALLERY_METADATA_COLLECTION, {},
	{
		index: -1
	});
	maxIndex = (indexRecord.length ? indexRecord[0].index : 0);

	// Now index and process all the photos that have not been processed yet
	for (i = 0; i < files.length; i++)
	{
		indexRecord = await mongo.read(GALLERY_METADATA_COLLECTION, { _id: files[i].path_lower });
		if ( !(indexRecord.length) )
		{
			// Download the image and rotate the image so that it's oriented properly regardless of whatever the
			// EXIF data says to do with that image
			console.log('Downloading an image - ' + files[i].path_lower);
			fileBlob = await dropboxConnection.filesDownload({ path : files[i].path_lower });
			fileBlob = Buffer.from(fileBlob.fileBinary, 'binary');
			try
			{
				console.log('Re-orienting an image - ' + files[i].path_lower);
				fileBlob = await jpegRotate(fileBlob, {});
			}
			catch(error)
			{
				// Do nothing should there be an issue trying to orient the image
				console.log('Unable to re-orient the image - ' + files[i].path_lower);
			}

			// Let's also compress the image while we're at it
			try
			{
				console.log('Minifying an image - ' + files[i].path_lower);
				fileBlob = await _imagemin.buffer(fileBlob,
				{
					plugins: [_imageminJpegTran()]
				});
			}
			catch(error)
			{
				// Do nothing should there be an issue trying to minifiying the image
				console.log('Unable to minify image - ' + files[i].path_lower);
			}

			// Push the processed image back into Dropbox. Make sure to replace the old one.
			console.log('Uploading a processed image - ' + files[i].path_lower);
			await dropboxConnection.filesUpload(
			{
				contents: fileBlob,
				path: files[i].path_lower,
				mode: { '.tag' : 'overwrite' },
				autorename: true,
				mute: false
			});

			// Now generate a shareable link for that photo
			console.log('Generating a shareable link - ' + files[i].path_lower);
			try
			{
				shareLink = await dropboxConnection.sharingCreateSharedLinkWithSettings({ path : files[i].path_lower });
				shareLink = shareLink.url;
			}
			catch(error)
			{
				console.log('Unable to generate a new shareable link for this file - ' + files[i].path_lower);

				if (error.status !== 409)
				{
					console.log(error);
					process.exit();
				}
				// A link already exists for this file, so let's pull that link instead
				else
				{
					console.log('Going to fetch the existing link for the file instead - ' + files[i].path_lower);

					shareLink = await dropboxConnection.sharingListSharedLinks({ path : files[i].path_lower });
					shareLink = shareLink.links[0].url;
				}
			}
			// Replace the generic Dropbox subdomain with the other subdomain used to directly link to images
			shareLink = shareLink.replace(DROPBOX_DOMAIN, DIRECT_LINK_DROPBOX_DOMAIN);

			// Generate different sized thumbnails for each gallery image
			console.log('Generating thumbnails for the image - ' + files[i].path_lower);

			fileExtension = files[i].name.split('.').pop();
			thumbnailFileName = _randomstring.generate(THUMBNAIL_NAME_GENERATOR) + new Date().getTime() + '.' + fileExtension;

			thumbnail = _sharp(fileBlob).resize(250, 250);
			await thumbnail.toFile(GALLERY_IMAGE_DIRECTORY + DESKTOP_THUMBNAIL_DIRECTORY + thumbnailFileName);
			thumbnail = _sharp(fileBlob).resize(185, 185);
			await thumbnail.toFile(GALLERY_IMAGE_DIRECTORY + TABLET_THUMBNAIL_DIRECTORY + thumbnailFileName);
			thumbnail = _sharp(fileBlob).resize(125, 125);
			await thumbnail.toFile(GALLERY_IMAGE_DIRECTORY + PHONE_THUMBNAIL_DIRECTORY + thumbnailFileName);

			// Assign an index to the photo
			maxIndex += 1;

			newGalleryMeta.push(mongo.formInsertSingleQuery(
			{
				_id : files[i].path_lower,
				url: shareLink,
				desktopThumbnail: GALLERY_IMAGE_DIRECTORY + DESKTOP_THUMBNAIL_DIRECTORY + thumbnailFileName,
				tabletThumbnail: GALLERY_IMAGE_DIRECTORY + TABLET_THUMBNAIL_DIRECTORY + thumbnailFileName,
				phoneThumbnail: GALLERY_IMAGE_DIRECTORY + PHONE_THUMBNAIL_DIRECTORY + thumbnailFileName,
				index: maxIndex
			}));
		}
	}

	// Add the new indices to our database
	if (newGalleryMeta.length)
	{
		console.log('Pushing new gallery data into the database...');
		newGalleryMeta.unshift(GALLERY_METADATA_COLLECTION, true);
		await mongo.bulkWrite.apply(mongo, newGalleryMeta);
	}

	// Close out this program
	console.log('Done!');
	process.exit();

})();