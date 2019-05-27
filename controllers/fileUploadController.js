/**
 * @module fileUploadController
 */

// ----------------- EXTERNAL MODULES --------------------------

const responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),

	cookieManager = global.OwlStakes.require('utility/cookies'),
	dropbox = global.OwlStakes.require('utility/dropbox'),

	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO'),
	usersDAO = global.OwlStakes.require('data/DAO/usersDAO');

// ----------------- ENUMS/CONSTANTS --------------------------

const FILETYPES =
	{
		IMAGE : 'picture',
		DRAWING : 'drawing',
		FILE : 'file'
	};

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function responsible for saving uploaded files into our database and Dropbox
	 *
	 * @param {Object} params - the file information
	 *
	 * @author kinsho
	 */
	saveFile: async function (params, cookie, request)
	{
		if (await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent']))
		{
			let username = cookieManager.retrieveAdminCookie(cookie)[0],
				type = params.type,
				dropboxDirectory, updateFunc,
				imgMetas;

			console.log('Saving new file(s) to the order...');

			// Determine where to store the file in Dropbox
			// Also figure out what function we'll be using to modify our order record in the database
			if (type === FILETYPES.IMAGE)
			{
				dropboxDirectory = dropbox.DIRECTORY.ORDERS;
				updateFunc = ordersDAO.updateOrderWithImages;
			}
			else if (type === FILETYPES.DRAWING)
			{
				dropboxDirectory = dropbox.DIRECTORY.DRAWINGS;
				updateFunc = ordersDAO.updateOrderWithDrawings;
			}
			else if (type === FILETYPES.FILE)
			{
				dropboxDirectory = dropbox.DIRECTORY.ORDER_FILES;
				updateFunc = ordersDAO.updateOrderWithFiles;
			}

			// Upload the image(s) to Dropbox
			imgMetas = await dropbox.uploadFile(params.id, params.files, dropboxDirectory);

			if (imgMetas.length)
			{
				// Save all the metadata from the newly uploaded images into the database
				await ordersDAO.saveFilesToOrder(parseInt(params.id, 10), imgMetas, username, updateFunc);

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
	}
};