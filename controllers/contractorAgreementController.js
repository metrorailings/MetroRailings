/**
 * @module contractorAgreementController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),

	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO'),
	usersDAO = global.OwlStakes.require('data/DAO/userDAO'),

	dateUtility = global.OwlStakes.require('shared/dateUtility'),

	fileManager = global.OwlStakes.require('utility/fileManager'),
	templateManager = global.OwlStakes.require('utility/templateManager');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'contractorAgreement',
	UTILITY_FOLDER = 'utility',

	ADMIN_LOG_IN_URL = '/admin',

	PARTIALS =
	{
		BANNER: 'banner',
		OVERVIEW_SECTION: 'overviewSection',
		AGREEMENT_SECTION: 'agreementSection',
		SIGNATURE_SECTION: 'signatureSection'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the section that lists high-level information identifying the order
 */
_Handlebars.registerPartial('overviewSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.OVERVIEW_SECTION));

/**
 * The template for the section that reads out agreement text
 */
_Handlebars.registerPartial('agreementSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.AGREEMENT_SECTION));

/**
 * The template for the signature section
 */
_Handlebars.registerPartial('signatureSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.SIGNATURE_SECTION));

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
	init: async function (params, cookie, request)
	{
		var pageData = {},
			currentDate = new Date(),
			populatedPageTemplate;

		if ( !(await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent'])) )
		{
			console.log('Redirecting the user to the log-in page...');

			return await controllerHelper.renderRedirectView(ADMIN_LOG_IN_URL);
		}

		console.log('Loading the contractor agreement page...');

		// Fetch the order data
		pageData.order = await ordersDAO.searchOrderById(parseInt(params.id, 10));

		// Note the current date as well for signing purposes
		pageData.currentDate = dateUtility.FULL_MONTHS[currentDate.getMonth()] + ' ' + currentDate.getDate() +
			dateUtility.findOrdinalSuffix(currentDate.getDate()) + ', ' + currentDate.getFullYear();

		// Format the descriptive text
		pageData.order.notes.order = pageData.order.notes.order.split('<br />').join('\n').split('\t').join('');

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {}, true, true);
	}
};