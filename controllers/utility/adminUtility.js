/**
 * @module adminUtility
 */

// ----------------- EXTERNAL MODULES --------------------------

const _Handlebars = require('handlebars'),

	userDAO = global.OwlStakes.require('data/DAO/userDAO'),

	cookieManager = global.OwlStakes.require('utility/cookies'),
	fileManager = global.OwlStakes.require('utility/fileManager');

// ----------------- ENUMS/CONSTANTS --------------------------

const ADMIN_FOLDER = 'admin',

	PARTIALS =
	{
		ADMIN_MENU: 'adminMenu',
	};

// ----------------- PARTIALS --------------------------

/**
 * The template for the admin menu
 */
_Handlebars.registerPartial('adminMenu', fileManager.fetchTemplateSync(ADMIN_FOLDER, PARTIALS.ADMIN_MENU));

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function designed to programmatically fetch the templates and data that's needed to make sure the user is
	 * able to navigate the adminstration platform as intended
	 *
	 * @param {String} cookie - the cookie containing identifying information about the user navigating the platform
	 *
	 * @author kinsho
	 */
	basicInit: async function (cookie)
	{
		let username = cookieManager.retrieveAdminCookie(cookie)[0],
			user = await userDAO.retrieveUserData(username),
			pageData = {};

		pageData =
		{
			admin: user
		};

		return {
			pageData: pageData
		};
	}
};