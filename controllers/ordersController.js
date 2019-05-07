/**
 * @module ordersController
 */

// ----------------- EXTERNAL MODULES --------------------------

let _Handlebars = require('handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	cookieManager = global.OwlStakes.require('utility/cookies'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),

	usersDAO = global.OwlStakes.require('data/DAO/userDAO'),
	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO'),

	config = global.OwlStakes.require('config/config');

// ----------------- ENUM/CONSTANTS --------------------------

const CONTROLLER_FOLDER = 'orders',

	ADMIN_LOG_IN_URL = '/admin',

	PARTIALS =
	{
		FILTER: 'orderFilter',
		LISTING: 'orderListing',
		PICTURES: 'orderPictures',
		PRINT: 'orderPrint'
	};

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
	init: async function (params, cookie, request)
	{
		let populatedPageTemplate,
			pageData = {},
			bootData =
			{
				dropboxToken: config.DROPBOX_TOKEN
			};

		if ( !(await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent'])) )
		{
			console.log('Redirecting the user to the log-in page...');

			return await controllerHelper.renderRedirectView(ADMIN_LOG_IN_URL);
		}

		console.log('Loading the orders page...');

		// Grab the raw HTML of the order listing template
		pageData.orderListingTemplate = await fileManager.fetchTemplate(CONTROLLER_FOLDER, PARTIALS.LISTING);

		// Grab the raw HTML of the template we'll use to print out details for any order
		pageData.orderPrintTemplate = await fileManager.fetchTemplate(CONTROLLER_FOLDER, PARTIALS.PRINT);

		// Grab the raw HTML of the order pictures template
		pageData.orderPicturesTemplate = await fileManager.fetchTemplate(CONTROLLER_FOLDER, PARTIALS.PICTURES);

		// Render the page template
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, bootData, true, true);
	},

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
	searchOrders: async function (params, cookie, request)
	{
		if (await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent']))
		{
			console.log('Searching for newly modified orders...');

			let newData = await ordersDAO.searchOrdersByDate(new Date(params.date));

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
	 * Function meant to move an order along to the next phase of development
	 *
	 * @params {Object} params -
	 * 		{
	 * 			orderID - the ID of the order to update
	 * 		}
	 *
	 * @author kinsho
	 */
	updateStatus: async function (params, cookie, request)
	{
		let username, updatedData;

		if (await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent']))
		{
			console.log('Updating a status on order ' + params.orderID);

			username = cookieManager.retrieveAdminCookie(cookie)[0];

			updatedData = await ordersDAO.updateStatus(parseInt(params.orderID, 10), username);
		}

		return {
			statusCode: responseCodes.OK,
			data: (updatedData ? updatedData : {})
		};
	},

	/**
	 * Function meant to remove an order from being managed through the admin system. That order will instead be
	 * transferred to an archival table in the database for the purposes of data back-up
	 *
	 * @params {Object} params -
	 * 		{
	 * 			orderID - the ID of the order to remove
	 * 		}
	 *
	 * @author kinsho
	 */
	removeOrder: async function (params, cookie, request)
	{
		if (await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent']))
		{
			let username = cookieManager.retrieveAdminCookie(cookie)[0];

			console.log('"Deleting" order ' + params.orderID);

			await ordersDAO.removeOrder(parseInt(params.orderID, 10), username);
		}

		return {
			statusCode: responseCodes.OK,
			data: {}
		};
	}
};