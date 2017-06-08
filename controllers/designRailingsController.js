/**
 * @module designRailingsController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('Handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/ControllerHelper'),

	fileManager = global.OwlStakes.require('utility/fileManager'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	cookieManager = global.OwlStakes.require('utility/cookies'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'designRailings',
	UTILITY_FOLDER = 'utility',

	COOKIE_ORDER_INFO = 'basicOrderInfo',
	COOKIE_DESIGN_INFO = 'designInfo',

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
	init: async function (params, cookie)
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

			return await controllerHelper.renderRedirectView(CREATE_ORDER_URL);
		}

		// Load the options carousel template that will be used to render multiple carousels on the page
		pageData.optionsCarouselTemplate = await fileManager.fetchTemplate(UTILITY_FOLDER, PARTIALS.OPTIONS_CAROUSEL);

		// Load the design template
		pageData.designTemplate = await fileManager.fetchTemplate(CONTROLLER_FOLDER, PARTIALS.DESIGN_TEMPLATE);

		// Parse the order data as long as the cookie carrying the data exists
		orderData = (orderData ? JSON.parse(orderData) : {});

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, { order: orderData });
	},

	/**
	 * Action method designed to load specific design details into a cookie before proceeding to the next step of the
	 * order process
	 *
	 * @param {Object} params - the parameters
	 *
	 * @returns {Object}
	 *
	 * @author kinsho
	 */
	continueWithOrder: function (params)
	{
		console.log('Wrapped the order into a cookie before proceeding to the payment phase of the order process...');

		return {
			statusCode: responseCodes.OK,
			data: {},
			cookie: cookieManager.formCookie(COOKIE_DESIGN_INFO, params)
		};
	}
};