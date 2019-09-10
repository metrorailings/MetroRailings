/**
 * @module shopScheduleController
 */

// ----------------- EXTERNAL MODULES --------------------------

let controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),
	uploadUtility = global.OwlStakes.require('controllers/utility/fileUploadUtility'),
	adminUtility = global.OwlStakes.require('controllers/utility/adminUtility'),
	rQuery = global.OwlStakes.require('utility/rQuery'),

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
			uploadData, adminData,
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

		console.log('Loading the shop schedule page...');

		// Retrieve all open orders
		orders = await ordersDAO.searchForOrdersInProduction();

		// Reorder the open orders so that the orders that do not have due dates are at the bottom of the list
		orders.sort(dateUtility.sortByDueDates);
		pageData.orders = orders;

		// Grab the templates and logic necessary to show files attached to the order
		uploadData = await uploadUtility.basicInit();
		adminData = await adminUtility.basicInit(cookie);
		pageData = rQuery.mergeObjects(uploadData.pageData, pageData);
		pageData = rQuery.mergeObjects(adminData.pageData, pageData);

		// Grab the raw HTML for status modal template
		pageData.statusModalTemplate = await fileManager.fetchTemplate(CONTROLLER_FOLDER, PARTIALS.STATUS_MODAL);

		// Render the page template
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {},
			true,true,true, cookie);
	},

	/**
	 * Function meant to search for all OPEN orders that were modified after a particular date
	 *
	 * @params {Object} params -
	 * 		{
	 * 			date - the date we will use to seek all the OPEN orders that were modified from then onwards
	 * 		}
	 *
	 * @author kinsho 
	 */
	searchOpenOrders: async function (params, cookie, request)
	{
		if (await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent']))
		{
			console.log('Searching for newly modified open orders...');

			let newData = await ordersDAO.searchOpenOrdersByDate(new Date(params.date));

			return {
				statusCode: responseCodes.OK,
				data: newData
			};
		}

		// Return a meaningless response for unauthorized calls
		return {
			statusCode: responseCodes.OK,
			data: ''
		};
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