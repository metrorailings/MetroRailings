/**
 * @module createPriceChartController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	templateManager = global.OwlStakes.require('utility/templateManager'),

	usersDAO = global.OwlStakes.require('data/DAO/userDAO'),

	defaultPricing = global.OwlStakes.require('shared/pricing/defaultPricing');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'createPriceChart',

	ADMIN_LOG_IN_URL = '/admin',

	PARTIALS =
	{
		OPTIONS: 'chartOption',
		EXTRA: 'chartOptionExtra',
		QUESTIONS: 'questions'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the options to list on the price chart
 */
_Handlebars.registerPartial('chartOption', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.OPTIONS));

/**
 * The template for the questions to also list on the price chart
 */
_Handlebars.registerPartial('questionsSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.QUESTIONS));

/**
 * The template for the HTML snippet where we can detail extra features for a product option
 */
_Handlebars.registerPartial('chartOptionExtra', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.EXTRA));

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Initializer function responsible for serving the page
	 *
	 * @author kinsho
	 */
	init: async function(params, cookie, request)
	{
		var pageData;

		if ( !(await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent'])) )
		{
			console.log('Redirecting the user to the log-in page...');

			return await controllerHelper.renderRedirectView(ADMIN_LOG_IN_URL);
		}

		pageData =
		{
			chartOptionTemplate: await fileManager.fetchTemplate(CONTROLLER_FOLDER, PARTIALS.OPTIONS),
			chartOptionExtra: await fileManager.fetchTemplate(CONTROLLER_FOLDER, PARTIALS.EXTRA),
			defaultOptions: defaultPricing.options,
			extraOptions: defaultPricing.extras
		};

		console.log('Loading the create price chart page...');

		// Render the page template
		var populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {}, false, false);
	}
};