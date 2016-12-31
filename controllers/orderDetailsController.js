/**
 * @module orderDetailsController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),
	_Handlebars = require('Handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/ControllerHelper'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	fileManager = global.OwlStakes.require('utility/fileManager'),

	DAO = global.OwlStakes.require('data/DAO/orderDetailsDAO');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'orderDetails',

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
	init: _Q.async(function* (params)
	{
		var populatedPageTemplate,
			orderNumber = params ? parseInt(params.orderNumber, 10) : undefined,
			pageData = {};

		console.log('Loading the order details page...');

		// @TODO: Redirect the user if he doesn't have an admin cookie or if an order number has not been passed in

		// Fetch the data that will be needed to properly render the page
		pageData = yield DAO.fetchOrder(orderNumber);

		// Now render the page template
		populatedPageTemplate = yield templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return yield controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, { order: pageData });
	})
};