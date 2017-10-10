/**
 * @module prospectDetailsController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	cookieManager = global.OwlStakes.require('utility/cookies'),
	dropbox = global.OwlStakes.require('utility/dropbox'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),

	prospectsDAO = global.OwlStakes.require('data/DAO/prospectsDAO'),
	usersDAO = global.OwlStakes.require('data/DAO/userDAO'),

	config = global.OwlStakes.require('config/config');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'prospectDetails',

	ADMIN_LOG_IN_URL = '/admin',

	PARTIALS =
	{
		SUMMARY: 'prospectSummary',
		CUSTOMER_INFO: 'customerSummary',
		LOCATION_INFO: 'locationSummary',
		SAVE_BUTTON: 'submissionSection',
		PROSPECT_PICTURES: 'prospectPictures'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the prospect pictures section
 */
_Handlebars.registerPartial('prospectPictures', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.PROSPECT_PICTURES));

/**
 * The template for the prospect summary section
 */
_Handlebars.registerPartial('prospectSummary', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.SUMMARY));

/**
 * The template for the customer summary section
 */
_Handlebars.registerPartial('customerSummary', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.CUSTOMER_INFO));

/**
 * The template for the location summary section
 */
_Handlebars.registerPartial('locationSummary', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.LOCATION_INFO));

/**
 * The template for the submission button
 */
_Handlebars.registerPartial('saveProspectChangesButton', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.SAVE_BUTTON));

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
			prospectNumber = params ? parseInt(params.orderNumber, 10) : undefined,
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
		pageData.prospect = await prospectsDAO.searchProspectById(prospectNumber);

		// Load the template that we will be using to render the images
		pageData.picturesTemplate = await fileManager.fetchTemplate(CONTROLLER_FOLDER, PARTIALS.PROSPECT_PICTURES);

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, pageData, true, true);
	},

	/**
	 * Function meant to save all updates that may have been made to a prospect
	 *
	 * @params {Object} params - all the details of the prospects whose changes will be saved
	 *
	 * @author kinsho
	 */
	saveChanges: async function (params, cookie, request)
	{
		if (await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent']))
		{
			var username = cookieManager.retrieveAdminCookie(cookie)[0];

			console.log('Saving changes made to an order...');

			await prospectsDAO.saveChangesToProspect(params, username);
		}

		return {
			statusCode: responseCodes.OK,
			data: {}
		};
	},

	/**
	 * Function meant to upload a new image into Dropbox and attach new image metadata to the prospect associated with
	 * the new image
	 *
	 * @params {Object} params - the ID of the prospect to modify and the new pictures to upload
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

			await prospectsDAO.saveNewPicToProspect(params.id, imgMetas, username);
		}

		return {
			statusCode: responseCodes.OK,
			data: imgMetas
		};
	},

	/**
	 * Function meant to delete an image from the Dropbox repository and wipe away an image's metadata from the prospect
	 * associated with that image
	 *
	 * @params {Object} params - the ID of the prospect to modify and the picture metadata to delete from that prospect
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
				await prospectsDAO.deletePicFromOrder(params.id, params.imgMeta, username);
			}
		}

		return {
			statusCode: responseCodes.OK,
			data: {}
		};
	}
};