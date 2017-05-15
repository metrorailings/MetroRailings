/**
 * @module homeController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('Handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/ControllerHelper'),

	rQuery = global.OwlStakes.require('utility/rQuery'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	templateManager = global.OwlStakes.require('utility/templateManager');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'home',
	GALLERY_FOLDER = 'gallery',
	THANK_YOU_FOLDER = 'thankYou',

	GENERIC_SLOGAN = 'Proudly serving artfully crafted railings to all of New Jersey and New York City',
	CUSTOMIZED_SLOGAN = 'Proudly serving artfully crafted railings to ::locality and the rest of the Garden State',
	LOCALITY_PLACEHOLDER = '::locality',

	COM_KEYWORD = '.com',
	RAILINGS_KEYWORD = 'railings',
	METRO_KEYWORD = 'metro',
	HTTP_PROTOCOL = 'http://',
	WWW_SUBDOMAIN = 'www.',
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

// ----------------- PRIVATE FUNCTIONS --------------------------

/**
 * Function responsible for deducing from where the user may have been redirected from
 *
 * @params {String} url - the URL to analyze
 *
 * @returns {String} - the child site from which the user was redirected from
 *
 * @author kinsho
 */
function _findOutRedirectHost(url)
{
	var workspace;

	// Strip out everything starting from the .com portion of the URL
	workspace = url.slice(0, url.indexOf(COM_KEYWORD));

	// Strip out the http:// protocol
	workspace = workspace.replace(HTTP_PROTOCOL, '');

	// Strip out the www subdomain
	workspace = workspace.replace(WWW_SUBDOMAIN, '');

	// Now determine the site that redirected us to the main page
	workspace = workspace.replace(RAILINGS_KEYWORD, '');

	return workspace;
}

// ----------------- I/O FUNCTION TRANSFORMATIONS --------------------------

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Initializer function responsible for serving the page
	 *
	 * @author kinsho
	 */
	init: async function (params, cookie, request)
	{
		var redirectURL = request.headers.referer,
			redirectHost = METRO_KEYWORD,
			pageData = {}, templateData = {}, defaultGalleriaData = {},
			populatedPageTemplate;

		console.log('Loading the home page...');

		// Check if the user was redirected to the main page from another one of our sites
		if (redirectURL)
		{
			redirectHost = _findOutRedirectHost(redirectURL);
		}

		// Form the main slogan depending on whether the user was redirected to the home page via one of our other proxy sites
		templateData.slogan = (redirectHost === METRO_KEYWORD ?
			GENERIC_SLOGAN : CUSTOMIZED_SLOGAN.replace(LOCALITY_PLACEHOLDER, rQuery.capitalize(redirectHost)));

		// Fetch all the images that we will need to display on the home page
		templateData.homeBannerImages = await fileManager.fetchImagePaths(CONTROLLER_FOLDER);
		pageData.galleryImages = await fileManager.fetchImagePaths(GALLERY_FOLDER);
		templateData.thankYouImages = await fileManager.fetchImagePaths(THANK_YOU_FOLDER);

		// Fetch the galleria template as well so that we can add pictures to the gallery from within the client
		templateData.galleriaTemplate = await fileManager.fetchTemplate(CONTROLLER_FOLDER, PARTIALS.GALLERIA);

		// Do not forget to set up default gallery pics that are instantly visible when the page loads
		defaultGalleriaData.group = DEFAULT_KEYWORD;
		defaultGalleriaData.pictures = pageData.galleryImages.slice(0, 6); // Yes, we are assuming more than 6 images in the gallery here
		defaultGalleriaData.show = true;
		templateData.defaultGalleria = await templateManager.populateTemplate(defaultGalleriaData, CONTROLLER_FOLDER, PARTIALS.GALLERIA);

		// Only images that have not been loaded yet need to be sent over to the client in bootstrapped form
		pageData.galleryImages = pageData.galleryImages.slice(6);

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate(templateData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, pageData, false, true);
	}
};