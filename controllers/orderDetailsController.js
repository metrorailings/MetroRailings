/**
 * @module orderDetailsController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	cookieManager = global.OwlStakes.require('utility/cookies'),
	dropbox = global.OwlStakes.require('utility/dropbox'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),

	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO'),
	usersDAO = global.OwlStakes.require('data/DAO/userDAO'),

	config = global.OwlStakes.require('config/config');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'orderDetails',
	ORDER_SHARED_FOLDER = 'orderGeneral',

	UTILITY_FOLDER = 'utility',

	ADMIN_LOG_IN_URL = '/admin',

	PARTIALS =
	{
		SUMMARY: 'orderSummary',
		CUSTOMER_INFO: 'customerSummary',
		LOCATION_INFO: 'locationSummary',
		ORDER_SPECIFICS: 'orderSpecifics',
		INSTALLATION_SUMMARY: 'installationSummary',
		PRICING_SUMMARY: 'pricingSummary',
		TERMS_SECTION: 'termsSection',
		SAVE_BUTTON: 'submissionSection',
		ORDER_PICTURES: 'orderPictures',
		ORDER_NOTES: 'orderNotes'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the order summary section
 */
_Handlebars.registerPartial('orderSummary', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.SUMMARY));

/**
 * The template for the order notes section
 */
_Handlebars.registerPartial('orderNotes', fileManager.fetchTemplateSync(UTILITY_FOLDER, PARTIALS.ORDER_NOTES));

/**
 * The template for the order pictures section
 */
_Handlebars.registerPartial('orderPictures', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.ORDER_PICTURES));

/**
 * The template for the customer summary section
 */
_Handlebars.registerPartial('customerSummary', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.CUSTOMER_INFO));

/**
 * The template for the location summary section
 */
_Handlebars.registerPartial('locationSummary', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.LOCATION_INFO));

/**
 * The template for the order specifics section
 */
_Handlebars.registerPartial('orderSpecifics', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.ORDER_SPECIFICS));

/**
 * The template for the installation details section
 */
_Handlebars.registerPartial('installationSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.INSTALLATION_SUMMARY));

/**
 * The template for the pricing summary section
 */
_Handlebars.registerPartial('pricingSummary', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.PRICING_SUMMARY));

/**
 * The template for the terms/description section
 */
_Handlebars.registerPartial('termsSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.TERMS_SECTION));

/**
 * The template for the submission button
 */
_Handlebars.registerPartial('saveOrderChangesButton', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.SAVE_BUTTON));

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
			orderNumber = params ? parseInt(params.orderNumber, 10) : undefined,
			pageData =
			{
				dropboxToken: config.DROPBOX_TOKEN
			};

		if ( !(await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent'])) )
		{
			console.log('Redirecting the user to the log-in page...');

			return await controllerHelper.renderRedirectView(ADMIN_LOG_IN_URL);
		}

		console.log('Loading the order details page...');

		// Fetch the data that will be needed to properly render the page
		pageData.order = await ordersDAO.searchOrderById(orderNumber);

		// Format the agreement text so that it can be properly presented on the page
		pageData.order.agreement = pageData.order.agreement.join('\n\n');

		// Load the template that we will be using to render the images
		pageData.picturesTemplate = await fileManager.fetchTemplate(CONTROLLER_FOLDER, PARTIALS.ORDER_PICTURES);

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, pageData, true, true);
	},

	/**
	 * Function meant to save all updates that may have been made to a particular order
	 *
	 * @params {Object} params - all the details of the order whose changes will be saved
	 *
	 * @author kinsho
	 */
	saveChanges: async function (params, cookie, request)
	{
		if (await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent']))
		{
			var username = cookieManager.retrieveAdminCookie(cookie)[0];

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
	saveNewPicture: async function (params, cookie, request)
	{
		if (await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent']))
		{
			var username = cookieManager.retrieveAdminCookie(cookie)[0],
				imgMetas;

			console.log('Saving new picture(s) to the order...');

			// Upload the image(s) to Dropbox
			imgMetas = await dropbox.uploadImage(params.id, params.files);

			// Save all the metadata from the newly uploaded images into the database
			await ordersDAO.saveNewPicToOrder(params.id, imgMetas, username);
		}

		return {
			statusCode: responseCodes.OK,
			data: imgMetas
		};
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
			var username = cookieManager.retrieveAdminCookie(cookie)[0];

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