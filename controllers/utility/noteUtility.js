/**
 * @module noteUtility
 */

// ----------------- EXTERNAL MODULES --------------------------

const _Handlebars = require('handlebars'),

	userDAO = global.OwlStakes.require('data/DAO/userDAO'),
	notesDAO = global.OwlStakes.require('data/DAO/notesDAO'),

	cookieManager = global.OwlStakes.require('utility/cookies'),
	fileManager = global.OwlStakes.require('utility/fileManager');

// ----------------- ENUMS/CONSTANTS --------------------------

const NOTES_FOLDER = 'notes',

	PARTIALS =
	{
		ORDER_NOTES: 'notes',
		NEW_NOTE: 'newNote',
		NOTE_RECORD: 'noteRecord',
		NOTE_TEMPLATES: 'notesTemplates'
	};

// ----------------- PARTIALS --------------------------

/**
 * The template for the notes lister
 */
_Handlebars.registerPartial('notes', fileManager.fetchTemplateSync(NOTES_FOLDER, PARTIALS.ORDER_NOTES));

/**
 * The template for a new note textarea
 */
_Handlebars.registerPartial('newNote', fileManager.fetchTemplateSync(NOTES_FOLDER, PARTIALS.NEW_NOTE));

/**
 * The template for a note record
 */
_Handlebars.registerPartial('noteRecord', fileManager.fetchTemplateSync(NOTES_FOLDER, PARTIALS.NOTE_RECORD));

/**
 * The template for the note templates partial
 */
_Handlebars.registerPartial('notesTemplates', fileManager.fetchTemplateSync(NOTES_FOLDER, PARTIALS.NOTE_TEMPLATES));

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function designed to programmatically fetch the templates for any notes-related modules so that we can render
	 * notes on a dynamic basis
	 *
	 * @param {String} cookie - the cookie object coming to us from the browser
	 * 
	 * @author kinsho
	 */
	basicInit: async function (cookie)
	{
		let notesTemplate = await fileManager.fetchTemplate(NOTES_FOLDER, PARTIALS.ORDER_NOTES),
			newNoteTemplate = await fileManager.fetchTemplate(NOTES_FOLDER, PARTIALS.NEW_NOTE), 
			noteRecordTemplate = await fileManager.fetchTemplate(NOTES_FOLDER, PARTIALS.NOTE_RECORD),
			users = { all : await userDAO.collectAllUsers() },
			pageData = {};

		// Log the user name of the current user for note purposes
		users.current = cookieManager.retrieveAdminCookie(cookie)[0];

		pageData =
		{
			notesTemplate: notesTemplate,
			newNote: newNoteTemplate,
			noteRecord: noteRecordTemplate,
			users: users
		};

		return {
			pageData: pageData
		};
	},

	/**
	 * Function responsible for collecting all the complete notes that belong to a particular order
	 *
	 * @param {Number} orderId - the ID of the order whose notes will be fetched
	 *
	 * @author kinsho
	 */
	retrieveNotesByOrderId: async function (orderId)
	{
		let noteData = {};

		noteData = await notesDAO.fetchNotesByOrderId(parseInt(orderId, 10));

		return noteData;
	}
};