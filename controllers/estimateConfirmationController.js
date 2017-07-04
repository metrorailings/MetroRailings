/**
 * @module estimateConfirmationController
 */

// ----------------- EXTERNAL MODULES --------------------------

var config = global.OwlStakes.require('config/config'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),

	templateManager = global.OwlStakes.require('utility/templateManager'),
	cookieManager = global.OwlStakes.require('utility/cookies');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'estimateConfirmation',

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
			customerData = JSON.parse(cookieData[COOKIE_CUSTOMER_INFO]),
			pageData = {};

		console.log('Loading the estimate confirmation page...');

		// Now organize the data that will be needed to properly render the page
		pageData =
		{
			phoneNumber: '(' + customerData.areaCode + ') ' + customerData.phoneOne + '-' + customerData.phoneTwo,
			email: customerData.email,
			supportPhoneNumber : config.SUPPORT_PHONE_NUMBER
		};

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {});
	}
};