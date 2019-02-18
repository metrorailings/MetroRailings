/**
 * @module createQuoteController
 */

// ----------------- EXTERNAL MODULES --------------------------

var controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),
	orderGeneralUtility = global.OwlStakes.require('controllers/utility/orderGeneralUtility'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	cookieManager = global.OwlStakes.require('utility/cookies'),
	mailer = global.OwlStakes.require('utility/mailer'),
	rQuery = global.OwlStakes.require('utility/rQuery'),
	pdfGenerator = global.OwlStakes.require('utility/pdfGenerator'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),

	prospectsDAO = global.OwlStakes.require('data/DAO/prospectsDAO'),
	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO'),
	usersDAO = global.OwlStakes.require('data/DAO/userDAO'),

	config = global.OwlStakes.require('config/config');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'createQuote',

	CUSTOM_ORDER_EMAIL = 'customerInvoice',
	CUSTOM_ORDER_SUBJECT_HEADER = 'Metro Railings: Your Order (Order #::orderId)',
	ORDER_ID_PLACEHOLDER = '::orderId',

	ADMIN_LOG_IN_URL = '/admin',
	INVOICE_URL = '/orderInvoice?id=::orderId',

	VIEWS_DIRECTORY = '/client/views/',
	DEFAULT_AGREEMENT_TEXT = 'customerAgreement.txt',
	PDF_EXTENSION = '.pdf';

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
			agreementText,
			prospect, allData, pageData, designData, order;

		if ( !(await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent'])) )
		{
			console.log('Redirecting the user to the log-in page...');

			return await controllerHelper.renderRedirectView(ADMIN_LOG_IN_URL);
		}

		console.log('Loading the create quote page...');

		if (params.id)
		{
			prospect = await prospectsDAO.searchProspectById(parseInt(params.id, 10));
		}
		else if (params.testId)
		{
			order = await ordersDAO.searchOrderById(parseInt(params.testId, 10));
		}

		// Gather the data we'll need to properly render the page
		allData = await orderGeneralUtility.basicInit();
		designData = allData.designData;
		pageData = allData.pageData;
		pageData.order = prospect || order || {};

		// Determine which agreement text to present on the page
		agreementText = order && order.text && order.text.agreement && order.text.agreement.join('\n\n');
		pageData.agreement = agreementText || await fileManager.fetchFile(VIEWS_DIRECTORY + CONTROLLER_FOLDER + '/' + DEFAULT_AGREEMENT_TEXT);

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER,
		{
			designData: designData
		}, true, true);
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
			quoteLink,
			quotePDF, quoteAttachment,
			username;

		if (await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent']))
		{
			username = cookieManager.retrieveAdminCookie(cookie)[0];

			console.log('Saving a newly minted order into the system...');

			try
			{
				// Save a new order into the database
				processedOrder = await ordersDAO.setUpNewOrder(params, username);
			}
			catch (error)
			{
				return {
					statusCode: responseCodes.BAD_REQUEST
				};
			}

			// Generate a link to the quote that we can send to the client
			// Ensure that the ID of the order is obfuscated in this URL
			quoteLink = INVOICE_URL.replace(ORDER_ID_PLACEHOLDER, rQuery.obfuscateNumbers(processedOrder._id));

			// Generate a PDF of the quote that we have just generated for the new customer
			quotePDF = await pdfGenerator.htmlToPDF(quoteLink);

			// Send out an e-mail to the customer if at least one e-mail address was provided
			if (params.customer.email)
			{
				// Generate the link that will be sent to the customer so that he can approve and pay for the order
				invoiceLink = config.BASE_URL + quoteLink;

				// Prepare the PDF copy of the quote to be sent over as an attachment
				quoteAttachment = await mailer.generateAttachment(processedOrder._id + PDF_EXTENSION, quotePDF);

				mailHTML = await mailer.generateFullEmail(CUSTOM_ORDER_EMAIL, { orderInvoiceLink: invoiceLink }, CUSTOM_ORDER_EMAIL);
				await mailer.sendMail(mailHTML, '', params.customer.email, CUSTOM_ORDER_SUBJECT_HEADER.replace(ORDER_ID_PLACEHOLDER, processedOrder._id), config.SUPPORT_MAILBOX, '', [quoteAttachment]);
			}
		}

		return {
			statusCode: responseCodes.OK,
			data: { id: processedOrder._id }
		};
	}
};