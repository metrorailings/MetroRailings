/**
 * @main notes
 */

// ----------------- EXTERNAL MODULES --------------------------

import viewModel from 'client/scripts/notes/viewModel';

// ----------------- ENUMS/CONSTANTS --------------------------

var NOTE_TYPE_SELECT = 'noteType',
	TASK_ASSIGN_TO_SELECT = 'takeAssignTo',
	NOTE_SAVE_BUTTON = 'noteSave';

// ----------------- PRIVATE MEMBERS --------------------------

// ----------------- PRIVATE FUNCTIONS --------------------------

// ----------------- LISTENERS --------------------------

// ----------------- MODULE ---------------------------

/**
 * Constructor function that'll help us manage new notes and tasks as they are generated through the notes interface
 *
 * @param {HTMLElement} notesContainer - the HTML container containing the notes section
 *
 * @author kinsho
 */
function initNotesTextfield(notesContainer, )
{
	var vm = new viewModel(notesContainer);
}

// ----------------- EXPORT ---------------------------

export default initNotesTextfield;