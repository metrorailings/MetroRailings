// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createProspect/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var ORDER_NOTES = 'prospectNotes';

// ----------------- PRIVATE VARIABLES ---------------------------

var _notesField = document.getElementById(ORDER_NOTES);

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting notes about the prospect into the view model
 *
 * @author kinsho
 */
function setNotes()
{
	vm.notes = _notesField.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_notesField.addEventListener('change', setNotes);

// ----------------- DATA INITIALIZATION -----------------------------

setNotes();