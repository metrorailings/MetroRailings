/**
 * @module orderGeneralController
 */

// ----------------- EXTERNAL MODULES --------------------------

const controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),
	orderGeneralUtility = global.OwlStakes.require('controllers/utility/orderGeneralUtility'),
	noteUtility = global.OwlStakes.require('controllers/utility/noteUtility'),
	fileUtility = global.OwlStakes.require('controllers/utility/fileUploadUtility'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	cookieManager = global.OwlStakes.require('utility/cookies'),
	mailer = global.OwlStakes.require('utility/mailer'),
	rQuery = global.OwlStakes.require('utility/rQuery'),
	pdfGenerator = global.OwlStakes.require('utility/pdfGenerator'),
	dropbox = global.OwlStakes.require('utility/dropbox'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),

	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO'),
	usersDAO = global.OwlStakes.require('data/DAO/userDAO'),

	config = global.OwlStakes.require('config/config');

// ----------------- ENUM/CONSTANTS --------------------------

const CONTROLLER_FOLDER = 'orderGeneral',

	CUSTOM_ORDER_EMAIL = 'customerInvoice',
	CUSTOM_ORDER_SUBJECT_HEADER = 'Metro Railings: Your Order (Order #::orderId)',
	ORDER_ID_PLACEHOLDER = '::orderId',

	ADMIN_LOG_IN_URL = '/admin',
	INVOICE_URL = '/orderInvoice?id=::orderId',

	DEFAULT_STATUS = 'prospect',

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
			allData, noteData, fileUploadData, pageData, designData, order;

		if ( !(await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent'])) )
		{
			console.log('Redirecting the user to the log-in page...');

			return await controllerHelper.renderRedirectView(ADMIN_LOG_IN_URL);
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
		designData = allData.designData;

		// Set the foundational data into place
		pageData = allData.pageData;
		pageData = rQuery.mergeObjects(noteData.pageData, pageData);
		pageData = rQuery.mergeObjects(fileUploadData.pageData, pageData);
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
			{ designData: designData }, true, true);
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
	 * Function meant to upload a new image into Dropbox and attach new image metadata to the order associated with
	 * the new image
	 *
	 * @params {Object} params - the ID of the order to modify and the new pictures to upload
	 *
	 * @author kinsho
	 */
	saveNewPictures: async function (params, cookie, request)
	{
		if (await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent']))
		{
			let username = cookieManager.retrieveAdminCookie(cookie)[0],
				imgMetas;

			console.log('Saving new picture(s) to the order...');

			// Upload the image(s) to Dropbox
			imgMetas = await dropbox.uploadImage(params.id, params.files);

			if (imgMetas.length)
			{
				// Save all the metadata from the newly uploaded images into the database
				await ordersDAO.saveNewPicToOrder(params.id, imgMetas, username);

				return {
					statusCode: responseCodes.OK,
					data: imgMetas
				};
			}
			else
			{
				return {
					statusCode: responseCodes.BAD_REQUEST
				};
			}
		}
	},

	/**
	 * Function meant to delete an image from the Dropbox repository and wipe away an image's metadata from the order
	 * associated with that image
	 *
	 * @params {Object} params - the ID of the order to modify and the picture metadata to delete from that order
	 *
	 * @author kinsho
	 */
	deletePicture: async function (params, cookie, request)
	{
		if (await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent']))
		{
			let username = cookieManager.retrieveAdminCookie(cookie)[0];

			console.log('Deleting a picture from an order...');

			// Delete the image from the Dropbox repository
			if (await dropbox.deleteImage(params.imgMeta.path_lower))
			{
				// Now delete the picture's metadata from the database
				await ordersDAO.deletePicFromOrder(params.id, params.imgMeta, username);
			}
		}

		return {
			statusCode: responseCodes.OK,
			data: {}
		};
	}
};