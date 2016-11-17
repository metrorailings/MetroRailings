// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),
	_Handlebars = require('Handlebars'),
	controllerHelper = global.OwlStakes.require('controllers/utility/ControllerHelper'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	fileManager = global.OwlStakes.require('utility/fileManager');

// ----------------- ENUMS/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'payInvoice';

// ----------------- PRIVATE VARIABLES --------------------------

// ----------------- PRIVATE FUNCTIONS --------------------------

// ----------------- PARTIAL TEMPLATES --------------------------

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

		console.log('Loading the pay invoice page...');

		// Now render the page template
		populatedPageTemplate = yield templateManager.populateTemplate({}, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return yield controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {});
	})
}