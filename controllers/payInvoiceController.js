// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('Handlebars'),

	config = global.OwlStakes.require('config/config'),

	controllerHelper = global.OwlStakes.require('controllers/utility/ControllerHelper'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	objectHelper = global.OwlStakes.require('utility/objectHelper'),
	cookieManager = global.OwlStakes.require('utility/cookies'),
	mailer = global.OwlStakes.require('utility/mailer'),

	DAO = global.OwlStakes.require('data/DAO/ordersDAO'),

	orderModel = global.OwlStakes.require('validators/payInvoice/order'),
	customerModel = global.OwlStakes.require('validators/payInvoice/customer'),
	validatorUtility = global.OwlStakes.require('validators/validatorUtility'),

	pricingStructure = global.OwlStakes.require('shared/pricing/pricingData'),
	pricingCalculator = global.OwlStakes.require('shared/pricing/pricingCalculator'),
	responseCodes = global.OwlStakes.require('shared/responseStatusCodes');

// ----------------- ENUMS/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'payInvoice',

	ORDER_RECEIPT_EMAIL = 'orderReceipt',
	ORDER_RECEIPT_SUBJECT_HEADER = 'Order Confirmed (Order ID #::orderId)',
	ORDER_ID_PLACEHOLDER = '::orderId',

	COOKIE_ORDER_INFO = 'basicOrderInfo',
	COOKIE_DESIGN_INFO = 'designInfo',
	COOKIE_CUSTOMER_INFO = 'customerInfo',

	PER_FOOT_PHRASE = ' per foot of railing',
	PER_FEET_PHRASE = ' per ::rate feet of railing',
	RATE_PLACEHOLDER = '::rate',

	PARTIALS =
	{
		INVOICE_SECTION: 'invoiceSection',
		AGREEMENT_SECTION: 'agreement',
		PERSONAL_INFO_SECTION: 'personalInfoSection',
		ADDRESS_SECTION: 'addressSection',
		CC_SECTION: 'ccSection',
		SUBMISSION_SECTION: 'submissionSection'
	};

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

// ----------------- SPECIALIZED HELPERS --------------------------

/**
 * Handlebars helper function designed to fetch prices for individual design options
 *
 * @author kinsho
 */
_Handlebars.registerHelper('fetchDesignPrice', function(designCode)
{
	var designPricing = pricingStructure.DESIGNS[designCode];

	if (designPricing.rate)
	{
		if (designPricing.rate === 1)
		{
			return designPricing.price + PER_FOOT_PHRASE;
		}
		else
		{
			return designPricing.price + PER_FEET_PHRASE.replace(RATE_PLACEHOLDER, designPricing.rate);
		}
	}
	else if (designPricing.price)
	{
		return designPricing.price;
	}

	return '';
});

/**
 * Handlebars helper function designed to fetch subtotals for each design selection
 *
 * @author kinsho
 */
_Handlebars.registerHelper('calculateDesignSubtotal', function(designCode, orderLength)
{
	return (pricingCalculator.calculateDesignCost(orderLength, designCode) || '');
});

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
	init: async function(params, cookie)
	{
		var populatedPageTemplate,
			cookieData = cookieManager.parseCookie(cookie || ''),
			orderData = cookieData[COOKIE_ORDER_INFO],
			designData = cookieData[COOKIE_DESIGN_INFO],
			currentYear = new Date().getFullYear(),
			pageData = {},
			expirationYears = [],
			i;

		console.log('Loading the pay invoice page...');

		// Parse the order data as long as the cookie carrying the data exists
		orderData = (orderData ? JSON.parse(orderData) : {});
		orderData.design = (designData ? JSON.parse(designData) : {});

		// Calculate the total price of the order
		orderData.totalPrice = pricingCalculator.calculateOrderTotal(orderData);

		// Find some years that can be placed into the expiration year dropdown as selectable options
		for (i = currentYear; i <= currentYear + 10; i++)
		{
			expirationYears.push(i);
		}

		// Now organize the data that will be needed to properly render the page
		pageData =
		{
			order: orderData,
			expirationYears: expirationYears,
			pricePerFootOfRailing: pricingStructure.COST_PER_FOOT_OF_RAILING,
			minimumOrderAmount: pricingStructure.MINIMUM_TOTAL
		};

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, { order: orderData });
	},

	saveConfirmedOrder: async function (params)
	{
		console.log('Saving a newly minted order into the system...');

		var orderValidationModel = orderModel(),
			customerValidationModel = customerModel(),
			processedOrder,
			mailHTML;

		// Populate the customer validation model
		objectHelper.cloneObject(params.customer, customerValidationModel);

		// Populate the order validation model
		objectHelper.cloneObject(params, orderValidationModel);

		// Verify that both models are valid before proceeding
		if (validatorUtility.checkModel(customerValidationModel) && validatorUtility.checkModel(orderValidationModel))
		{
			try
			{
				// Save the order into the database
				processedOrder = await DAO.saveNewOrder(params);
			}
			catch(error)
			{
				return {
					statusCode: responseCodes.BAD_REQUEST
				};
			}

			// Send out an e-mail to the customer
			mailHTML = await mailer.generateFullEmail(ORDER_RECEIPT_EMAIL, processedOrder, ORDER_RECEIPT_EMAIL);
			await mailer.sendMail(mailHTML, '', params.customer.email, ORDER_RECEIPT_SUBJECT_HEADER.replace(ORDER_ID_PLACEHOLDER, processedOrder._id), config.SUPPORT_MAILBOX);

			// Return a 200 response along with a cookie that we will use to render parts of the order confirmation page
			return {
				statusCode: responseCodes.OK,
				data: {},

				// Set up this cookie so that we can render some needed data on the order confirmation page
				cookie: cookieManager.formCookie(COOKIE_CUSTOMER_INFO,
				{
					areaCode: processedOrder.customer.areaCode,
					phoneOne: processedOrder.customer.phoneOne,
					phoneTwo: processedOrder.customer.phoneTwo,
					email: processedOrder.customer.email,
					orderNumber: processedOrder._id
				})
			};
		}

		return {
			statusCode: responseCodes.BAD_REQUEST
		};
	}
};