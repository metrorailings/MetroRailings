/**
 * @module paperOrderController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('handlebars'),

	config = global.OwlStakes.require('config/config'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),

	fileManager = global.OwlStakes.require('utility/fileManager'),
	templateManager = global.OwlStakes.require('utility/templateManager');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'paperOrder',

	PARTIALS =
	{
		INVOICE_SECTION: 'invoiceSection',
		AGREEMENT_SECTION: 'agreementSection',
		DATE_SECTION: 'dateSection',
		PERSONAL_INFO_SECTION: 'personalInfoSection',
		SIGNATURE_SECTION: 'signatureSection'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the invoice that lists out all the aspects of the order for which the user will be charged
 */
_Handlebars.registerPartial('paperOrderRailingsInvoice', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.INVOICE_SECTION));

/**
 * The template for the terms of agreement
 */
_Handlebars.registerPartial('paperOrderTermsOfAgreement', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.AGREEMENT_SECTION));

/**
 * The template for the date of invoice
 */
_Handlebars.registerPartial('paperOrderDateOfInvoice', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.DATE_SECTION));

/**
 * The template for the customer's information
 */
_Handlebars.registerPartial('paperOrderPersonalInfo', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.PERSONAL_INFO_SECTION));

/**
 * The template for the signature section
 */
_Handlebars.registerPartial('paperOrderSignature', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.SIGNATURE_SECTION));

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
		var pageData = {},
			populatedPageTemplate;

		console.log('Loading the paper order page...');

		// Fetch the locations of each of our shops
		pageData.companyInfo = config.COMPANY_INFO;

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {}, true, true);
	}
};