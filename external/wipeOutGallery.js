// ----------------- APP_ROOT_PATH INSTANTIATION --------------------------

global.OwlStakes =
{
	require : require('app-root-path').require
};

// ----------------- EXTERNAL MODULES --------------------------

var mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver'),

	fileManager = global.OwlStakes.require('utility/fileManager');

// ----------------- ENUMS/CONSTANTS --------------------------

var GALLERY_METADATA_COLLECTION = 'gallery',

	GALLERY_IMAGE_DIRECTORY = 'client/images/gallery/',
	DESKTOP_THUMBNAIL_DIRECTORY = 'desktop/',
	MOBILE_THUMBNAIL_DIRECTORY = 'mobile/';

// ----------------- INITIALIZATION --------------------------

(async function ()
{
	await mongo.initialize();

	// Empty out the gallery collection in the database
	console.log('Removing all gallery data from the database...');
	await mongo.bulkWrite(GALLERY_METADATA_COLLECTION, true, mongo.formDeleteManyQuery({}));

	// Empty out all thumbnail directories too
	console.log('Removing all gallery thumbnails as well');
	await fileManager.deleteFiles(GALLERY_IMAGE_DIRECTORY + DESKTOP_THUMBNAIL_DIRECTORY);
	await fileManager.deleteFiles(GALLERY_IMAGE_DIRECTORY + MOBILE_THUMBNAIL_DIRECTORY);

	// Close out this program
	console.log('Done!');
	process.exit();
})();