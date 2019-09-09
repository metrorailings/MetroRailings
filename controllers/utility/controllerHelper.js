/**
 * @module controllerHelper
 */

// ----------------- EXTERNAL MODULES --------------------------

const _Q = require('q'),
	_zlib = require('zlib'),

	config = global.OwlStakes.require('config/config'),

	adminUtility = global.OwlStakes.require('controllers/utility/adminUtility'),

	fileManager = global.OwlStakes.require('utility/fileManager'),
	templateManager = global.OwlStakes.require('utility/templateManager');

// ----------------- ENUMS/CONSTANTS --------------------------

const BASE_TEMPLATE_FILE = 'base',
	REDIRECT_TEMPLATE_FILE = 'redirect',

	BOOTLEG_STRIPE_KEY = 'stripeKey',
	BOOTLEG_SUPPORT_NUMBER = 'supportNumber',

	HBARS_STYLESHEET_FILES = 'cssFiles',
	HBARS_CONTENT_HTML = 'content',
	HBARS_REDIRECT_URL = 'redirectURL',

	HBARS_IGNORE_SCALING = 'ignoreScaling',
	HBARS_BOOTSTRAPPED_DATA = 'initialData',
	HBARS_LAUNCH_SCRIPT = 'launchScript',
	HBARS_IS_PROD_FLAG = 'isProd',
	HBARS_IS_ADMIN_PAGE = 'isAdmin',
	HBARS_ADMIN_REFERENCE = 'admin',
	HBARS_CURRENT_YEAR = 'currentYear',
	HBARS_CONTACT_NUMBER = 'contactNumber';

// ----------------- I/O FUNCTION TRANSFORMATIONS --------------------------

const zlibGZipper = _Q.denodeify(_zlib.gzip);

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
	 * @param {boolean} [isAdmin] - a flag indicating whether the page is open to the public or part of the admin
	 * 		platform
	 * @param {boolean}	[includeAdminInfo] - a boolean indicating whether we need to augment the page data with
	 * 		information about the admin
	 * @param {String} [cookie] - the cookie containing information about the admin accessing the platform
	 *
	 * @return {String} - a fully populated string of HTML
	 *
	 * @author kinsho
	 */
	renderInitialView: async function (content, directory, bootData, ignoreScaling, isAdmin, includeAdminInfo, cookie)
	{
		let data = {},
			adminData,
			response;

		// Augment the bootlegged data with other data that needs to be loaded for all pages
		bootData = bootData || {};
		bootData[BOOTLEG_STRIPE_KEY] = config.STRIPE_KEY;
		bootData[BOOTLEG_SUPPORT_NUMBER] = config.SUPPORT_PHONE_NUMBER;

		// Page-specific data to load into browser memory upon page load
		data[HBARS_BOOTSTRAPPED_DATA] = JSON.stringify(bootData || {});

		// Content specific to the page being loaded
		data[HBARS_CONTENT_HTML] = content;

		// Other assets specific to the page being loaded
		if (config.IS_PROD)
		{
			data[HBARS_STYLESHEET_FILES] = [{ path: fileManager.fetchProductionStylesheet(directory) }];
		}
		else
		{
			data[HBARS_STYLESHEET_FILES] = await fileManager.fetchStylesheets(directory);
		}
		data[HBARS_LAUNCH_SCRIPT] = directory;

		// Load the current year into the view as well for copyright purposes
		data[HBARS_CURRENT_YEAR] = new Date().getFullYear();

		// Set a flag should we need to explicitly avoid any mobile scaling
		data[HBARS_IGNORE_SCALING] = ignoreScaling;

		// Set a flag indicating whether we are rendering an admin page
		data[HBARS_IS_ADMIN_PAGE] = isAdmin;

		// Set a flag indicating whether we are operating in a production environment
		data[HBARS_IS_PROD_FLAG] = config.IS_PROD;

		// Set the main phone number as well
		data[HBARS_CONTACT_NUMBER] = config.SUPPORT_PHONE_NUMBER;

		// If need be, add information about the admin in context to the data used to load the base template
		if (includeAdminInfo)
		{
			adminData = await adminUtility.basicInit(cookie);
			data[HBARS_ADMIN_REFERENCE] = adminData.pageData.admin;
		}

		// Render the template
		response = await templateManager.populateTemplate(data, '', BASE_TEMPLATE_FILE);

		// Now gzip the template and return it back
		return await zlibGZipper(response);
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
		let data = {},
			redirectTemplate;

		// Populate the redirect URL into the script that will immediately be executed when the page loads
		data[HBARS_REDIRECT_URL] = redirectURL;

		redirectTemplate = await templateManager.populateTemplate(data, '', REDIRECT_TEMPLATE_FILE);

		return {
			template: await zlibGZipper(redirectTemplate),
			redirect: true
		};
	}
};