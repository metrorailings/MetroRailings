// ----------------- APP_ROOT_PATH INSTANTIATION --------------------------

global.OwlStakes =
{
	require : require('app-root-path').require
};

// ----------------- EXTERNAL MODULES --------------------------

var _dropbox = require('dropbox'),
	_jpegrotator = require('jpeg-autorotate'),
	_Q = require('q'),

	config = global.OwlStakes.require('config/config');

// ----------------- PRIVATE VARIABLES --------------------------

var INDEX_TEMPLATE_GROUP =
	{
		template_id: 'identification',
		fields: [ { name: 'index', value: ''} ]
	};

// ----------------- I/O FUNCTION TRANSFORMATIONS --------------------------

var jpegRotate = _Q.denodeify(_jpegrotator.rotate);

// ----------------- INITIALIZATION --------------------------

(async function ()
{
	var dropboxConnection = new _dropbox({ accessToken: config.GALLERY_TOKEN }), // Instantiate a new dropbox connection
		results,
		files = [], fileBlob,
		maxIndex = 0,
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
	for (i = files.length - 1; i >= 0; i--)
	{
		if (files[i].property_groups && files[i].property_groups.length)
		{
			// No other property groups should be associated with any of the gallery pictures, so we can assume the
			// only property group of the file relates to the indexing of the photo
			maxIndex = Math.max(maxIndex, files[i].property_groups[0].fields[0].value);
		}
	}

	// Now index and process all the photos that have not been processed yet
	for (i = files.length - 1; i >= 0; i--)
	{
		if ( !(files[i].property_groups && files[i].property_groups.length) )
		{
			// Download the image and rotate the image so that it's oriented properly regardless of whatever the
			// EXIF data says to do with that image
			console.log('Downloading an image - ' + files[i].path_lower);
			fileBlob = await dropboxConnection.filesDownload({ path : files[i].path_lower});
			try
			{
				console.log('Processing an image - ' + files[i].path_lower);
console.log(Buffer.from(fileBlob, 'binary'));
				fileBlob = await jpegRotate(Buffer.from(fileBlob, 'utf8'), {});
				fileBlob = fileBlob[0];
			}
			catch(error)
			{
				// Do nothing should there be an issue trying to orient the image
				console.log('Unable to process image - ' + files[i].path_lower);
				console.log(error);
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

			// Assign an index to the photo
			INDEX_TEMPLATE_GROUP.fields[0].value = ++maxIndex;

			// Push the new index into Dropbox as well
			console.log('Adding an index to the image - ' + files[i].path_lower);
			await dropboxConnection.FilePropertiesAddPropertiesArg(
			{
				path: files[i].path_lower,
				property_groups: [INDEX_TEMPLATE_GROUP]
			});
		}
	}

	// Close out this program
	console.log('Done!');
	process.exit();
})();