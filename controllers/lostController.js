/**
 * @module lostController
 */

// ----------------- EXTERNAL MODULES --------------------------

var controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),

	templateManager = global.OwlStakes.require('utility/templateManager');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'lost',

	LOST_URL = '/lost';

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Initializer function responsible for serving the page
	 *
	 * @author kinsho
	 */
	init: async function(params, cookie, request)
	{
		console.log('404 page...');

		if (request.url.trim() !== LOST_URL)
		{
			console.log('Redirecting the user back to the 404 page under the proper URL...');

			return await controllerHelper.renderRedirectView(LOST_URL);
		}

		// Render the page template
		var populatedPageTemplate = await templateManager.populateTemplate({}, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {});
	}
};