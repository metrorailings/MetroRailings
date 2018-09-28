/**
 * @module printOrderDetailsController
 */

// ----------------- EXTERNAL MODULES --------------------------

var controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),

	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO'),
	usersDAO = global.OwlStakes.require('data/DAO/userDAO'),

	templateManager = global.OwlStakes.require('utility/templateManager');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'printOrderDetails',

	ADMIN_LOG_IN_URL = '/admin',
	ORDERS_URL = '/orders';

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
		var pageData = {},
			populatedPageTemplate;

		if ( !(await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent'])) )
		{
			console.log('Redirecting the user to the log-in page...');

			return await controllerHelper.renderRedirectView(ADMIN_LOG_IN_URL);
		}

		console.log('Printing out order info so that the people in the shop can start fabricating...');

		// Only go forward if the ID is present
		if (params.id)
		{
			pageData.order = await ordersDAO.searchOrderById(parseInt(params.id, 10));
		}
		else
		{
			return await controllerHelper.renderRedirectView(ORDERS_URL);
		}

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {}, true, true);
	}
};