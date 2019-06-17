// ----------------- EXTERNAL MODULES --------------------------

import noteHandler from 'client/scripts/notes/notes';

// ----------------- ENUMS/CONSTANTS ---------------------------

let NOTE_LISTING = 'noteListing';

// ----------------- PRIVATE VARIABLES ---------------------------

let _noteListing = document.getElementsByClassName(NOTE_LISTING)[0];

// ----------------- DATA INITIALIZATION -----------------------------

// Ensure it's possible to submit notes prior to running any logic that assumes notes are writable
if (_noteListing)
{
	new noteHandler(_noteListing);	
}