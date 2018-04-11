/**
 * @module conventionContactController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('handlebars'),

	conventionDAO = global.OwlStakes.require('data/DAO/conventionDAO'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	templateManager = global.OwlStakes.require('utility/templateManager'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'conventionContact',
	UTILITY_FOLDER = 'utility',

	PARTIALS =
	{
		BANNER: 'banner',
		CONVENTION_SECTION_NAVIGATION: 'conventionNavigationSection'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the navigation area
 */
_Handlebars.registerPartial('conventionNavigationSection', fileManager.fetchTemplateSync(UTILITY_FOLDER, PARTIALS.CONVENTION_SECTION_NAVIGATION));

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
	init: async function ()
	{
		var populatedPageTemplate;

		console.log('Loading the convention contact page...');

		// Render the page template
		populatedPageTemplate = await templateManager.populateTemplate({}, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {}, true, true);
	},

	/**
	 * Function responsible for loading contact information into the database
	 *
	 * @param params - the contact information
	 *
	 * @author kinsho
	 */
	saveNewContact: async function (params)
	{
		console.log('Saving new contact information...');

		// Store the new support request into the database for recording purposes
		if (await conventionDAO.insertNewContact(params))
		{
			// Return a 200 response back to the client
			return {
				statusCode: responseCodes.OK,
				data: {}
			};
		}

		// Should validation fail, return a bad request back to the client
		return {
			statusCode: responseCodes.BAD_REQUEST
		};
	}
};