// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),
	_Handlebars = require('handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),

	templateManager = global.OwlStakes.require('utility/templateManager'),
	fileManager = global.OwlStakes.require('utility/fileManager');

// ----------------- ENUMS/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'powderCoating',

	PARTIALS =
	{
		TYPE_SECTION: 'typeSection',
		OTHER_METAL_SECTION: 'otherMetalSection',
		SUBMISSION_SECTION: 'submissionSection'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

// Load page-specific handlebar partials

/**
 * The template for the step in which the user specifies what exactly he needs powder coated
 */
_Handlebars.registerPartial('powderCoatingTypeSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.TYPE_SECTION));

/**
 * The template for the step in which the user describes what exactly needs to be powder-coated, should he have selected the
 * 'Other' option
 */
_Handlebars.registerPartial('powderCoatingOtherMetalSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.OTHER_METAL_SECTION));

/**
 * The template for the submission step
 */
_Handlebars.registerPartial('powderCoatingSubmissionSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.SUBMISSION_SECTION));

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Initializer function
	 *
	 * @author kinsho
	 */
	init: _Q.async(function* ()
	{
		var populatedPageTemplate;

		console.log('Loading the powder coating page...');

		// Now render the page template
		populatedPageTemplate = yield templateManager.populateTemplate({}, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return yield controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {});
	})
};