/**
 * @module specializedInvoiceController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	fileManager = global.OwlStakes.require('utility/fileManager'),

	pricing = global.OwlStakes.require('shared/pricing/pricingData'),

	invoicesDAO = global.OwlStakes.require('data/DAO/invoicesDAO'),

	config = global.OwlStakes.require('config/config');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'specializedInvoice',
	UTILITY_FOLDER = 'utility',

	HOME_URL = '/',

	PARTIALS =
	{
		HEADER: 'invoiceHeader',
		INVOICE: 'invoice'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the quote header that also features all our contact information
 */
_Handlebars.registerPartial('invoiceHeader', fileManager.fetchTemplateSync(UTILITY_FOLDER, PARTIALS.HEADER));

/**
 * The template for the invoice
 */
_Handlebars.registerPartial('specializedInvoice', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.INVOICE));

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Initializer function responsible for serving the page
	 *
	 * @author kinsho
	 */
	init: async function (params)
	{
		var populatedPageTemplate,
			address = [],
			pageData = {};

		console.log('Loading the specialized invoice page...');

		// Grab invoice data
		pageData.invoice = await invoicesDAO.searchInvoiceById(parseInt(params.id, 10));

		// If no invoice was found that can be used to populate the invoice, then just take the user back to the home
		// page
		if ( !(pageData.invoice) )
		{
			console.log('Redirecting the user back to the home page as no invoice has been found that matches the passed id');

			return await controllerHelper.renderRedirectView(HOME_URL);
		}

		// If any taxes are being charged, set the tax rate so that it can be shown on the page
		pageData.taxRate = pricing.NJ_SALES_TAX_RATE * 100;

		// Form an address depending on whatever address information is present
		if (pageData.invoice.address)
		{
			address.push(pageData.invoice.address);
		}
		if (pageData.invoice.city)
		{
			address.push(pageData.invoice.city);
		}
		if (pageData.invoice.state)
		{
			address.push(pageData.invoice.state);
		}
		pageData.serviceAddress = (address.length ? address.join(', ') : '');

		// Separate out all the e-mail addresses that need to be listed on the invoice
		pageData.invoice.email = pageData.invoice.email.split(',');

		// We need the address information so that we can display the address on the invoice
		pageData.companyInfo = config.COMPANY_INFO;

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, pageData);
	}
};