/**
 * @module adminLogInController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),

	controllerHelper = global.OwlStakes.require('controllers/utility/ControllerHelper'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	cookieManager = global.OwlStakes.require('utility/cookies'),
	objectHelper = global.OwlStakes.require('utility/objectHelper'),

	logInModel = global.OwlStakes.require('validators/adminLogIn/login'),
	validatorUtility = global.OwlStakes.require('validators/validatorUtility'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),
	DAO = global.OwlStakes.require('data/DAO/adminLoginDAO');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'adminLogIn',

	COOKIE_ADMIN_INFO = 'owl';

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
	init: _Q.async(function* (params, cookie)
	{
		var populatedPageTemplate,
			cookieData = cookieManager.parseCookie(cookie || '');

		console.log('Loading the admin log in page...');

		// Now render the page template
		populatedPageTemplate = yield templateManager.populateTemplate({}, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return yield controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {});
	}),

	/**
	 * The action method that would log us into the system
	 */
	logIn: _Q.async(function* (params)
	{
		console.log('Going to try to log an admin into the system...');

		var validationModel = logInModel();

		// Populate the validation model
		objectHelper.cloneObject(params, validationModel);

		// Verify that the model is valid before proceeding
		if (validatorUtility.checkModel(validationModel))
		{
			if (yield DAO.checkCredentials(params.username, params.password))
			{
				return {
					statusCode: responseCodes.OK,
					data: {},
					cookie: cookieManager.generateAdminCookie(params.username, params.password, params.rememberMe)
				};
			}
		}

		return {
			statusCode: responseCodes.BAD_REQUEST
		};
	})
};