/**
 * @module orderConfirmationController
 */

// ----------------- EXTERNAL MODULES --------------------------

var config = global.OwlStakes.require('config/config'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),

	templateManager = global.OwlStakes.require('utility/templateManager'),
	cookieManager = global.OwlStakes.require('utility/cookies');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'orderConfirmation',

	COOKIE_CUSTOMER_INFO = 'customerInfo';

// ----------------- PRIVATE VARIABLES --------------------------

// ----------------- I/O FUNCTION TRANSFORMATIONS --------------------------

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
			cookieData = cookieManager.parseCookie(cookie || ''),
			customerData = cookieData[COOKIE_CUSTOMER_INFO],
			pageData = {};

		console.log('Loading the order confirmation page...');

		// Parse the order data as long as the cookie carrying the data exists
		customerData = (customerData ? JSON.parse(customerData) : {});

		// Now organize the data that will be needed to properly render the page
		pageData =
		{
			phoneNumber: '(' + customerData.areaCode + ') ' + customerData.phoneOne + '-' + customerData.phoneTwo,
			email: customerData.email,
			orderNumber: customerData.orderNumber,
			supportPhoneNumber : config.SUPPORT_PHONE_NUMBER
		};

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {});
	}
};