/**
 * @module orderInvoiceController
 */

// ----------------- EXTERNAL MODULES --------------------------

let _Handlebars = require('handlebars'),
	_showdown = require('showdown'),

	config = global.OwlStakes.require('config/config'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	cookieManager = global.OwlStakes.require('utility/cookies'),
	mailer = global.OwlStakes.require('utility/mailer'),
	rQuery = global.OwlStakes.require('utility/rQuery'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),
	pricing = global.OwlStakes.require('shared/pricing/pricingData'),
	statuses = global.OwlStakes.require('shared/orderStatus'),

	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO');

// ----------------- ENUM/CONSTANTS --------------------------

const CONTROLLER_FOLDER = 'orderInvoice',
	UTILITY_FOLDER = 'utility',

	ORDER_RECEIPT_EMAIL = 'orderReceipt',
	ADMIN_ORDER_CONFIRMATION_EMAIL = 'adminOrderConfirmed',
	ORDER_RECEIPT_SUBJECT_HEADER = 'Order Confirmed (Order ID #::orderId)',
	ORDER_ID_PLACEHOLDER = '::orderId',

	COOKIE_CUSTOMER_INFO = 'customerInfo',

	PROSPECT_STATUS = 'prospect',

	HOME_URL = '/',

	PARTIALS =
	{
		HEADER_SECTION: 'headerSection',
		NUMBERS_SECTION: 'numbersSection',
		INVOICE_SECTION: 'invoiceSection',
		AGREEMENT_SECTION: 'agreement',
		PERSONAL_INFO_SECTION: 'personalInfoSection',
		ADDRESS_SECTION: 'addressSection',
		CC_SECTION: 'paymentSection',
		SUBMISSION_SECTION: 'submissionSection',
		MULTI_TEXT: 'multiText'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the quote header that also features all our contact information
 */
_Handlebars.registerPartial('orderInvoiceHeader', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.HEADER_SECTION));

/**
 * The template for the subsection of the invoice that explicitly lays out the numbers and breaks down the length
 */
_Handlebars.registerPartial('orderInvoiceNumbersSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.NUMBERS_SECTION));

/**
 * The template for the invoice that lists out all the aspects of the order for which the user will be charged
 */
_Handlebars.registerPartial('orderInvoiceRailingsInvoice', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.INVOICE_SECTION));

/**
 * The template for the terms of agreement
 */
_Handlebars.registerPartial('orderInvoiceTermsOfAgreement', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.AGREEMENT_SECTION));

/**
 * The template lists information about the customer that we will be using to contact him or her
 */
