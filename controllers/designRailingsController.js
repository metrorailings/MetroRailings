/**
 * @module designRailingsController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),

	fileManager = global.OwlStakes.require('utility/fileManager'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	cookieManager = global.OwlStakes.require('utility/cookies'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'designRailings',

	COOKIE_DESIGN_INFO = 'designInfo',

	PARTIALS =
	{
		TYPE_SECTION: 'typeSection',
		POST_SECTION: 'postSection',
		POST_END_SECTION: 'postEndSection',
		POST_CAP_SECTION: 'postCapSection',
		CENTER_DESIGN_SECTION: 'centerDesignSection',
		COLORS_SECTION: 'colorsSection',
		SUBMISSION_SECTION: 'submissionSection',
		SELECTIONS_SECTION: 'selectedOptions',
		CAROUSEL_PANEL: 'carouselPanel',
		OPTIONS_CAROUSEL: 'optionsCarousel',
		LIST_CAROUSEL: 'optionsList'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the step in which the user specifies the type of railing needed for the project
 */
_Handlebars.registerPartial('designRailingsTypeSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.TYPE_SECTION));

/**
 * The template for the step in which the user specifies the style of post needed for the project
 */
_Handlebars.registerPartial('designRailingsPostSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.POST_SECTION));

/**
 * The template for the step in which the user specifies the type of bookend design needed for the project
 */
_Handlebars.registerPartial('designRailingsPostEndSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.POST_END_SECTION));

/**
 * The template for the step in which the user specifies the cap he or she wants on top of every post
 */
_Handlebars.registerPartial('designRailingsPostCapSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.POST_CAP_SECTION));

/**
 * The template for the step in which the user specifies the design he or she wants running across the middle of the railings
 */
_Handlebars.registerPartial('designRailingsCenterDesignSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.CENTER_DESIGN_SECTION));

/**
 * The template for the step in which the user specifies the color he or she wants for the railings
 */
_Handlebars.registerPartial('designRailingsColorSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.COLORS_SECTION));

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
		var populatedPageTemplate,
			pageData = {};

		console.log('Loading the design railings page...');

		// Load the options carousel template that will be used to render a carousel on the page
		pageData.optionsCarouselTemplate = await fileManager.fetchTemplate(CONTROLLER_FOLDER, PARTIALS.OPTIONS_CAROUSEL);

		// Load the carousel panel template
		pageData.carouselPanelTemplate = await fileManager.fetchTemplate(CONTROLLER_FOLDER, PARTIALS.CAROUSEL_PANEL);

		// Load the options list template that will be used to display a list of options that a user can select from
		pageData.optionsListTemplate = await fileManager.fetchTemplate(CONTROLLER_FOLDER, PARTIALS.LIST_CAROUSEL);

		// Load the selections template that will be used to display all selections that have been made so far
		pageData.selectionsTemplate = await fileManager.fetchTemplate(CONTROLLER_FOLDER, PARTIALS.SELECTIONS_SECTION);

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {});
	},

	/**
	 * Action method designed to load specific design details into a cookie before proceeding to the next step of the
	 * order process
	 *
	 * @param {Object} params - the parameters
	 *
	 * @returns {Object}
	 *
	 * @author kinsho
	 */
	continueWithOrder: function (params)
	{
		console.log('Wrapped the order into a cookie before proceeding to the length part of the order' +
			' process...');

		return {
			statusCode: responseCodes.OK,
			data: {},
			cookie: cookieManager.formCookie(COOKIE_DESIGN_INFO, params)
		};
	}
};