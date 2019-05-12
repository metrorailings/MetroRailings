/**
 * @module priorityController
 */

// ----------------- EXTERNAL MODULES --------------------------

let controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	cookieManager = global.OwlStakes.require('utility/cookies'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),
	dateUtility = global.OwlStakes.require('shared/dateUtility'),

	usersDAO = global.OwlStakes.require('data/DAO/userDAO'),
	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO');

// ----------------- ENUM/CONSTANTS --------------------------

const CONTROLLER_FOLDER = 'priority',

	ADMIN_LOG_IN_URL = '/admin';

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
		let populatedPageTemplate,
			orders;

		if ( !(await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent'])) )
		{
			console.log('Redirecting the user to the log-in page...');

			return await controllerHelper.renderRedirectView(ADMIN_LOG_IN_URL);
		}

		console.log('Loading the priority page...');

		// Retrieve all open orders
		orders = await ordersDAO.searchForOpenOrders();

		// Reorder the open orders so that the orders that do not have due dates are at the bottom of the list
		orders.sort(dateUtility.sortByDueDates);

		// Render the page template
		populatedPageTemplate = await templateManager.populateTemplate({ orders : orders }, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {}, true, true);
	},

	/**
	 * Function meant to change the due date for a given order
	 *
	 * @params {Object} params - the ID of the order to modify and the new due date (if one has been selected)
	 *
	 * @author kinsho
	 */
	changeDueDate: async function (params, cookie, request)
	{
		if (await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent']))
		{
			let username = cookieManager.retrieveAdminCookie(cookie)[0];

			console.log('Changing a due date on an order...');

			// Now change the order's due date in the database
			await ordersDAO.changeDueDate(parseInt(params.id, 10), (params.dueDate ? new Date(params.dueDate) : ''), username);
		}

		return {
			statusCode: responseCodes.OK,
			data: {}
		};
	}
};