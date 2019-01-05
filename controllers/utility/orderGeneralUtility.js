/**
 * @module orderGeneralUtility
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('handlebars'),

	fileManager = global.OwlStakes.require('utility/fileManager'),

	pricingData = global.OwlStakes.require('shared/pricing/pricingData'),

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
	ada = global.OwlStakes.require('shared/designs/ada');

// ----------------- ENUM/CONSTANTS --------------------------

var ORDER_SHARED_FOLDER = 'orderGeneral',

	PARTIALS =
	{
		CUSTOMER: 'customerSection',
		LOCATION: 'locationSection',
		TYPE: 'typeSection',
		BASE_DESIGN: 'baseDesignSection',
		PICKET_DESIGN: 'picketSection',
		ADVANCED_DESIGN: 'advancedDesignSection',
		CABLE_DESIGN: 'cableDesignSection',
		GLASS_DESIGN: 'glassDesignSection',
		LOGISTICS: 'logisticsSection',
		EXTERNAL_CHARGES: 'externalCharges',
		AGREEMENT: 'agreementSection',
		SUBMISSION_BUTTON: 'submissionSection',
		DESIGN_ERRORS: 'designErrors',
		DESIGN_DESCRIPTOR: 'designDescriptor',
		DEPOSIT_MODAL: 'depositModal'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the customer section
 */
_Handlebars.registerPartial('createQuoteCustomer', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.CUSTOMER));

/**
 * The template for the location section
 */
_Handlebars.registerPartial('createQuoteLocation', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.LOCATION));

/**
 * The template for the type section
 */
_Handlebars.registerPartial('createQuoteType', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.TYPE));

/**
 * The template for the base design section
 */
_Handlebars.registerPartial('createQuoteBaseDesign', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.BASE_DESIGN));

/**
 * The template for the picket section
 */
_Handlebars.registerPartial('createQuotePicketDesign', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.PICKET_DESIGN));

/**
 * The template for the advanced design section
 */
_Handlebars.registerPartial('createQuoteAdvancedDesign', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.ADVANCED_DESIGN));

/**
 * The template for the cable design section
 */
_Handlebars.registerPartial('createQuoteCableDesign', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.CABLE_DESIGN));

/**
 * The template for the glass design section
 */
_Handlebars.registerPartial('createQuoteGlassDesign', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.GLASS_DESIGN));

/**
 * The template for the railings logistics section
 */
_Handlebars.registerPartial('createQuoteLogistics', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.LOGISTICS));

/**
 * The template for the external charges section
 */
_Handlebars.registerPartial('createQuoteExternalCharges', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.EXTERNAL_CHARGES));

/**
 * The template for the agreement section
 */
_Handlebars.registerPartial('createQuoteAgreement', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.AGREEMENT));

/**
 * The template for the design descriptor partial
 */
_Handlebars.registerPartial('designDescriptor', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.DESIGN_DESCRIPTOR));

/**
 * The template for the submission button
 */
_Handlebars.registerPartial('saveInvoiceButton', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.SUBMISSION_BUTTON));

/**
 * The template for the deposit modal
 */
_Handlebars.registerPartial('depositModal', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.DEPOSIT_MODAL));

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function designed to populate the parts of the quote/order page that will always be present, no matter what
	 * state the quote/order is in
	 *
	 * @author kinsho
	 */
	basicInit: async function ()
	{
		var designErrorsTemplate = await fileManager.fetchTemplate(ORDER_SHARED_FOLDER, PARTIALS.DESIGN_ERRORS),
			pageData,
			designData;

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
			glassBuilds: glassBuilds.options,
			ada: ada.options
		};

		pageData =
		{
			taxRate: (pricingData.NJ_SALES_TAX_RATE * 100).toFixed(2),
			tariffRate: (pricingData.TARIFF_RATE * 100).toFixed(2),
			designs: designData,
			designErrorsTemplate: designErrorsTemplate
		};

		return {
			designData : designData,
			pageData : pageData
		};
	}

};