/**
 * @module shopBoardController
 */

// ----------------- EXTERNAL MODULES --------------------------

let controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),
	adminUtility = global.OwlStakes.require('controllers/utility/adminUtility'),

	templateManager = global.OwlStakes.require('utility/templateManager'),
	rQuery = global.OwlStakes.require('utility/rQuery'),

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
			adminData,
			orders,
			pageData = {};

		if ( !(await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent'])) )
		{
			console.log('Redirecting the user to the log-in page...');

			return await controllerHelper.renderRedirectView(ADMIN_LOG_IN_URL);
		}

		if ( !(await usersDAO.verifyAdminHasPermission(cookie, CONTROLLER_FOLDER)) )
		{
			console.log('Redirecting the user back to whatever his landing page is...');

			return await controllerHelper.renderRedirectView('/' + await usersDAO.retrieveLandingPage(cookie));
		}

		console.log('Loading the shop board...');

		// Retrieve all open orders
		orders = await ordersDAO.searchForOrdersInProduction();

		// Reorder the open orders so that the orders that do not have due dates are at the bottom of the list
		orders.sort(dateUtility.sortByDueDates);
		pageData.orders = orders;

		// Grab the templates and logic necessary to append notes and files onto orders
		adminData = await adminUtility.basicInit(cookie);
		pageData = rQuery.mergeObjects(adminData.pageData, pageData);

		// Render the page template
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {},
			true, true,true, cookie);
	}
};