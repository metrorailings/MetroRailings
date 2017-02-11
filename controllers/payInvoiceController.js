// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),
	_Handlebars = require('Handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/ControllerHelper'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	objectHelper = global.OwlStakes.require('utility/objectHelper'),
	cookieManager = global.OwlStakes.require('utility/cookies'),

	DAO = global.OwlStakes.require('data/DAO/ordersDAO'),

	orderModel = global.OwlStakes.require('validators/payInvoice/order'),
	customerModel = global.OwlStakes.require('validators/payInvoice/customer'),
	validatorUtility = global.OwlStakes.require('validators/validatorUtility'),

	pricingStructure = global.OwlStakes.require('shared/pricingStructure'),
	responseCodes = global.OwlStakes.require('shared/responseStatusCodes');

// ----------------- ENUMS/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'payInvoice',

	COOKIE_ORDER_NAME = 'order',
	COOKIE_CUSTOMER_INFO = 'customerInfo',

	CUSTOM_STYLE_KEYWORD = 'custom',

	PARTIALS =
	{
		INVOICE_SECTION: 'invoiceSection',
		AGREEMENT_SECTION: 'agreement',
		PERSONAL_INFO_SECTION: 'personalInfoSection',
		ADDRESS_SECTION: 'addressSection',
		CC_SECTION: 'ccSection',
		SUBMISSION_SECTION: 'submissionSection'
	};

// ----------------- PRIVATE VARIABLES --------------------------

// ----------------- PRIVATE FUNCTIONS --------------------------

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the invoice that lists out all the aspects of the order for which the user will be charged
 */
_Handlebars.registerPartial('railingsInvoice', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.INVOICE_SECTION));

/**
 * The template for the terms of agreement
 */
_Handlebars.registerPartial('termsOfAgreement', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.AGREEMENT_SECTION));

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
		orderData.totalPrice = pricingStructure.calculateOrderTotal(orderData.length);

		// Find some years that can be placed into the expiration year dropdown as selectable options
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

		return yield controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, { order: orderData });
	}),

	saveConfirmedOrder: _Q.async(function* (params)
	{
		console.log('Saving a newly minted order into the system...');

		var orderValidationModel = orderModel(),
			customerValidationModel = customerModel();

		// Populate the customer validation model
		objectHelper.cloneObject(params.customer, customerValidationModel);

		// Populate the order validation model
		objectHelper.cloneObject(params, orderValidationModel);

		// Verify that both models are valid before proceeding
		if (validatorUtility.checkModel(customerValidationModel) && validatorUtility.checkModel(orderValidationModel))
		{
			// Save the order into the database
			yield DAO.saveNewOrder(params);

			// @TODO: Send e-mail to customer

			// Return a 200 response along with a cookie that we will use to render parts of the order confirmation page
			return {
				statusCode: responseCodes.OK,
				data: {},

				// Set up this cookie so that we can render some needed data into the order confirmation page
				cookie: cookieManager.formCookie(COOKIE_CUSTOMER_INFO,
				{
					areaCode: customerValidationModel.areaCode,
					phoneOne: customerValidationModel.phoneOne,
					phoneTwo: customerValidationModel.phoneTwo,
					email: customerValidationModel.customerEmail,
					orderNumber: orderValidationModel._id
				})
			};
		}

		return {
			statusCode: responseCodes.BAD_REQUEST
		};
	})
}