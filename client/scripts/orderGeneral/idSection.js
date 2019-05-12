// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderGeneral/viewModel';


// ----------------- ENUMS/CONSTANTS ---------------------------

const ID_FIELD = 'idField';

// ----------------- PRIVATE VARIABLES ---------------------------

let _idField = document.getElementById(ID_FIELD);

// ----------------- DATA INITIALIZATION -----------------------------

// Only set the ID of the order into the view model should one exist
if (_idField)
{
	vm._id = _idField.dataset.value;
}