/**
 * @module estimateLocationController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),

	fileManager = global.OwlStakes.require('utility/fileManager'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	objectHelper = global.OwlStakes.require('utility/objectHelper'),

	locationValidationModel = global.OwlStakes.require('validators/estimateLocation/location'),
	validatorUtility = global.OwlStakes.require('validators/validatorUtility');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'estimateLocation',

	PARTIALS =
	{
		ADDRESS_SECTION: 'locationSection',
		SUBMISSION_SECTION: 'submissionSection'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template lists information about where the railings need to be installed
 */
_Handlebars.registerPartial('estimateLocationAddressSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.ADDRESS_SECTION));

/**
 * The template for the submission button
 */
_Handlebars.registerPartial('estimateLocationSubmissionSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.SUBMISSION_SECTION));

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
		console.log('Loading the location page for the estimate scheduling process...');

		// Render the page template
		var populatedPageTemplate = await templateManager.populateTemplate({}, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {});
	},

	/**
	 * Function responsible for calculating the distance from our shop to the address where the customer wants railings
	 *
	 * @author kinsho
	 */
	calculateDistance: async function(params)
	{
		console.log('Figuring out the distance between our shop and the address the user just gave us right now...');

		// Populate the location validation model
		objectHelper.cloneObject(params, locationValidationModel);

		// Verify that the location details are valid before proceeding
		if (validatorUtility.checkModel(locationValidationModel))
		{

		}
	}
};