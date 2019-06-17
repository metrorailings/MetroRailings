// ----------------- EXTERNAL MODULES --------------------------

import uploadHandler from 'client/scripts/uploadFile/uploadFile';

// ----------------- ENUMS/CONSTANTS ---------------------------

const FILE_LISTING = 'filesListing';

// ----------------- PRIVATE VARIABLES ---------------------------

let _filesListing = document.getElementsByClassName(FILE_LISTING)[0];

// --------------- DATA INITIALIZATION ----------------------

// Ensure it's possible to upload files prior to running any logic that assumes we can upload files here
if (_filesListing)
{
	new uploadHandler(_filesListing);
}