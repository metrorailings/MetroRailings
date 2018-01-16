// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createOrder/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var DESIGN_METHODOLOGY_CUSTOM = 'designMethodologyCustom',
	DESIGN_METHODOLOGY_PRESET = 'designMethodologyPreset';

// ----------------- LISTENERS ---------------------------

/**
 * An event that sets exactly how the user wants to go about designing his railings
 *
 * @param {Event} event - the event associated with the firing of this listener
 */
function setDesignMethodology(event)
{
	var element = event.currentTarget;

	vm.designMethodology = element.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

document.getElementById(DESIGN_METHODOLOGY_CUSTOM).addEventListener('change', setDesignMethodology);
document.getElementById(DESIGN_METHODOLOGY_PRESET).addEventListener('change', setDesignMethodology);

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

vm.designMethodology = '';