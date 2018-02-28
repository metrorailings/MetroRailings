/**
 * @module paperOrderController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('handlebars'),

	config = global.OwlStakes.require('config/config'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),

	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO'),
	usersDAO = global.OwlStakes.require('data/DAO/userDAO'),

	dateUtility = global.OwlStakes.require('shared/dateUtility'),

	fileManager = global.OwlStakes.require('utility/fileManager'),
	templateManager = global.OwlStakes.require('utility/templateManager');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'paperOrder',

	ADMIN_LOG_IN_URL = '/admin',

	PARTIALS =
	{
		INVOICE_SECTION: 'invoiceSection',
		AGREEMENT_SECTION: 'agreementSection',
		DATE_SECTION: 'dateSection',
		PERSONAL_INFO_SECTION: 'personalInfoSection',
		SIGNATURE_SECTION: 'signatureSection',
		CLOSING_TERMS_SECTION: 'closingTermsSection',
		TIP_SECTION: 'tipSection',
		PAYMENT_HISTORY_SECTION: 'paymentHistorySection'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the invoice that lists out all the aspects of the order for which the user will be charged
 */
_Handlebars.registerPartial('paperOrderRailingsInvoice', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.INVOICE_SECTION));

/**
 * The template for the terms of agreement
 */
_Handlebars.registerPartial('paperOrderTermsOfAgreement', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.AGREEMENT_SECTION));

/**
 * The template for the date of invoice
 */
_Handlebars.registerPartial('paperOrderDateOfInvoice', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.DATE_SECTION));

/**
 * The template for the customer's information
 */
_Handlebars.registerPartial('paperOrderPersonalInfo', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.PERSONAL_INFO_SECTION));

/**
 * The template for the closing terms
 */
_Handlebars.registerPartial('paperOrderClosingTerms', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.CLOSING_TERMS_SECTION));

/**
 * The template for the tip section
 */
_Handlebars.registerPartial('paperOrderTip', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.TIP_SECTION));

/**
 * The template for the payment history section
 */
_Handlebars.registerPartial('paymentHistorySection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.PAYMENT_HISTORY_SECTION));

/**
 * The template for the signature section
 */
_Handlebars.registerPartial('paperOrderSignature', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.SIGNATURE_SECTION));

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
		var pageData = {},
			currentDate = new Date(),
			populatedPageTemplate;

		if ( !(await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent'])) )
		{
			console.log('Redirecting the user to the log-in page...');

			return await controllerHelper.renderRedirectView(ADMIN_LOG_IN_URL);
		}

		console.log('Loading the paper order page...');

		// Check whether parameters are present. If so, determine if we need to pre-populate existing order data
		// into the form. Also check if we need to generate content indicating that the order has been closed
		if (params)
		{
			if (params.id)
			{
				pageData.order = await ordersDAO.searchOrderById(parseInt(params.id, 10));

				// Take into account any modifications made to the price
				pageData.order.pricing.modification = pageData.order.pricing.modification || 0;
				pageData.order.pricing.balanceRemaining = pageData.order.pricing.balanceRemaining || pageData.order.pricing.orderTotal / 2;
				pageData.order.pricing.trueBalanceRemaining = pageData.order.pricing.balanceRemaining + (pageData.order.pricing.modification || 0);
			}

			pageData.closing = params.closing;
		}

		// Fetch the locations of each of our shops
		pageData.companyInfo = config.COMPANY_INFO;

		// Note the current date as well for signing purposes
		pageData.currentDate = dateUtility.FULL_MONTHS[currentDate.getMonth()] + ' ' + currentDate.getDate() +
			dateUtility.findOrdinalSuffix(currentDate.getDate()) + ', ' + currentDate.getFullYear();

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {}, true, true);
	}
};