/**
 * @module adminLogInController
 */

// ----------------- EXTERNAL MODULES --------------------------

var controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	cookieManager = global.OwlStakes.require('utility/cookies'),
	objectHelper = global.OwlStakes.require('utility/objectHelper'),

	DAO = global.OwlStakes.require('data/DAO/userDAO'),

	logInModel = global.OwlStakes.require('validators/adminLogIn/logIn'),
	validatorUtility = global.OwlStakes.require('validators/validatorUtility'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'adminLogIn',

	ORDERS_PAGE_URL = '/orders';

// ----------------- PRIVATE VARIABLES --------------------------

// ----------------- I/O FUNCTION TRANSFORMATIONS --------------------------

// ----------------- MODULE DEFINITION --------------------------
module.exports =
{
	/**
	 * Initializer function responsible for loading the administrator log-in page
	 *
	 * @author kinsho
	 */
	init: async function (params, cookie, request)
	{
		var populatedPageTemplate;

		if (await DAO.verifyAdminCookie(cookie, request.headers['user-agent']))
		{
			console.log('Redirecting the admin to the orders page...');

			return await controllerHelper.renderRedirectView(ORDERS_PAGE_URL);
		}

		console.log('Loading the admin log in page...');

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate({}, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {});
	},

	/**
	 * The action method that would log us into the system
	 */
	logIn: async function (params, cookie, request)
	{
		console.log('Going to try to log an admin into the system...');

		var validationModel = logInModel(),
			userCookie;

		// Populate the validation model
		objectHelper.cloneObject(params, validationModel);

		// Verify that the model is valid before proceeding
		if (validatorUtility.checkModel(validationModel))
		{
			if (await DAO.checkAdminCredentials(params.username, params.password))
			{
				// Generate the cookie we will be using to keep the admin logged in
				userCookie = cookieManager.generateAdminCookie(params.username, params.password, params.rememberMe);

				// Store the cookie in the database so that it can be verified repeatedly as the admin navigates around
				// restricted parts of the site
				await DAO.storeAdminCookie(params.username, userCookie, request.headers['user-agent']);

				// Return a successful response and ensure that the user cookie is included in the response as well
				return {
					statusCode: responseCodes.OK,
					data: {},
					cookie: userCookie
				};
			}
		}

		return {
			statusCode: responseCodes.BAD_REQUEST
		};
	}
};