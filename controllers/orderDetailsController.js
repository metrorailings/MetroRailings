/**
 * @module orderDetailsController
 */

// ----------------- EXTERNAL MODULES --------------------------

const controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),
	orderGeneralUtility = global.OwlStakes.require('controllers/utility/orderGeneralUtility'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	cookieManager = global.OwlStakes.require('utility/cookies'),
	dropbox = global.OwlStakes.require('utility/dropbox'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),

	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO'),
	usersDAO = global.OwlStakes.require('data/DAO/userDAO'),

	config = global.OwlStakes.require('config/config');

// ----------------- ENUM/CONSTANTS --------------------------

const CONTROLLER_FOLDER = 'orderDetails',

	ADMIN_LOG_IN_URL = '/admin';

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
			allData, designData,
			orderNumber = params ? parseInt(params.id, 10) : undefined,
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

		// Gather the basic data we'll need to properly render the page
		allData = await orderGeneralUtility.basicInit(cookie);
		designData = allData.designData;
		pageData = allData.pageData;

		// Fetch the order data that will be needed to fill in the page
		pageData.order = await ordersDAO.searchOrderById(orderNumber);

		// Format the agreement text so that it can be properly presented on the page
		pageData.order.text.agreement = pageData.order.text.agreement.join('\n\n');

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER,
		{
			designData: designData,
			pictures: pageData.order.pictures
		}, true, true);
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