/**
 * @module priceChartController
 */

// ----------------- EXTERNAL MODULES --------------------------

const _Handlebars = require('handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	templateManager = global.OwlStakes.require('utility/templateManager'),

	DAO = global.OwlStakes.require('data/DAO/priceChartDAO');


// ----------------- ENUM/CONSTANTS --------------------------

const CONTROLLER_FOLDER = 'priceChart',
	UTILITY_FOLDER = 'utility',

	PARTIALS =
	{
		BANNER: 'banner',
		CHART_OPTIONS: 'options',
		CHART_MULTI_OPTIONS: 'multiOptions'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the banner to display at the top of the page
 */
_Handlebars.registerPartial('bannerSection', fileManager.fetchTemplateSync(UTILITY_FOLDER, PARTIALS.BANNER));

/**
 * The template to render core options
 */
_Handlebars.registerPartial('chartOptions', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.CHART_OPTIONS));

/**
 * The template to render multi-option offerings
 */
_Handlebars.registerPartial('chartMultiOptions', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.CHART_MULTI_OPTIONS));

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Initializer function responsible for serving the page
	 *
	 * @author kinsho
	 */
	init: async function(params)
	{
		console.log('Loading a new price chart...');

		// Use the chart code to fetch the price chart we'll need to display
		let chart = DAO.retrievePriceChart(params.code),
			populatedPageTemplate;

		// Render the page template
		populatedPageTemplate = await templateManager.populateTemplate({ chart : chart }, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {}, false, true);
	}
};