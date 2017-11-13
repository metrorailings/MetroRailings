/**
 * @module homeController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),

	picturesDAO = global.OwlStakes.require('data/DAO/picturesDAO'),

	fileManager = global.OwlStakes.require('utility/fileManager'),
	templateManager = global.OwlStakes.require('utility/templateManager');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'home',
	THANK_YOU_FOLDER = 'thankYou',

	GENERIC_SLOGAN = 'Proudly serving artfully crafted railings to all of New Jersey and New York City',

	DEFAULT_KEYWORD = 'Default',

	PARTIALS =
	{
		ABOUT_US: 'aboutUs',
		GALLERY_SECTION: 'gallerySection',
		ORDER_SECTION: 'orderSection',
		GALLERIA: 'galleria',
		THANK_YOU_SECTION: 'thankYouSection'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

// Load page-specific handlebar partials

/**
 * The template for the about us section
 */
_Handlebars.registerPartial('aboutUs', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.ABOUT_US));

/**
 * The template for the gallery section
 */
_Handlebars.registerPartial('homeGallerySection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.GALLERY_SECTION));

/**
 * The template for the order section
 */
_Handlebars.registerPartial('homeOrderSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.ORDER_SECTION));

/**
 * The template for the thank you section
 */
 _Handlebars.registerPartial('thankYouSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.THANK_YOU_SECTION));

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Initializer function responsible for serving the page
	 *
	 * @author kinsho
	 */
	init: async function ()
	{
		var pageData = {}, templateData = {}, defaultGalleriaData = {},
			populatedPageTemplate;

		console.log('Loading the home page...');

		// Form the main slogan depending on whether the user was redirected to the home page via one of our other proxy sites
		templateData.slogan = GENERIC_SLOGAN;

		// Fetch all the images that we will need to display on the home page
		templateData.homeBannerImages = await fileManager.fetchImagePaths(CONTROLLER_FOLDER);
		pageData.galleryImages = await picturesDAO.fetchGalleryData();
		templateData.thankYouImages = await fileManager.fetchImagePaths(THANK_YOU_FOLDER);

		// Fetch the galleria template as well so that we can add pictures to the gallery from within the client
		templateData.galleriaTemplate = await fileManager.fetchTemplate(CONTROLLER_FOLDER, PARTIALS.GALLERIA);

		// Do not forget to set up default gallery pics that are instantly visible when the page loads
		defaultGalleriaData.group = DEFAULT_KEYWORD;
		defaultGalleriaData.pictures = pageData.galleryImages.slice(0, 6); // Yes, we are assuming more than 6 images in the gallery here
		defaultGalleriaData.show = true;
		templateData.defaultGalleria = await templateManager.populateTemplate(defaultGalleriaData, CONTROLLER_FOLDER, PARTIALS.GALLERIA);

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate(templateData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, pageData, false);
	}
};