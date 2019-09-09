/**
 * @module orderGeneralController
 */

// ----------------- EXTERNAL MODULES --------------------------

const controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),
	orderGeneralUtility = global.OwlStakes.require('controllers/utility/orderGeneralUtility'),
	noteUtility = global.OwlStakes.require('controllers/utility/noteUtility'),
	fileUtility = global.OwlStakes.require('controllers/utility/fileUploadUtility'),
	adminUtility = global.OwlStakes.require('controllers/utility/adminUtility'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	cookieManager = global.OwlStakes.require('utility/cookies'),
	mailer = global.OwlStakes.require('utility/mailer'),
	rQuery = global.OwlStakes.require('utility/rQuery'),
	pdfGenerator = global.OwlStakes.require('utility/pdfGenerator'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),
	statuses = global.OwlStakes.require('shared/orderStatus'),

	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO'),
	usersDAO = global.OwlStakes.require('data/DAO/userDAO'),

	config = global.OwlStakes.require('config/config');

// ----------------- ENUM/CONSTANTS --------------------------

const CONTROLLER_FOLDER = 'orderGeneral',

	CUSTOM_ORDER_EMAIL = 'customerInvoice',
	CUSTOM_ORDER_SUBJECT_HEADER = 'Metro Railings: Your Order (Order #::orderId)',
	ORDER_ID_PLACEHOLDER = '::orderId',

	ORDER_RECEIPT_EMAIL = 'orderReceipt',
	ADMIN_ORDER_CONFIRMATION_EMAIL = 'adminOrderConfirmed',
	ORDER_RECEIPT_SUBJECT_HEADER = 'Order Confirmed (Order ID #::orderId)',

	DEFAULT_STATUS = 'prospect',

	INVOICE_URL = '/orderInvoice?id=::orderId',
	ADMIN_LOG_IN_URL = '/admin',

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
		let populatedPageTemplate,
			agreementText,
			allData, noteData, fileUploadData, pageData, designData, adminData, order;

		if ( !(await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent'])) )
		{
			console.log('Redirecting the user to the log-in page...');

			return await controllerHelper.renderRedirectView(ADMIN_LOG_IN_URL);
		}

		if ( !(await usersDAO.verifyAdminHasPermission(cookie, CONTROLLER_FOLDER)) )
		{
			console.log('Redirecting the user back to whatever his landing page is...');

			return await controllerHelper.renderRedirectView('/' + await usersDAO.retrieveLandingPage(cookie));
		}

		console.log('Loading the order page...');

		// Pull all order data if we're modifying an existing order within our database
		if (params.id)
		{
			order = await ordersDAO.searchOrderById(parseInt(params.id, 10));
		}

		// Gather the foundational data we'll need to properly render the page
		allData = await orderGeneralUtility.basicInit(cookie);
		noteData = await noteUtility.basicInit();
		fileUploadData = await fileUtility.basicInit();
		adminData = await adminUtility.basicInit(cookie);
		designData = allData.designData;

		// Set the foundational data into place
		pageData = allData.pageData;
		pageData = rQuery.mergeObjects(noteData.pageData, pageData);
		pageData = rQuery.mergeObjects(fileUploadData.pageData, pageData);
		pageData = rQuery.mergeObjects(adminData.pageData, pageData);
		pageData.order =  order || { status : DEFAULT_STATUS };

		// Determine which agreement text to present on the page
		agreementText = order && order.text && order.text.agreement && order.text.agreement.join('\n\n');
		pageData.agreement = agreementText || await fileManager.fetchFile(VIEWS_DIRECTORY + CONTROLLER_FOLDER + '/' + DEFAULT_AGREEMENT_TEXT);

		// If the order has notes, pull the full version of those notes from the back-end
		if (pageData.order._id && pageData.order.notes && pageData.order.notes.length)
		{
			pageData.order.notes = await noteUtility.retrieveNotesByOrderId(pageData.order._id);
		}

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER,
			{ designData: designData }, true, true,true, cookie);
	},

	/**
	 * Function responsible for saving a new custom order into the system
	 *
	 * @author kinsho
	 */
	saveProgressOnOrder: async function (params, cookie, request)
	{
		let username;

		if (await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent']))
		{
			username = cookieManager.retrieveAdminCookie(cookie)[0];

			console.log('Saving a prospect into the system...');

			try
			{
				// Save a new prospect into the database
				await ordersDAO.saveProspect(params, username);

				return {
					statusCode: responseCodes.OK,
					data: {}
				};
			}
			catch (error)
			{
				return {
					statusCode: responseCodes.BAD_REQUEST
				};
			}
		}
	},

	/**
	 * Function responsible for saving a new custom order into the system
	 *
	 * @author kinsho
	 */
	saveNewOrder: async function (params, cookie, request)
	{
		let processedOrder,
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
				// Save a new order or convert an prospect within the database
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
				await mailer.sendMail(mailHTML, '', params.customer.email, 
					CUSTOM_ORDER_SUBJECT_HEADER.replace(ORDER_ID_PLACEHOLDER, processedOrder._id),
					config.SUPPORT_MAILBOX, '', [quoteAttachment]);
			}
		}

		return {
			statusCode: responseCodes.OK,
			data: { id: processedOrder._id }
		};
	},

	/**
	 * Function meant to save all updates that may have been made to a particular order
	 *
	 * @params {Object} params - all the details of the order whose changes will be saved
	 *
	 * @author kinsho
	 */
	saveChangesToOrder: async function (params, cookie, request)
	{
		if (await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent']))
		{
			let username = cookieManager.retrieveAdminCookie(cookie)[0];

			console.log('Saving changes made to an order...');

			await ordersDAO.saveChangesToOrder(params, username);
		}

		return {
			statusCode: responseCodes.OK,
			data: {}
		};
	},

	/**
	 * Function that updates the status of an order to indicate that it is now live
	 *
	 * @params {Object} params - the ID of the order to update
	 *
	 * @author kinsho
	 */
	openOrder: async function (params)
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
	 * Function meant to send out confirmation e-mails to both the customer and the administrators
	 *
	 * @params {Object} params - all the details of the order that will be needed to populate these e-mails
	 *
	 * @author kinsho
	 */
	sendConfirmationEmails: async function (params)
	{
		let order,
			mailHTML,
			quoteAttachment, quotePDF,
			adminMailHTML;

		console.log('Sending out confirmation e-mails');

		// Fetch the order that will be used to write out the e-mails
		order = await ordersDAO.searchOrderById(params.orderId);

		// Send out an e-mail to the customer if the customer provided his e-mail address
		if (order.customer.email)
		{
			// Generate a PDF of the quote that has been finalized for this new customer
			quotePDF = await pdfGenerator.htmlToPDF(INVOICE_URL.replace(ORDER_ID_PLACEHOLDER, rQuery.obfuscateNumbers(order._id)));

			// Prepare the PDF copy of the quote to be sent over as an attachment
			quoteAttachment = await mailer.generateAttachment(order._id + PDF_EXTENSION, quotePDF);

			mailHTML = await mailer.generateFullEmail(ORDER_RECEIPT_EMAIL, order, ORDER_RECEIPT_EMAIL);
			await mailer.sendMail(mailHTML, '', order.customer.email, ORDER_RECEIPT_SUBJECT_HEADER.replace(ORDER_ID_PLACEHOLDER, order._id), config.SUPPORT_MAILBOX, '', [quoteAttachment]);
		}

		// Send an e-mail to the company admins notifying that the order has been approved
		adminMailHTML = await mailer.generateFullEmail(ADMIN_ORDER_CONFIRMATION_EMAIL, order, ADMIN_ORDER_CONFIRMATION_EMAIL);
		await mailer.sendMail(adminMailHTML, '', config.SUPPORT_MAILBOX, ORDER_RECEIPT_SUBJECT_HEADER.replace(ORDER_ID_PLACEHOLDER, order._id), config.SUPPORT_MAILBOX);

		// Return a 200 response along with a cookie that we will use to render parts of the order confirmation page
		return {
			statusCode: responseCodes.OK,
			data: {},
		};
	}
};