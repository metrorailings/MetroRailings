/**
 * @module shopScheduleController
 */

// ----------------- EXTERNAL MODULES --------------------------

let controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),
	uploadUtility = global.OwlStakes.require('controllers/utility/fileUploadUtility'),

	fileManager = global.OwlStakes.require('utility/fileManager'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	cookieManager = global.OwlStakes.require('utility/cookies'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),
	dateUtility = global.OwlStakes.require('shared/dateUtility'),

	usersDAO = global.OwlStakes.require('data/DAO/userDAO'),
	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO');

// ----------------- ENUM/CONSTANTS --------------------------

const CONTROLLER_FOLDER = 'shopSchedule',

	ADMIN_LOG_IN_URL = '/admin',

	PARTIALS =
	{
		STATUS_MODAL: 'statusModal'
	};

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
			orders,
			uploadData, pageData;

		if ( !(await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent'])) )
		{
			console.log('Redirecting the user to the log-in page...');

			return await controllerHelper.renderRedirectView(ADMIN_LOG_IN_URL);
		}

		console.log('Loading the shop schedule page...');

		// Retrieve all open orders
		orders = await ordersDAO.searchForOpenOrders();

		// Reorder the open orders so that the orders that do not have due dates are at the bottom of the list
		orders.sort(dateUtility.sortByDueDates);

		// Grab the templates and logic necessary to show files attached to the order
		uploadData = await uploadUtility.basicInit();
		pageData = uploadData.pageData;

		// Grab the raw HTML for status modal template
		pageData.statusModalTemplate = await fileManager.fetchTemplate(CONTROLLER_FOLDER, PARTIALS.STATUS_MODAL);

		// Render the page template
		pageData.orders = orders;
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {}, true, true);
	},

	/**
	 * Function meant to update the production status for a given order
	 *
	 * @params {Object} params - the ID of the order to modify and the new status
	 *
	 * @author kinsho
	 */
	updateProductionStatus: async function (params, cookie, request)
	{
		if (await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent']))
		{
			let username = cookieManager.retrieveAdminCookie(cookie)[0];

			console.log('Changing the production status on an order...');

			// Now change the order's due date in the database
			await ordersDAO.updateStatus(parseInt(params.id, 10), params.status, username, true);
		}

		return {
			statusCode: responseCodes.OK,
			data: {}
		};
	}
};