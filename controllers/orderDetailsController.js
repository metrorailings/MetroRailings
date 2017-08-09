/**
 * @module orderDetailsController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	cookieManager = global.OwlStakes.require('utility/cookies'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),

	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO'),
	usersDAO = global.OwlStakes.require('data/DAO/userDAO'),

	config = global.OwlStakes.require('config/config');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'orderDetails',

	ADMIN_LOG_IN_URL = '/admin',

	PARTIALS =
	{
		SUMMARY: 'orderSummary',
		CUSTOMER_INFO: 'customerSummary',
		LOCATION_INFO: 'locationSummary',
		ORDER_SPECIFICS: 'orderSpecifics',
		PRICING_SUMMARY: 'pricingSummary',
		SAVE_BUTTON: 'submissionSection',
		ORDER_PICTURES: 'orderPictures'
	};

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
 * The template for the pricing summary section
 */
_Handlebars.registerPartial('pricingSummary', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.PRICING_SUMMARY));

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
	init: async function (params, cookie)
	{
		var populatedPageTemplate,
			orderNumber = params ? parseInt(params.orderNumber, 10) : undefined,
			pageData =
			{
				dropboxToken: config.DROPBOX_TOKEN
			};

		if ( !(await usersDAO.verifyAdminCookie(cookie)) )
		{
			console.log('Redirecting the user to the log-in page...');

			return await controllerHelper.renderRedirectView(ADMIN_LOG_IN_URL);
		}

		console.log('Loading the order details page...');

		// Fetch the data that will be needed to properly render the page
		pageData.order = await ordersDAO.searchOrderById(orderNumber);

		// TODO: Prevent any changes from being made should the order be closed

		// Load the template that we will be using to render the images
		pageData.picturesTemplate = await fileManager.fetchTemplate(CONTROLLER_FOLDER, PARTIALS.ORDER_PICTURES);

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, pageData, true);
	},

	/**
	 * Function meant to save all updates that may have been made to a particular order
	 *
	 * @params {Object} params - all the details of the order whose changes will be saved
	 *
	 * @author kinsho
	 */
	saveChanges: async function (params, cookie)
	{
		if (await usersDAO.verifyAdminCookie(cookie))
		{
			var username = cookieManager.retrieveAdminCookie(cookie)[0];

			console.log('Saving changes made to an order...');

			await ordersDAO.saveChangesToOrder(params, username);
		}

		return {
			statusCode: responseCodes.OK,
			data: {}
		};
	},

	/**
	 * Function meant to attach new image metadata to the order associated with the new image
	 *
	 * @params {Object} params - the ID of the order to modify and the new picture metadata
	 *
	 * @author kinsho
	 */
	saveNewPicture: async function (params, cookie)
	{
		if (await usersDAO.verifyAdminCookie(cookie))
		{
			var username = cookieManager.retrieveAdminCookie(cookie)[0];

			console.log('Saving a new picture to the order...');

			await ordersDAO.saveNewPicToOrder(params.id, params.imgMeta, username);
		}

		return {
			statusCode: responseCodes.OK,
			data: {}
		};
	}
};