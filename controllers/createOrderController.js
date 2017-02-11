// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),
	_Handlebars = require('Handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/ControllerHelper'),

	templateManager = global.OwlStakes.require('utility/templateManager'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	cookieManager = global.OwlStakes.require('utility/cookies'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes');

// ----------------- ENUMS/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'createOrder',

	COOKIE_ORDER_NAME = 'order',

	PARTIALS =
	{
		TYPE_SECTION: 'typeSection',
		CURVES_SECTION: 'curvesSection',
		LENGTH_SECTION: 'lengthSection',
		STYLE_SECTION: 'styleSection',
		COLORS_SECTION: 'colorsSection',
		SUBMISSION_SECTION: 'submissionSection'
	};

// ----------------- PRIVATE VARIABLES --------------------------

// ----------------- PRIVATE FUNCTIONS --------------------------

// ----------------- PARTIAL TEMPLATES --------------------------

// Load page-specific handlebar partials

/**
 * The template for the step in which the user specifies whether he or she wants new railings for
 * either a set of stairs or a patio of some sort
 */
_Handlebars.registerPartial('createOrderTypeSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.TYPE_SECTION));

/**
 * The template for the step in which the user specifies whether the railings need to be curved
 */
_Handlebars.registerPartial('createOrderCurvesSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.CURVES_SECTION));

/**
 * The template for the step in which the user specifies the length of railing needed for the project
 */
_Handlebars.registerPartial('createOrderLengthSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.LENGTH_SECTION));

/**
 * The template for the step in which the user specifies the style of railing needed for the project
 */
_Handlebars.registerPartial('createOrderStyleSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.STYLE_SECTION));

/**
 * The template for the step in which the user specifies the color he or she wants for the railings
 */
_Handlebars.registerPartial('createOrderColorSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.COLORS_SECTION));

/**
 * The template for the submission button
 */
_Handlebars.registerPartial('createOrderSubmissionSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.SUBMISSION_SECTION));

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Initializer function
	 *
	 * @author kinsho
	 */
	init: _Q.async(function* ()
	{
		var populatedPageTemplate;

		console.log('Loading the create order page...');

		// Now render the page template
		populatedPageTemplate = yield templateManager.populateTemplate({}, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return yield controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {});
	}),

	/**
	 * Action method designed to load specific order details into a cookie before proceeding to the next step of the
	 * order process
	 *
	 * @param {Object} params - the parameters
	 *
	 * @returns {Object}
	 *
	 * @author kinsho
	 */
	saveOrder: function (params)
	{
		console.log('Wrapped the order into a cookie before proceeding to the last step of the order process...');

		return {
			statusCode: responseCodes.OK,
			data: {},
			cookie: cookieManager.formCookie(COOKIE_ORDER_NAME, params)
		};
	}
}