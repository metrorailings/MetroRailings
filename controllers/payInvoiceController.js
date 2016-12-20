// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),
	_Handlebars = require('Handlebars'),
	_request = require('request'),
	controllerHelper = global.OwlStakes.require('controllers/utility/ControllerHelper'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	objectHelper = global.OwlStakes.require('utility/objectHelper'),
	confirmedOrderModel = global.OwlStakes.require('validators/payInvoice/submittedOrder'),
	validatorUtility = global.OwlStakes.require('validators/validatorUtility'),
	responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),
	cookieManager = global.OwlStakes.require('utility/cookies');

// ----------------- ENUMS/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'payInvoice',

	COOKIE_ORDER_NAME = 'order',
	COOKIE_CUSTOMER_INFO = 'customerInfo',

	CUSTOM_STYLE_KEYWORD = 'custom',
	COST_PER_FOOT_OF_RAILING = '60',

	PARTIALS =
	{
		INVOICE_SECTION: 'invoiceSection',
		PERSONAL_INFO_SECTION: 'personalInfoSection',
		ADDRESS_SECTION: 'addressSection',
		CC_SECTION: 'ccSection',
		SUBMISSION_SECTION: 'submissionSection'
	},

	CC_BIN_LIST_URL = 'http://www.binlist.net/json/::ccNumber',

	CC_NUMBER_PLACEHOLDER = '::ccNumber';

// ----------------- PRIVATE VARIABLES --------------------------

// ----------------- PRIVATE FUNCTIONS --------------------------

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the invoice that lists out all the aspects of the order for which the user will be charged
 */
_Handlebars.registerPartial('railingsInvoice', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.INVOICE_SECTION));

/**
 * The template gathers information about the customer that we will be using to contact him or her
 */
_Handlebars.registerPartial('personalInfoSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.PERSONAL_INFO_SECTION));

/**
 * The template gathers information about where the railings need to be installed
 */
_Handlebars.registerPartial('addressSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.ADDRESS_SECTION));

/**
 * The template gathers credit card data from the user
 */
_Handlebars.registerPartial('ccSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.CC_SECTION));

/**
 * The template contains the submission button that the user will press to formally submit the order
 */
_Handlebars.registerPartial('submissionSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.SUBMISSION_SECTION));

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Initializer function
	 *
	 * @param {Object} params - nothing will be passed here
	 * @param {String} cookie - all cookies sent along with the request
	 *
	 * @author kinsho
	 */
	init: _Q.async(function* (params, cookie)
	{
		var populatedPageTemplate,
			cookieData = cookieManager.parseCookie(cookie || ''),
			orderData = cookieData[COOKIE_ORDER_NAME],
			currentYear = new Date().getFullYear(),
			pageData = {},
			expirationYears = [],
			i;

		console.log('Loading the pay invoice page...');

		// Parse the order data as long as the cookie carrying the data exists
		orderData = (orderData ? JSON.parse(orderData) : {});

		// Set the flag marking the order as a personalized order
		orderData.isCustomOrder = (orderData.style === CUSTOM_STYLE_KEYWORD);

		// Calculate the total price of the order
		orderData.totalPrice = (orderData.length * COST_PER_FOOT_OF_RAILING).toFixed(2);
		orderData.totalPrice = Math.max(orderData.totalPrice, 600.00);

		// Populate some years that can then be populated into the expiration year dropdown
		for (i = currentYear; i <= currentYear + 10; i++)
		{
			expirationYears.push(i);
		}

		// Now organize the data that will be needed to properly render the page
		pageData =
		{
			order: orderData,
			expirationYears: expirationYears
		};

		// Now render the page template
		populatedPageTemplate = yield templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return yield controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {});
	}),

	/**
	 * Action function that returns information determining whether a credit card number is acceptable
	 *
	 * @param {Object} params -
	 * 		{
	 * 			ccNumber {String} : the credit card number to validate
	 * 		}
	 *
	 * @returns {Object || boolean} - either an object containing information about the credit card in context
	 * 		or a false boolean value indicating nothing meaningful was returned from the binList service
	 *
	 * @author kinsho
	 */
	validateCreditCard: function(params)
	{
		console.log('Going to validate the following credit card number ----> ' + params.ccNumber);

		var deferred = _Q.defer();

		_request.get(CC_BIN_LIST_URL.replace(CC_NUMBER_PLACEHOLDER, params.ccNumber), (error, response) =>
		{
			// Return credit card data for successful responses or return a simple 'false' value should there be any
			// other type of response returned
			deferred.resolve((response.statusCode === 200 ? JSON.stringify(response.body) : JSON.stringify(false)));
		});

		return deferred.promise;
	},

	saveConfirmedOrder: function(params)
	{
		console.log('Saving a newly minted order into the system...');

		var validationModel = confirmedOrderModel();

		// Populate the validation model
		objectHelper.cloneObject(params, validationModel);

		// Verify that the model is valid before proceeding
		if (validatorUtility.checkModel(validationModel))
		{
			// @TODO: Send data to database
			// @TODO: Get confirmation number
			// @TODO: Send e-mail to customer

			return {
				statusCode: responseCodes.OK,
				data: {},

				// Set up this cookie so that we can render some needed data into the order confirmation page
				cookie: cookieManager.formCookie(COOKIE_CUSTOMER_INFO,
				{
					areaCode: params.areaCode,
					phoneOne: params.phoneOne,
					phoneTwo: params.phoneTwo,
					email: params.customerEmail,
					confirmationNumber: 1234 // @TODO: Set actual confirmation number here
				})
			};
		}
		else
		{
			return {
				statusCode: responseCodes.BAD_REQUEST
			};
		}
	}
}