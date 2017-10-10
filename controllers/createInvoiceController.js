/**
 * @module createInvoiceController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	cookieManager = global.OwlStakes.require('utility/cookies'),
	mailer = global.OwlStakes.require('utility/mailer'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),

	prospectsDAO = global.OwlStakes.require('data/DAO/prospectsDAO'),
	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO'),
	usersDAO = global.OwlStakes.require('data/DAO/userDAO'),

	config = global.OwlStakes.require('config/config');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'createInvoice',

	CUSTOM_ORDER_EMAIL = 'customerInvoice',
	CUSTOM_ORDER_SUBJECT_HEADER = 'Your Railings Order (Order ID #::orderId)',
	ORDER_ID_PLACEHOLDER = '::orderId',

	ADMIN_LOG_IN_URL = '/admin',
	INVOICE_URL = 'orderInvoice?id=::orderId',

	VIEWS_DIRECTORY = '/client/views/',
	DEFAULT_AGREEMENT_TEXT = 'defaultAgreement.txt',

	PARTIALS =
	{
		CUSTOMER: 'customerSection',
		LOCATION: 'locationSection',
		RAILINGS: 'railingsSection',
		AGREEMENT: 'agreementSection',
		SUBMISSION_BUTTON: 'submissionSection'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the customer section
 */
_Handlebars.registerPartial('createInvoiceCustomerSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.CUSTOMER));

/**
 * The template for the location section
 */
_Handlebars.registerPartial('createInvoiceLocationSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.LOCATION));

/**
 * The template for the railings section
 */
_Handlebars.registerPartial('createInvoiceRailingsSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.RAILINGS));

/**
 * The template for the agreement section
 */
_Handlebars.registerPartial('createInvoiceAgreementSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.AGREEMENT));

/**
 * The template for the submission button
 */
_Handlebars.registerPartial('saveInvoiceButton', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.SUBMISSION_BUTTON));

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
			agreementText = await fileManager.fetchFile(VIEWS_DIRECTORY + CONTROLLER_FOLDER + '/' + DEFAULT_AGREEMENT_TEXT),
			prospect = {},
			pageData;

		if ( !(await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent'])) )
		{
			console.log('Redirecting the user to the log-in page...');

			return await controllerHelper.renderRedirectView(ADMIN_LOG_IN_URL);
		}

		console.log('Loading the create invoice page...');

		if (params.id)
		{
			prospect = await prospectsDAO.searchProspectById(parseInt(params.id, 10));
		}

		pageData =
		{
			prospect: prospect,
			agreement: agreementText,
			defaultTimeLimit: config.DEFAULT_TIME_LIMIT
		};

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, { prospectId: prospect._id }, true, true);
	},

	/**
	 * Function responsible for saving a new custom order into the system
	 *
	 * @author kinsho
	 */
	saveNewOrder: async function (params, cookie, request)
	{
		var processedOrder,
			invoiceLink,
			mailHTML,
			username;

		if (await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent']))
		{
			username = cookieManager.retrieveAdminCookie(cookie)[0];

			console.log('Saving a newly minted custom order into the system...');

			try
			{
				if (params._id)
				{
					// Convert an existing prospect into an order
					processedOrder = await prospectsDAO.convertToOrder(params._id, params, username);
				}
				else
				{
					// Save a new order into the database
					processedOrder = await ordersDAO.setUpNewOrder(params, username);
				}
			}
			catch (error)
			{
				return {
					statusCode: responseCodes.BAD_REQUEST
				};
			}

			// Send out an e-mail to the customer if an e-mail address was provided
			if (params.customer.email)
			{
				// Generate the link that will be sent to the customer so that he can approve and pay for the order
				invoiceLink = config.BASE_URL + INVOICE_URL.replace(ORDER_ID_PLACEHOLDER, processedOrder._id);

				mailHTML = await mailer.generateFullEmail(CUSTOM_ORDER_EMAIL, { orderInvoiceLink: invoiceLink }, CUSTOM_ORDER_EMAIL);
				await mailer.sendMail(mailHTML, '', params.customer.email, CUSTOM_ORDER_SUBJECT_HEADER.replace(ORDER_ID_PLACEHOLDER, processedOrder._id), config.SUPPORT_MAILBOX);
			}
		}

		return {
			statusCode: responseCodes.OK,
			data: { id: processedOrder._id }
		};
	}
};