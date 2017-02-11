/**
 * @module ordersController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),
	_Handlebars = require('Handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/ControllerHelper'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	cookieManager = global.OwlStakes.require('utility/cookies'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),

	usersDAO = global.OwlStakes.require('data/DAO/userDAO'),
	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'orders',

	ADMIN_LOG_IN_URL = '/admin',

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
		var pageData = {},
			populatedPageTemplate;

		if ( !(yield usersDAO.verifyAdminCookie(cookie)) )
		{
			console.log('Redirecting the user to the log-in page...');

			return yield controllerHelper.renderRedirectView(ADMIN_LOG_IN_URL);
		}

		console.log('Loading the orders page...');

		// Grab the raw HTML of the order listing template
		pageData.orderListingTemplate = yield fileManager.fetchTemplate(CONTROLLER_FOLDER, PARTIALS.LISTING);

		// Render the page template
		populatedPageTemplate = yield templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return yield controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {});
	}),

	/**
	 * Function meant to search for all orders that were modified after a particular date
	 *
	 * @params {Object} params -
	 * 		{
	 * 			date - the date we will use to seek all the orders that were modified from then onwards
	 * 		}
	 *
	 * @author kinsho
	 */
	searchOrders: _Q.async(function* (params, cookie)
	{
		if (yield usersDAO.verifyAdminCookie(cookie))
		{
			console.log('Searching for newly modified orders...');

			var newData = yield ordersDAO.searchOrdersByDate(new Date(params.date));

			return JSON.stringify(newData);
		}

		// Return a meaningless response for unauthorized calls
		return JSON.stringify('');
	}),


	/**
	 * Function meant to move an order along to the next phase of development
	 *
	 * @params {Object} params -
	 * 		{
	 * 			orderID - the ID of the order to update
	 * 		}
	 *
	 * @author kinsho
	 */
	updateStatus: _Q.async(function* (params, cookie)
	{
		var updatedData;

		if (yield usersDAO.verifyAdminCookie(cookie))
		{
			var username = cookieManager.retrieveAdminCookie(cookie)[0];

			console.log('Updating a status on order ' + params.orderID);

			updatedData = yield ordersDAO.updateStatus(parseInt(params.orderID, 10), username);
		}

		return {
			statusCode: responseCodes.OK,
			data: updatedData || {}
		};
	})
};