/**
 * @module createQuoteController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	cookieManager = global.OwlStakes.require('utility/cookies'),
	mailer = global.OwlStakes.require('utility/mailer'),

	pricingData = global.OwlStakes.require('shared/pricing/pricingData'),
	responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),

	types = global.OwlStakes.require('shared/designs/types'),
	posts = global.OwlStakes.require('shared/designs/postDesigns'),
	handrailings = global.OwlStakes.require('shared/designs/handrailingDesigns'),
	picketSizes = global.OwlStakes.require('shared/designs/picketSizes'),
	picketStyles = global.OwlStakes.require('shared/designs/picketStyles'),
	postEnds = global.OwlStakes.require('shared/designs/postEndDesigns'),
	postCaps = global.OwlStakes.require('shared/designs/postCapDesigns'),
	centerDesigns = global.OwlStakes.require('shared/designs/centerDesigns'),
	collars = global.OwlStakes.require('shared/designs/collarDesigns'),
	baskets = global.OwlStakes.require('shared/designs/basketDesigns'),
	valences = global.OwlStakes.require('shared/designs/valenceDesigns'),
	colors = global.OwlStakes.require('shared/designs/colors'),
	cableSizes = global.OwlStakes.require('shared/designs/cableSizes'),
	cableCaps = global.OwlStakes.require('shared/designs/cableCaps'),
	glassTypes = global.OwlStakes.require('shared/designs/glassTypes'),
	glassBuilds = global.OwlStakes.require('shared/designs/glassBuilds'),

	prospectsDAO = global.OwlStakes.require('data/DAO/prospectsDAO'),
	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO'),
	usersDAO = global.OwlStakes.require('data/DAO/userDAO'),

	config = global.OwlStakes.require('config/config');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'createQuote',

	CUSTOM_ORDER_EMAIL = 'customerInvoice',
	CUSTOM_ORDER_SUBJECT_HEADER = 'Metro Railings: Your Order (Order #::orderId)',
	ORDER_ID_PLACEHOLDER = '::orderId',

	ADMIN_LOG_IN_URL = '/admin',
	INVOICE_URL = '/orderInvoice?id=::orderId',

	VIEWS_DIRECTORY = '/client/views/',
	DEFAULT_AGREEMENT_TEXT = 'customerAgreement.txt',

	PARTIALS =
	{
		CUSTOMER: 'customerSection',
		LOCATION: 'locationSection',
		TYPE: 'typeSection',
		BASE_DESIGN: 'baseDesignSection',
		ADVANCED_DESIGN: 'advancedDesignSection',
		CABLE_DESIGN: 'cableDesignSection',
		GLASS_DESIGN: 'glassDesignSection',
		LOGISTICS: 'logisticsSection',
		EXTERNAL_CHARGES: 'externalCharges',
		AGREEMENT: 'agreementSection',
		SUBMISSION_BUTTON: 'submissionSection'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the customer section
 */
_Handlebars.registerPartial('createQuoteCustomer', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.CUSTOMER));

/**
 * The template for the location section
 */
_Handlebars.registerPartial('createQuoteLocation', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.LOCATION));

/**
 * The template for the type section
 */
_Handlebars.registerPartial('createQuoteType', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.TYPE));

/**
 * The template for the base design section
 */
_Handlebars.registerPartial('createQuoteBaseDesign', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.BASE_DESIGN));

/**
 * The template for the advanced design section
 */
_Handlebars.registerPartial('createQuoteAdvancedDesign', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.ADVANCED_DESIGN));

/**
 * The template for the cable design section
 */
_Handlebars.registerPartial('createQuoteCableDesign', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.CABLE_DESIGN));

/**
 * The template for the glass design section
 */
_Handlebars.registerPartial('createQuoteGlassDesign', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.GLASS_DESIGN));

/**
 * The template for the railings logistics section
 */
_Handlebars.registerPartial('createQuoteLogistics', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.LOGISTICS));

/**
 * The template for the external charges section
 */
_Handlebars.registerPartial('createQuoteExternalCharges', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.EXTERNAL_CHARGES));

/**
 * The template for the agreement section
 */
_Handlebars.registerPartial('createQuoteAgreement', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.AGREEMENT));

/**
 * The template for the submission button
 */
_Handlebars.registerPartial('saveInvoiceButton', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.SUBMISSION_BUTTON));

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
		var populatedPageTemplate,
			agreementText = await fileManager.fetchFile(VIEWS_DIRECTORY + CONTROLLER_FOLDER + '/' + DEFAULT_AGREEMENT_TEXT),
			prospect = {},
			pageData,
			designData;

		if ( !(await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent'])) )
		{
			console.log('Redirecting the user to the log-in page...');

			return await controllerHelper.renderRedirectView(ADMIN_LOG_IN_URL);
		}

		console.log('Loading the create invoice page...');

		if (params.id)
		{
			prospect = await prospectsDAO.searchProspectById(parseInt(params.id, 10));
		}

		// Gather all the design options that we can apply to the order
		designData =
		{
			types: types.options,
			posts: posts.options,
			handrailings: handrailings.options,
			picketSizes: picketSizes.options,
			picketStyles: picketStyles.options,
			postEnds: postEnds.options,
			postCaps: postCaps.options,
			centerDesigns: centerDesigns.options,
			collars: collars.options,
			baskets: baskets.options,
			valences: valences.options,
			colors: colors.options,
			cableSizes: cableSizes.options,
			cableCaps: cableCaps.options,
			glassTypes: glassTypes.options,
			glassBuilds: glassBuilds.options
		};

		pageData =
		{
			prospect: prospect,
			agreement: agreementText,
			defaultTimeLimit: config.DEFAULT_TIME_LIMIT,
			taxRate: (pricingData.NJ_SALES_TAX_RATE * 100).toFixed(2),
			tariffRate: (pricingData.TARIFF_RATE * 100).toFixed(2),
			designs: designData
		};

		// Now render the page template
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, { prospectId: prospect._id }, true, true);
	},

	/**
	 * Function responsible for saving a new custom order into the system
	 *
	 * @author kinsho
	 */
	saveNewOrder: async function (params, cookie, request)
	{
		var processedOrder,
			invoiceLink,
			mailHTML,
			username;

		if (await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent']))
		{
			username = cookieManager.retrieveAdminCookie(cookie)[0];

			console.log('Saving a newly minted custom order into the system...');

			try
			{
				if (params._id)
				{
					// Convert an existing prospect into an order
					processedOrder = await prospectsDAO.convertToOrder(params._id, params, username);
				}
				else
				{
					// Save a new order into the database
					processedOrder = await ordersDAO.setUpNewOrder(params, username);
				}
			}
			catch (error)
			{
				return {
					statusCode: responseCodes.BAD_REQUEST
				};
			}

			// Send out an e-mail to the customer if at least one e-mail address was provided
			if (params.customer.email)
			{
				// Generate the link that will be sent to the customer so that he can approve and pay for the order
				invoiceLink = config.BASE_URL + INVOICE_URL.replace(ORDER_ID_PLACEHOLDER, processedOrder._id);

				mailHTML = await mailer.generateFullEmail(CUSTOM_ORDER_EMAIL, { orderInvoiceLink: invoiceLink }, CUSTOM_ORDER_EMAIL);
				await mailer.sendMail(mailHTML, '', params.customer.email, CUSTOM_ORDER_SUBJECT_HEADER.replace(ORDER_ID_PLACEHOLDER, processedOrder._id), config.SUPPORT_MAILBOX);
			}
		}

		return {
			statusCode: responseCodes.OK,
			data: { id: processedOrder._id }
		};
	}
};