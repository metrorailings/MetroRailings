/**
 * @module bellariController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	templateManager = global.OwlStakes.require('utility/templateManager'),

	deckPricing = global.OwlStakes.require('shared/designs/deckPricing');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'bellari',
	UTILITY_FOLDER = 'utility',

	PARTIALS =
	{
		BANNER: 'banner'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the banner to display at the top of the page
 */
_Handlebars.registerPartial('bannerSection', fileManager.fetchTemplateSync(UTILITY_FOLDER, PARTIALS.BANNER));

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
		var pageData =
			{
				deckOptions: deckPricing.options,
				extraOptions: deckPricing.extra
			};

		console.log('Loading Bellari\'s page...');

		// Render the page template
		var populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {}, false, false);
	}
};