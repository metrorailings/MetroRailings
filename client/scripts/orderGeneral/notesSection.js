// ----------------- EXTERNAL MODULES --------------------------

import noteHandler from 'client/scripts/notes/notes';

// ----------------- ENUMS/CONSTANTS ---------------------------

let NOTE_LISTING = 'newNoteUpload';

// ----------------- PRIVATE VARIABLES ---------------------------

let _noteListing = document.getElementsByClassName(NOTE_LISTING)[0];

// ----------------- DATA INITIALIZATION -----------------------------

new noteHandler(_noteListing);