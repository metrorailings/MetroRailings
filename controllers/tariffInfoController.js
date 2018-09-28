/**
 * @module tariffInfoController
 */

// ----------------- EXTERNAL MODULES --------------------------

var controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),

	templateManager = global.OwlStakes.require('utility/templateManager');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'tariffInfo';

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Initializer function responsible for serving the page
	 *
	 * @author kinsho
	 */
	init: async function ()
	{
		var pageData = {},
			populatedPageTemplate;

		console.log('Loading the tariff page...');

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, pageData, false, false);
	}
};