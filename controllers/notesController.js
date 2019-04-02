/**
 * @module notesController
 */

// ----------------- EXTERNAL MODULES --------------------------

const controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),

	cookies = global.OwlStakes.require('utility/cookies'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),

	usersDAO = global.OwlStakes.require('data/DAO/userDAO'),
	notesDAO = global.OwlStakes.require('data/DAO/notesDAO');

// ----------------- ENUM/CONSTANTS --------------------------

const ADMIN_LOG_IN_URL = '/admin';

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function responsible for saving a new or updated note into the system
	 *
	 * @param {Object} params - the note data to store into the database
	 *
	 * @author kinsho
	 */
	saveNewNote: async function (params, cookie, request)
	{
		let noteData = {};

		if ( !(await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent'])) )
		{
			console.log('Redirecting the user to the log-in page...');

			return await controllerHelper.renderRedirectView(ADMIN_LOG_IN_URL);
		}

		noteData = await notesDAO.addNewNote(params, cookies.retrieveAdminCookie(cookie)[0]);

		return {
			statusCode: responseCodes.OK,
			data: noteData
		};
	}
};