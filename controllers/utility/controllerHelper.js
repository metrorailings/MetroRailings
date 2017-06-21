/**
 * @module controllerHelper
 */

// ----------------- EXTERNAL MODULES --------------------------

var config = global.OwlStakes.require('config/config'),

	fileManager = global.OwlStakes.require('utility/fileManager'),
	templateManager = global.OwlStakes.require('utility/templateManager');

// ----------------- ENUMS/CONSTANTS --------------------------

var BASE_TEMPLATE_FILE = 'base',
	REDIRECT_TEMPLATE_FILE = 'redirect',

	BOOTLEG_STRIPE_KEY = 'stripeKey',
	BOOTLEG_SUPPORT_NUMBER = 'supportNumber',

	HBARS_STYLESHEET_FILES = 'cssFiles',
	HBARS_CONTENT_HTML = 'content',
	HBARS_REDIRECT_URL = 'redirectURL',

	HBARS_IGNORE_SCALING = 'ignoreScaling',
	HBARS_WAIT_PAGE_LOAD = 'waitForPageLoad',
	HBARS_BOOTSTRAPPED_DATA = 'initialData',
	HBARS_LAUNCH_SCRIPT = 'launchScript',
	HBARS_IS_PROD_FLAG = 'isProd',
	HBARS_IS_ADMIN_PAGE = 'isAdmin',
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
	 * @param {boolean} [ignoreScaling] - a flag indicating whether we should avoid doing any mobile scaling on the page
	 * @param {boolean} [displayAfterPageLoad] - a flag indicating whether we should wait for the page to completely load before
	 * 		showing it to the user
	 *
	 * @return {String} - a fully populated string of HTML
	 *
	 * @author kinsho
	 */
	renderInitialView: async function (content, directory, bootData, ignoreScaling, isAdmin)
	{
		var data = {};

		// Augment the bootlegged data with other data that needs to be loaded for all pages
		bootData = bootData || {};
		bootData[BOOTLEG_STRIPE_KEY] = config.STRIPE_KEY;
		bootData[BOOTLEG_SUPPORT_NUMBER] = config.SUPPORT_PHONE_NUMBER;

		// Page-specific data to load into browser memory upon page load
		data[HBARS_BOOTSTRAPPED_DATA] = JSON.stringify(bootData || {});

		// Content specific to the page being loaded
		data[HBARS_CONTENT_HTML] = content;

		// Other assets specific to the page being loaded
		data[HBARS_STYLESHEET_FILES] = await fileManager.fetchStylesheets(directory);
		data[HBARS_LAUNCH_SCRIPT] = directory;

		// Load the current year into the view as well for copyright purposes
		data[HBARS_CURRENT_YEAR] = new Date().getFullYear();

		// Set a flag should we need to explicitly avoid any mobile scaling
		data[HBARS_IGNORE_SCALING] = ignoreScaling;

		// Set a flag indicating whether we are rendering an admin page
		data[HBARS_IS_ADMIN_PAGE] = isAdmin;

		// Set a flag indicating whether we are operating in a production environment
		data[HBARS_IS_PROD_FLAG] = config.IS_PROD;

		return await templateManager.populateTemplate(data, '', BASE_TEMPLATE_FILE);
	},

	/**
	 * Basic function responsible for populating a template that immediate redirects the user to another page
	 *
	 * @param {String} redirectURL - the URL to reroute the user towards
	 *
	 * @param {Object} - an object containing a fully populated string of HTML as well as a flag denoting this as a
	 * 		redirect request
	 *
	 * @author kinsho
	 */
	renderRedirectView: async function (redirectURL)
	{
		var data = {},
			redirectTemplate;

		// Populate the redirect URL into the script that will immediately be executed when the page loads
		data[HBARS_REDIRECT_URL] = redirectURL;

		redirectTemplate = await templateManager.populateTemplate(data, '', REDIRECT_TEMPLATE_FILE);

		return {
			template: redirectTemplate,
			redirect: true
		};
	}
};