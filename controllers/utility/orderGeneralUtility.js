/**
 * @module orderGeneralUtility
 */

// ----------------- EXTERNAL MODULES --------------------------

const _Handlebars = require('handlebars'),

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

const ORDER_SHARED_FOLDER = 'orderGeneral',
	UTILITY_FOLDER = 'utility',

	PARTIALS =
	{
		ID: 'idSection',
		CUSTOMER: 'customerSection',
		NOTES: 'notesSection',
		LOCATION: 'locationSection',
		TYPE: 'typeSection',
		BASE_DESIGN: 'baseDesignSection',
		PICKET_DESIGN: 'picketSection',
		ADVANCED_DESIGN: 'advancedDesignSection',
		CABLE_DESIGN: 'cableDesignSection',
		GLASS_DESIGN: 'glassDesignSection',
		PAYMENTS: 'paymentsSection',
		LOGISTICS: 'logisticsSection',
		MONEY: 'moneySection',
		AGREEMENT: 'agreementSection',
		SUBMISSION_BUTTON: 'submissionSection',
		DEPOSIT_MODAL: 'depositModal',

		DESIGN_ERRORS: 'designErrors',
		DESIGN_DESCRIPTOR: 'designDescriptor',
		DESIGN_CATEGORY: 'designCategory',
		MULTI_TEXT: 'multiText',
		FILES: 'filesSection',
		PAYMENT_RECORD: 'paymentRecord'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the ID section
 */
_Handlebars.registerPartial('orderId', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.ID));

/**
 * The template for the customer section
 */
_Handlebars.registerPartial('orderCustomer', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.CUSTOMER));

/**
 * The template for the notes section
 */
_Handlebars.registerPartial('orderNotes', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.NOTES));

/**
 * The template for the location section
 */
_Handlebars.registerPartial('orderLocation', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.LOCATION));

/**
 * The template for the type section
 */
_Handlebars.registerPartial('orderType', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.TYPE));

/**
 * The template for the base design section
 */
_Handlebars.registerPartial('orderBaseDesign', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.BASE_DESIGN));

/**
 * The template for the picket section
 */
_Handlebars.registerPartial('orderPicketDesign', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.PICKET_DESIGN));

/**
 * The template for the advanced design section
 */
_Handlebars.registerPartial('orderAdvancedDesign', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.ADVANCED_DESIGN));

/**
 * The template for the cable design section
 */
_Handlebars.registerPartial('orderCableDesign', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.CABLE_DESIGN));

/**
 * The template for the glass design section
 */
_Handlebars.registerPartial('orderGlassDesign', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.GLASS_DESIGN));

/**
 * The template for the railings logistics section
 */
_Handlebars.registerPartial('orderLogistics', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.LOGISTICS));

/**
 * The template for the section where money will be discussed
 */
_Handlebars.registerPartial('orderMoney', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.MONEY));

/**
 * The template for the agreement section
 */
_Handlebars.registerPartial('orderAgreement', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.AGREEMENT));

/**
 * The template for the design descriptor partial
 */
_Handlebars.registerPartial('designDescriptor', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.DESIGN_DESCRIPTOR));

/**
 * The template for the design category partial
 */
_Handlebars.registerPartial('designCategory', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.DESIGN_CATEGORY));

/**
 * The template for the submission button
 */
_Handlebars.registerPartial('saveOrderButton', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.SUBMISSION_BUTTON));

/**
 * The template for the deposit modal
 */
_Handlebars.registerPartial('depositModal', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.DEPOSIT_MODAL));

/**
 * The template for multi-text inputs
 */
_Handlebars.registerPartial('multiText', fileManager.fetchTemplateSync(UTILITY_FOLDER, PARTIALS.MULTI_TEXT));

/**
 * The template for the order files section
 */
_Handlebars.registerPartial('orderFiles', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.FILES));

/**
 * The template for the order payments section
 */
_Handlebars.registerPartial('orderPayments', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.PAYMENTS));

/**
 * The template for the payment record
 */
_Handlebars.registerPartial('paymentRecord', fileManager.fetchTemplateSync(ORDER_SHARED_FOLDER, PARTIALS.PAYMENT_RECORD));

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
		let designErrorsTemplate = await fileManager.fetchTemplate(ORDER_SHARED_FOLDER, PARTIALS.DESIGN_ERRORS),
			depositModalTemplate = await fileManager.fetchTemplate(ORDER_SHARED_FOLDER, PARTIALS.DEPOSIT_MODAL),
			paymentRecordTemplate = await fileManager.fetchTemplate(ORDER_SHARED_FOLDER, PARTIALS.PAYMENT_RECORD),
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
			designErrorsTemplate: designErrorsTemplate,
			depositModal: depositModalTemplate,
			paymentRecordTemplate: paymentRecordTemplate
		};

		return {
			designData : designData,
			pageData : pageData
		};
	},

};