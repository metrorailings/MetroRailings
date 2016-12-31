/**
 * @module ordersController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),
	_Handlebars = require('Handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/ControllerHelper'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	fileManager = global.OwlStakes.require('utility/fileManager'),

	DAO = global.OwlStakes.require('data/DAO/ordersDAO');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'orders',

	PARTIALS =
	{
		FILTER: 'orderFilter',
		LISTING: 'orderListing'
	};

// ----------------- PRIVATE VARIABLES --------------------------

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the order filter section
 */
_Handlebars.registerPartial('orderFilter', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.FILTER));

/**
 * The template for the order listing section
 */
_Handlebars.registerPartial('orderListing', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.LISTING));

// ----------------- MODULE DEFINITION --------------------------
module.exports =
{
	/**
	 * Initializer function responsible for serving the page
	 *
	 * @author kinsho
	 */
	init: _Q.async(function* ()
	{
		var populatedPageTemplate;

		console.log('Loading the orders page...');

		// @TODO: Redirect the user if he doesn't have an admin cookie or if an order number has not been passed in

		// Render the page template
		populatedPageTemplate = yield templateManager.populateTemplate({}, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return yield controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {});
	})
};