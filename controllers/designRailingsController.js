/**
 * @module designRailingsController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),
	_Handlebars = require('Handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/ControllerHelper'),

	fileManager = global.OwlStakes.require('utility/fileManager'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	cookieManager = global.OwlStakes.require('utility/cookies');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'designRailings',
	UTILITY_FOLDER = 'utility',

	COOKIE_ORDER_INFO = 'basicOrderInfo',

	CREATE_ORDER_URL = '/createOrder',

	PARTIALS =
	{
		POST_SECTION: 'postSection',
		POST_END_SECTION: 'postEndSection',
		POST_CAP_SECTION: 'postCapSection',
		CENTER_DESIGN_SECTION: 'centerDesignSection',
		COLORS_SECTION: 'colorsSection',
		SUBMISSION_SECTION: 'submissionSection',
		DESIGN_TEMPLATE: 'designTemplate',
		OPTIONS_CAROUSEL: 'optionsCarousel'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the step in which the user specifies the style of post needed for the project
 */
_Handlebars.registerPartial('designRailingsPostSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.POST_SECTION));

/**
 * The template for the step in which the user specifies the type of bookend design needed for the project
 */
_Handlebars.registerPartial('designRailingsPostEndSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.POST_END_SECTION));

/**
 * The template for the step in which the user specifies the cap he or she wants on top of every post
 */
_Handlebars.registerPartial('designRailingsPostCapSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.POST_CAP_SECTION));

/**
 * The template for the step in which the user specifies the design he or she wants running across the middle of the railings
 */
_Handlebars.registerPartial('designRailingsCenterDesignSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.CENTER_DESIGN_SECTION));

/**
 * The template for the step in which the user specifies the color he or she wants for the railings
 */
_Handlebars.registerPartial('designRailingsColorSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.COLORS_SECTION));

/**
 * The template for the submission section
 */
_Handlebars.registerPartial('designRailingsSubmissionButton', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.SUBMISSION_SECTION));

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Initializer function responsible for serving the page
	 *
	 * @author kinsho
	 */
	init: _Q.async(function* (params, cookie)
	{
		var populatedPageTemplate,
			cookieData = cookieManager.parseCookie(cookie || ''),
			orderData = cookieData[COOKIE_ORDER_INFO],
			pageData = {};

		console.log('Loading the design railings page...');

		// If the user has not started the order process, redirect him to the first page of the order process
		if (!(orderData))
		{
			console.log('Redirecting the user to the create order page...');

			return yield controllerHelper.renderRedirectView(CREATE_ORDER_URL);
		}

		// Load the options carousel template that will be used to render multiple carousels on the page
		pageData.optionsCarouselTemplate = yield fileManager.fetchTemplate(UTILITY_FOLDER, PARTIALS.OPTIONS_CAROUSEL);

		// Load the design template
		pageData.designTemplate = yield fileManager.fetchTemplate(CONTROLLER_FOLDER, PARTIALS.DESIGN_TEMPLATE);

		// Parse the order data as long as the cookie carrying the data exists
		orderData = (orderData ? JSON.parse(orderData) : {});

		// Now render the page template
		populatedPageTemplate = yield templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return yield controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, { order: orderData });
	})
};