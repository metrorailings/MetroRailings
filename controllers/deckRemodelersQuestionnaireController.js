/**
 * @module deckRemodelersQuestionnaireController
 */

// ----------------- EXTERNAL MODULES --------------------------

const _Handlebars = require('handlebars'),

	questionnaireData = global.OwlStakes.require('shared/questionnaire/deckRemodelers'),
	responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),

	DAO = global.OwlStakes.require('data/DAO/customerFormsDAO'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),
	mailer = global.OwlStakes.require('utility/mailer'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	pdfGenerator = global.OwlStakes.require('utility/pdfGenerator'),
	templateManager = global.OwlStakes.require('utility/templateManager'),

	drConfig = global.OwlStakes.require('config/deckRemodelers.config'),
	config = global.OwlStakes.require('config/config');

// ----------------- ENUM/CONSTANTS --------------------------

const CONTROLLER_FOLDER = 'deckRemodelersQuestionnaire',
	UTILITY_FOLDER = 'utility',

	CUSTOMER_FORM_EMAIL = 'customerForm',
	CUSTOM_ORDER_SUBJECT_HEADER = 'Metro Railings: New Order Request',
	COMPANY_NAME = 'Deck Remodelers',

	QUESTIONNAIRE_RESPONSE_URL = '/questionnaireResponses?id=',

	PDF_EXTENSION = '.pdf',

	PARTIALS =
	{
		BANNER: 'banner',
		CUSTOMER: 'customerDetails',
		RAILINGS: 'railingDetails',
		MISC: 'miscellaneousDetails'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the banner to display at the top of the page
 */
_Handlebars.registerPartial('bannerSection', fileManager.fetchTemplateSync(UTILITY_FOLDER, PARTIALS.BANNER));

/**
 * The template for the customer section
 */
_Handlebars.registerPartial('drCustomerDetails', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.CUSTOMER));

/**
 * The template for the railings section
 */
_Handlebars.registerPartial('drRailingDetails', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.RAILINGS));

/**
 * The template for the miscellaneous info section
 */
_Handlebars.registerPartial('drMiscInfo', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.MISC));

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
		console.log('Loading the Deck Remodelers page...');

		// Render the page template
		let populatedPageTemplate = await templateManager.populateTemplate({ questionnaireData : questionnaireData }, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {}, false, true);
	},

	saveNewForm: async function(params)
	{
		console.log('Saving new Deck Remodelers customer data...');

			// Insert the data into the database
		let customerForm = await DAO.insertNewForm(params),
			// Generate the HTML to insert into the PDF attachment
			pdfLink = QUESTIONNAIRE_RESPONSE_URL + parseInt(customerForm._id, 10),
			pdf = await pdfGenerator.htmlToPDF(pdfLink),
			// Prepare the PDF copy of the quote to be sent over as an attachment
			formAttachment = await mailer.generateAttachment(customerForm._id + PDF_EXTENSION, pdf),
			mailHTML = await mailer.generateFullEmail(CUSTOMER_FORM_EMAIL, { companyName : COMPANY_NAME, formLink : config.BASE_URL + pdfLink }, CUSTOMER_FORM_EMAIL),
			emailAddresses = drConfig.UNIVERSAL_EMAIL_ADDRESSES;

		// Gather all the e-mail addresses we'll be sending this out too
		if (drConfig.PM_EMAIL_ADDRESSES[customerForm.projectManager])
		{
			emailAddresses.push(drConfig.PM_EMAIL_ADDRESSES[customerForm.projectManager]);
		}

		await mailer.sendMail(mailHTML, '', emailAddresses, CUSTOM_ORDER_SUBJECT_HEADER, config.SUPPORT_MAILBOX, '', [formAttachment]);

		return {
			statusCode: responseCodes.OK,
			data: {}
		};

	}
};