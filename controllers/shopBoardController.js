/**
 * @module shopBoardController
 */

// ----------------- EXTERNAL MODULES --------------------------

let controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),

	templateManager = global.OwlStakes.require('utility/templateManager'),

	dateUtility = global.OwlStakes.require('shared/dateUtility'),

	usersDAO = global.OwlStakes.require('data/DAO/userDAO'),
	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO');

// ----------------- ENUM/CONSTANTS --------------------------

const CONTROLLER_FOLDER = 'shopBoard',

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

			console.log('Loading the shop board...');

			// Retrieve all open orders
			orders = await ordersDAO.searchForOrdersInProduction();

			// Reorder the open orders so that the orders that do not have due dates are at the bottom of the list
			orders.sort(dateUtility.sortByDueDates);

			// Render the page template
			populatedPageTemplate = await templateManager.populateTemplate({ orders : orders }, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

			return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {}, true, true);
		}
	};