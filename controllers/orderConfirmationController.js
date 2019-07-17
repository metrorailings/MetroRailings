/**
 * @module orderConfirmationController
 */

// ----------------- EXTERNAL MODULES --------------------------

let config = global.OwlStakes.require('config/config'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),

	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO'),

	rQuery = global.OwlStakes.require('utility/rQuery'),
	templateManager = global.OwlStakes.require('utility/templateManager');

// ----------------- ENUM/CONSTANTS --------------------------

const CONTROLLER_FOLDER = 'orderConfirmation';

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Initializer function responsible for serving the page
	 *
	 * @author kinsho
	 */
	init: async function (params)
	{
		let populatedPageTemplate,
			order;

		console.log('Loading the order confirmation page...');

		// Retrieve the order
		order = await ordersDAO.searchOrderById(parseInt(rQuery.decryptNumbers(params.id), 10));

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate({ order : order, supportPhoneNumber : config.SUPPORT_PHONE_NUMBER }, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {});
	}
};