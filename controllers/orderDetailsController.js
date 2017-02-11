/**
 * @module orderDetailsController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),
	_Handlebars = require('Handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/ControllerHelper'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	cookieManager = global.OwlStakes.require('utility/cookies'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),

	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO'),
	usersDAO = global.OwlStakes.require('data/DAO/userDAO');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'orderDetails',

	ADMIN_LOG_IN_URL = '/admin',

	PARTIALS =
	{
		SUMMARY: 'orderSummary',
		CUSTOMER_INFO: 'customerSummary',
		LOCATION_INFO: 'locationSummary',
		ORDER_SPECIFICS: 'orderSpecifics',
		SAVE_BUTTON: 'submissionSection'
	};

// ----------------- PRIVATE VARIABLES --------------------------

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the order summary section
 */
_Handlebars.registerPartial('orderSummary', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.SUMMARY));

/**
 * The template for the customer summary section
 */
_Handlebars.registerPartial('customerSummary', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.CUSTOMER_INFO));

/**
 * The template for the location summary section
 */
_Handlebars.registerPartial('locationSummary', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.LOCATION_INFO));

/**
 * The template for the order specifics section
 */
_Handlebars.registerPartial('orderSpecifics', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.ORDER_SPECIFICS));

/**
 * The template for the submission button
 */
_Handlebars.registerPartial('saveOrderChangesButton', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.SAVE_BUTTON));

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
			orderNumber = params ? parseInt(params.orderNumber, 10) : undefined,
			pageData = {};

		if ( !(yield usersDAO.verifyAdminCookie(cookie)) )
		{
			console.log('Redirecting the user to the log-in page...');

			return yield controllerHelper.renderRedirectView(ADMIN_LOG_IN_URL);
		}

		console.log('Loading the order details page...');

		// Fetch the data that will be needed to properly render the page
		pageData = yield ordersDAO.searchOrderById(orderNumber);

		// Now render the page template
		populatedPageTemplate = yield templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return yield controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, { order: pageData });
	}),

	/**
	 * Function meant to save all updates that may have been made to a particular order
	 *
	 * @params {Object} params - all the details of the order whose changes will be saved
	 *
	 * @author kinsho
	 */
	saveChanges: _Q.async(function* (params, cookie)
	{
		if (yield usersDAO.verifyAdminCookie(cookie))
		{
			var username = cookieManager.retrieveAdminCookie(cookie)[0];

			console.log('Saving changes made to an order...');

			yield ordersDAO.saveChangesToOrder(params, username);
		}

		return {
			statusCode: responseCodes.OK,
			data: {}
		};
	})
};