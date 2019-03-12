/**
 * @module deckRemodelersController
 */

// ----------------- EXTERNAL MODULES --------------------------

let _Handlebars = require('handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),

	fileManager = global.OwlStakes.require('utility/fileManager'),
	templateManager = global.OwlStakes.require('utility/templateManager');

// ----------------- ENUM/CONSTANTS --------------------------

let CONTROLLER_FOLDER = 'deckRemodelers',

	PARTIALS =
	{
		CUSTOMER: 'customerDetails',
		RAILINGS: 'railingDetails',
		MISC: 'miscellaneousDetails'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the customer section
 */
_Handlebars.registerPartial('drCustomerDetails', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.CUSTOMER));

/**
 * The template for the railings section
 */
_Handlebars.registerPartial('drRailingDetails', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.RAILINGS));

/**
 * The template for the miscellaneous info section
 */
_Handlebars.registerPartial('drMiscInfo', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.MISC));

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Initializer function responsible for serving the page
	 *
	 * @author kinsho
	 */
	init: async function()
	{
		console.log('Loading the Deck Remodelers page...');

		// Render the page template
		let populatedPageTemplate = await templateManager.populateTemplate({}, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {}, false, true);
	}
};