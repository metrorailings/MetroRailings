/**
 * @module customInvoiceController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	cookieManager = global.OwlStakes.require('utility/cookies'),
	mailer = global.OwlStakes.require('utility/mailer'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),
	pricing = global.OwlStakes.require('shared/pricing/pricingData'),

	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO'),
	usersDAO = global.OwlStakes.require('data/DAO/userDAO'),
	invoicesDAO = global.OwlStakes.require('data/DAO/invoicesDAO'),

	config = global.OwlStakes.require('config/config');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'customInvoice',

	CUSTOM_INVOICE_EMAIL = 'customInvoice',
	CUSTOM_INVOICE_SUBJECT_HEADER = 'Metro Railings - Invoice (::invoiceId)',

	INVOICE_URL = '/specializedInvoice?id=::invoiceId',
	INVOICE_ID_PLACEHOLDER = '::invoiceId',

	ADMIN_LOG_IN_URL = '/admin',

	PARTIALS =
	{
		FORM: 'customInvoiceForm',
		ITEMS: 'customInvoiceItemTable',
		ITEM_ROW: 'invoiceItemRow',
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template gathers recipient information
 */
_Handlebars.registerPartial('customInvoiceForm', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.FORM));

/**
 * The template lists all the items for which we will be charging the recipient
 */
_Handlebars.registerPartial('customInvoiceItemTable', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.ITEMS));

/**
 * The template for each item listing
 */
_Handlebars.registerPartial('customInvoiceItemRow', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.ITEM_ROW));

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
		var populatedPageTemplate,
			order,
			invoice = {},
			pageData = {};

		if ( !(await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent'])) )
		{
			console.log('Redirecting the user to the log-in page...');

			return await controllerHelper.renderRedirectView(ADMIN_LOG_IN_URL);
		}

		console.log('Loading the custom invoice page...');

		// Grab the raw HTML for the item listing template
		pageData.itemRowTemplate = await fileManager.fetchTemplate(CONTROLLER_FOLDER, PARTIALS.ITEM_ROW);

		// Grab order and/or invoice data if necessary
		if (params.orderId)
		{
			order = await ordersDAO.searchOrderById(parseInt(params.orderId, 10));
		}
		else if (params.invoiceId)
		{
			invoice = await invoicesDAO.searchInvoiceById(parseInt(params.invoiceId), 10);
		}

		pageData.order = order;
		pageData.invoice = invoice;
		// If any taxes are being charged, set the tax rate so that it can be shown on the page
		pageData.taxRate = pricing.NJ_SALES_TAX_RATE * 100;

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, pageData, true, true);
	},

	/**
	 * Function responsible for searching for a particular order given its ID
	 *
	 * @author kinsho
	 */
	searchForOrder: async function(params, cookie, request)
	{
		var order;

		if (await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent']))
		{
			order = await ordersDAO.searchOrderById(params.id);
		}

		if (order)
		{
			return {
				statusCode: responseCodes.OK,
				data: order
			};
		}
		else
		{
			return {
				statusCode: responseCodes.NOT_FOUND
			};
		}

	},

	/**
	 * Function responsible for saving a new customized invoice into the system
	 *
	 * @author kinsho
	 */
	saveNewInvoice: async function (params, cookie, request)
	{
		var processedInvoice,
			invoiceLink,
			mailHTML,
			username;

return {
	statusCode: responseCodes.OK,
};

		if (await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent']))
		{
			username = cookieManager.retrieveAdminCookie(cookie)[0];

			console.log('Saving a custom invoice into the system...');

			try
			{
				// Convert an existing prospect into an order
				processedInvoice = await invoicesDAO.saveInvoice(params, username);
			}
			catch (error)
			{
				return {
					statusCode: responseCodes.BAD_REQUEST
				};
			}

			// Generate the link that will be sent to the customer so that he can approve and pay for the order
			invoiceLink = config.BASE_URL + INVOICE_URL.replace(INVOICE_ID_PLACEHOLDER, processedInvoice._id);

			mailHTML = await mailer.generateFullEmail(CUSTOM_INVOICE_EMAIL, { orderInvoiceLink: invoiceLink }, CUSTOM_INVOICE_EMAIL);
			await mailer.sendMail(mailHTML, '', params.customer.email, CUSTOM_INVOICE_SUBJECT_HEADER.replace(CUSTOM_INVOICE_SUBJECT_HEADER, processedInvoice._id), config.SUPPORT_MAILBOX);
		}

		return {
			statusCode: responseCodes.OK,
		};
	}
};