_Handlebars.registerPartial('orderInvoicePersonalInfoSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.PERSONAL_INFO_SECTION));

/**
 * The template lists information about where the railings need to be installed
 */
_Handlebars.registerPartial('orderInvoiceAddressSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.ADDRESS_SECTION));

/**
 * The template gathers credit card data from the user
 */
_Handlebars.registerPartial('orderInvoicePaymentSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.CC_SECTION));

/**
 * The template contains the submission button that the user will press to formally submit the order
 */
_Handlebars.registerPartial('orderInvoiceSubmissionSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.SUBMISSION_SECTION));

/**
 * The template for multi-text inputs
 */
_Handlebars.registerPartial('multiText', fileManager.fetchTemplateSync(UTILITY_FOLDER, PARTIALS.MULTI_TEXT));

// ----------------- PRIVATE MEMBERS --------------------------

// The tool used to convert Markdown text to HTML text
let _showdownConverter = new _showdown.Converter();

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Initializer function responsible for serving the page
	 *
	 * @author kinsho
	 */
	init: async function (params)
	{
		let populatedPageTemplate,
			pageData = {},
			// Use a nonsense order ID if one isn't provided, as that would eventually trigger logic to take the user back to the home page
			orderNumber = params ? parseInt(rQuery.decryptNumbers(params.id), 10) : 0,
			currentYear = new Date().getFullYear(),
			expirationYears = [];

		console.log('Loading the custom order invoice page...');

		// Fetch the data that will be needed to properly render the page
		pageData.order = await ordersDAO.searchOrderById(orderNumber);

		// If no order was found that can be used to populate the invoice, then just take the user back to the home page
		if ( !(pageData.order) || (pageData.order.status === PROSPECT_STATUS) )
		{
			console.log('Redirecting the user back to the home page as no order has been found that matches the passed id');

			return await controllerHelper.renderRedirectView(HOME_URL);
		}

		// Find some years that can be placed into the expiration year dropdown as selectable options
		for (let i = currentYear; i <= currentYear + 10; i++)
		{
			expirationYears.push(i);
		}
		pageData.expirationYears = expirationYears;

		// If any taxes are being charged, set the tax rate so that it can be shown on the page
		pageData.taxRate = pricing.NJ_SALES_TAX_RATE * 100;

		// If any tariffs are being charged, set the tariff rate so that it can be shown on the page
		pageData.tariffRate = pricing.TARIFF_RATE * 100;

		// Convert the agreement text from Markdown format into HTML that can then be pasted into place
		pageData.order.text.agreement = _showdownConverter.makeHtml(pageData.order.text.agreement.join('\n\n'));

		// Fetch the locations of each of our shops
		pageData.companyInfo = config.COMPANY_INFO;

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, pageData);
	},


	/**
	 * Function meant to save all updates that may have been made to a particular order directly from the customer
	 *
	 * @params {Object} params - all the details of the order whose changes will be saved
	 *
	 * @author kinsho
	 */
	saveChangesToOrder: async function (params)
	{
		console.log('Saving changes made to an order...');

		try
		{
			await ordersDAO.saveChangesToOrder(params);
		}
		catch(error)
		{
			return {
				statusCode: responseCodes.BAD_REQUEST
			};
		}

		return {
			statusCode: responseCodes.OK,
			data: {}
		};
	},

	updateStatus: async function (params)
	{
		console.log('Updating the status of an order to indicate it\'s ready for production...');

		// Now change the order's status to indicate it is now a live order
		await ordersDAO.updateStatus(parseInt(params.orderId, 10), statuses.ALL.MATERIAL);

		return {
			statusCode: responseCodes.OK,
			data: {}
		};
	},

	/**
	 * Function meant to save all updates that may have been made to a particular order and charge the user if he
	 * elected to pay for the order by credit card
	 *
	 * @params {Object} params - all the details of the order whose changes will be saved
	 *
	 * @author kinsho
	 */
	approveOrder: async function (params)
	{
		let mailHTML,
			adminMailHTML,
			processedOrder;

		console.log('Approving an order...');

		try
		{
			// Save the now-approved order into the database
			processedOrder = await ordersDAO.finalizeNewOrder(params);
		}
		catch(error)
		{
			return {
				statusCode: responseCodes.BAD_REQUEST
			};
		}

		// Send out an e-mail to the customer if the customer provided his e-mail address
		if (params.customer.email)
		{
			mailHTML = await mailer.generateFullEmail(ORDER_RECEIPT_EMAIL, processedOrder, ORDER_RECEIPT_EMAIL);
			await mailer.sendMail(mailHTML, '', params.customer.email, ORDER_RECEIPT_SUBJECT_HEADER.replace(ORDER_ID_PLACEHOLDER, processedOrder._id), config.SUPPORT_MAILBOX);
		}

		// Send an e-mail to the company admins notifying that the order has been approved
		adminMailHTML = await mailer.generateFullEmail(ADMIN_ORDER_CONFIRMATION_EMAIL, processedOrder, ADMIN_ORDER_CONFIRMATION_EMAIL);
		await mailer.sendMail(adminMailHTML, '', config.SUPPORT_MAILBOX, ORDER_RECEIPT_SUBJECT_HEADER.replace(ORDER_ID_PLACEHOLDER, processedOrder._id), config.SUPPORT_MAILBOX);

		// Return a 200 response along with a cookie that we will use to render parts of the order confirmation page
		return {
			statusCode: responseCodes.OK,
			data: {},

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
};