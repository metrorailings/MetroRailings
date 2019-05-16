/**
 * @module noteUtility
 */

// ----------------- EXTERNAL MODULES --------------------------

const _Handlebars = require('handlebars'),

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
	 * @author kinsho
	 */
	basicInit: async function ()
	{
		let newNoteTemplate = await fileManager.fetchTemplate(NOTES_FOLDER, PARTIALS.NEW_NOTE), 
			noteRecordTemplate = await fileManager.fetchTemplate(NOTES_FOLDER, PARTIALS.NOTE_RECORD),
			pageData = {};

		pageData =
		{
			newNote: newNoteTemplate,
			noteRecord: noteRecordTemplate
		};

		return {
			pageData: pageData
		};
	}
};