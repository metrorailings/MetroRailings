// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createOrder/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var OTHER_METAL_DESCRIPTION = 'otherMetalDescription';

// ----------------- PRIVATE VARIABLES ---------------------------

var _description = document.getElementById(OTHER_METAL_DESCRIPTION);

// ----------------- LISTENERS ---------------------------

/**
 * An event that sets the type of railings needed within the view model
 *
 * @author kinsho
 */
function setDescription()
{
	vm.otherTypeDescription = _description.value;
}

// ----------------- DATA INITIALIZATION -----------------------------

// ----------------- LISTENER INITIALIZATION -----------------------------

_description.addEventListener('change', setDescription);

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

vm.otherTypeDescription = '';