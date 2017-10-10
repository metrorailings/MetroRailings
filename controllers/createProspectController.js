/**
 * @module createProspectController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	cookieManager = global.OwlStakes.require('utility/cookies'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),

	prospectsDAO = global.OwlStakes.require('data/DAO/prospectsDAO'),
	usersDAO = global.OwlStakes.require('data/DAO/userDAO');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'createProspect',

	ADMIN_LOG_IN_URL = '/admin',

	PARTIALS =
	{
		CUSTOMER: 'customerSection',
		LOCATION: 'locationSection',
		NOTES: 'notesSection',
		SUBMISSION_BUTTON: 'submissionSection'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the customer section
 */
_Handlebars.registerPartial('createProspectCustomerSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.CUSTOMER));

/**
 * The template for the location section
 */
_Handlebars.registerPartial('createProspectLocationSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.LOCATION));

/**
 * The template for the notes section
 */
_Handlebars.registerPartial('createProspectNotesSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.NOTES));

/**
 * The template for the submission button
 */
_Handlebars.registerPartial('createProspectButton', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.SUBMISSION_BUTTON));

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Initializer function responsible for serving the page
	 *
	 * @author kinsho
	 */
	init: async function (params, cookie, request)
	{
		var populatedPageTemplate;

		if ( !(await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent'])) )
		{
			console.log('Redirecting the user to the log-in page...');

			return await controllerHelper.renderRedirectView(ADMIN_LOG_IN_URL);
		}

		console.log('Loading the create prospect page...');

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate({}, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {}, true, true);
	},

	/**
	 * Function responsible for recording a new custom order into the system
	 *
	 * @author kinsho
	 */
	saveNewProspect: async function (params, cookie, request)
	{
		var username;

		if (await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent']))
		{
			username = cookieManager.retrieveAdminCookie(cookie)[0];

			console.log('Saving a prospect into the system...');

			try
			{
				// Save the prospect into the database
				await prospectsDAO.setUpNewProspect(params, username, prospectsDAO.PROSPECT_SETUP_CODES.SET_UP_BY_ADMIN);
			}
			catch (error)
			{
				return {
					statusCode: responseCodes.BAD_REQUEST
				};
			}
		}

		return {
			statusCode: responseCodes.OK,
			data: {}
		};
	}
};