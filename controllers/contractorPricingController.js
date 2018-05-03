/**
 * @module contractorPricingController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('handlebars'),

	googleDAO = global.OwlStakes.require('data/DAO/googleDAO'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	templateManager = global.OwlStakes.require('utility/templateManager'),

	contractorPricing = global.OwlStakes.require('shared/designs/contractorPricing'),
	responseCodes = global.OwlStakes.require('shared/responseStatusCodes');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'contractorPricing',
	UTILITY_FOLDER = 'utility',

	PARTIALS =
	{
		BANNER: 'banner',
		FORM_SECTION: 'clientInput',
		PRICING_TABLE: 'pricingTable'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template gathers information about where the project will be located
 */
_Handlebars.registerPartial('clientInput', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.FORM_SECTION));

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
		var pageData = {};

		console.log('Loading the contractor pricing page...');

		// Grab the raw HTML for the pricing list template
		pageData.pricingTemplate = await fileManager.fetchTemplate(CONTROLLER_FOLDER, PARTIALS.PRICING_TABLE);

		// Render the page template
		var populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {}, false, false);
	},

	/**
	 * Find out the distance from a given zip code to our shop. Use that information to fetch pricing
	 */
	fetchPricing: async function(params)
	{
		var distance;

		console.log('Figuring out the distance between our shop and the zip code the user just gave us right now...');

		// Fetch the distance to the location, if it exists
		distance = await googleDAO.calculateDistanceToZipCode(params.zipCode);
		if (distance !== -1)
		{
			distance = googleDAO.convertKilometersToMiles(distance);
		}
		// If the location does not exist, expect a negative value being returned from the distance function
		else
		{
			return {
				statusCode: responseCodes.BAD_REQUEST
			};
		}

		// Return a 200 response along with the pricing data, modified according to distance
		return {
			statusCode: responseCodes.OK,
			data: contractorPricing.modifyPricingByDistance(distance),
		};
	}
};