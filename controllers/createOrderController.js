// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),
	_Handlebars = require('handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),

	templateManager = global.OwlStakes.require('utility/templateManager'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	cookieManager = global.OwlStakes.require('utility/cookies'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes');

// ----------------- ENUMS/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'createOrder',

	COOKIE_ORDER_NAME = 'basicOrderInfo',

	PARTIALS =
	{
		QUESTIONS_SECTION: 'preliminaryQuestions',
		SUBMISSION_SECTION: 'submissionSection'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

// Load page-specific handlebar partials

/**
 * The template for the step in which the user answers questions about the railings prior to picking out design choices
 */
_Handlebars.registerPartial('createOrderQuestionsSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.QUESTIONS_SECTION));

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
	continueWithOrder: function (params)
	{
		console.log('Wrapped the order into a cookie before proceeding to the design phase of the order process...');

		return {
			statusCode: responseCodes.OK,
			data: {},
			cookie: cookieManager.formCookie(COOKIE_ORDER_NAME, params)
		};
	}
}