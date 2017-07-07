/**
 * @module lengthEstimationController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),

	fileManager = global.OwlStakes.require('utility/fileManager'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	cookieManager = global.OwlStakes.require('utility/cookies'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'lengthEstimation',

	COOKIE_ORDER_INFO = 'basicOrderInfo',
	COOKIE_DESIGN_INFO = 'designInfo',
	COOKIE_LENGTH_INFO = 'lengthInfo',

	CREATE_ORDER_URL = '/createOrder',

	PARTIALS =
	{
		HELP_SECTION: 'helpSection',
		VALUES_SECTION:  'valuesSection',
		SUBMISSION_SECTION: 'submissionSection'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the step in which we help the user figure out how to measure the length of railing needed
 */
_Handlebars.registerPartial('lengthEstimationHelpSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.HELP_SECTION));

/**
 * The template for the step in which the user specifies a rough range of how much railing is needed
 */
_Handlebars.registerPartial('lengthEstimationValuesSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.VALUES_SECTION));

/**
 * The template for the submission section
 */
_Handlebars.registerPartial('lengthEstimationSubmissionSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.SUBMISSION_SECTION));

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
			designData = cookieData[COOKIE_DESIGN_INFO];

		console.log('Loading the length estimation page...');

		// If the user has not started the order process, redirect him to the first page of the order process
		if (!(orderData) && !(designData))
		{
			console.log('Redirecting the user to the create order page...');

			return await controllerHelper.renderRedirectView(CREATE_ORDER_URL);
		}

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate({}, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {});
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
		console.log('Wrapped the order into a cookie before proceeding to the quote...');

		return {
			statusCode: responseCodes.OK,
			data: {},
			cookie: cookieManager.formCookie(COOKIE_LENGTH_INFO, params)
		};
	}
};