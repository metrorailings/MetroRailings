/**
 * @module estimateLocationController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('handlebars'),

	googleDAO = global.OwlStakes.require('data/DAO/googleDAO'),
	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),

	fileManager = global.OwlStakes.require('utility/fileManager'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	objectHelper = global.OwlStakes.require('utility/objectHelper'),
	cookieManager = global.OwlStakes.require('utility/cookies'),

	locationModel = global.OwlStakes.require('validators/estimateLocation/location'),
	validatorUtility = global.OwlStakes.require('validators/validatorUtility'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'estimateLocation',

	COOKIE_ESTIMATE_DISTANCE_INFO = 'estimateDistance',

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
	checkLocationValidity: async function(params)
	{
		var locationValidationModel = locationModel(),
			distance;

		console.log('Figuring out the distance between our shop and the address the user just gave us right now...');

		// Populate the location validation model
		objectHelper.cloneObject(params, locationValidationModel);

		// Verify that the location details are valid before proceeding
		if (validatorUtility.checkModel(locationValidationModel))
		{
			// Fetch the distance to the location, if it exists
			distance = await googleDAO.calculateDistance(params);

			// If the location does not exist, expect a negative value being returned from the distance function
			if (distance === -1)
			{
				return {
					statusCode: responseCodes.BAD_REQUEST
				};
			}

			// Return a 200 response along with a cookie that we will use to book an estimate
			return {
				statusCode: responseCodes.OK,
				data: {},

				// Set up this cookie so that we can properly charge the user on the estimate booking page
				cookie: cookieManager.formCookie(COOKIE_ESTIMATE_DISTANCE_INFO,
				{
					distance: parseFloat((distance / 1000 * 0.62).toFixed(2)),
					address: params.address,
					aptSuiteNumber: params.aptSuiteNumber,
					city: params.city,
					state: params.state,
					zipCode: params.zipCode
				})
			};

		}
	}
};