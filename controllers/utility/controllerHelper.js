/**
 * @module controllerHelper
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	templateManager = global.OwlStakes.require('utility/templateManager');

// ----------------- ENUMS/CONSTANTS --------------------------

var BASE_TEMPLATE_FILE = 'base',

	HBARS_STYLESHEET_FILES = 'cssFiles',
	HBARS_CONTENT_HTML = 'content',

	HBARS_BOOTSTRAPPED_DATA = 'initialData',
	HBARS_LAUNCH_SCRIPT = 'launchScript',
	HBARS_CURRENT_YEAR = 'currentYear';

// ----------------- MODULE DEFINITION --------------------------
module.exports =
{
	/**
	 * Basic function responsible for populating the base template with relevant content and
	 * links to all required foundational files. Basically the last function to be called when any
	 * initial service request is to be fulfilled
	 *
	 * @param {String} content - the HTML content to inject into the base template
	 * @param {String} directory - the modular name which can be used to pull resource files from
	 * 		the file system
	 * @param {Object} [bootData] - data to bootstrap into the page when it is initially loaded
	 *
	 * @return {String} - a fully populated string of HTML
	 *
	 * @author kinsho
	 */
	renderInitialView: _Q.async(function* (content, directory, bootData)
	{
		var data = {};

		// Page-specific data to load into browser memory upon page load
		data[HBARS_BOOTSTRAPPED_DATA] = JSON.stringify(bootData || {});

		// Content specific to the page being loaded
		data[HBARS_CONTENT_HTML] = content;

		// Other assets specific to the page being loaded
		data[HBARS_STYLESHEET_FILES] = yield fileManager.fetchStylesheets(directory);
		data[HBARS_LAUNCH_SCRIPT] = directory;

		// Load the current year into the view as well for copyright purposes
		data[HBARS_CURRENT_YEAR] = new Date().getFullYear();

		return yield templateManager.populateTemplate(data, '', BASE_TEMPLATE_FILE);
	})
};