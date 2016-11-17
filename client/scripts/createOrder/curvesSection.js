// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createOrder/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var CURVES_YES_RADIO = 'curvesYes',
	CURVES_NO_RADIO = 'curvesNo';

// ----------------- PRIVATE FUNCTIONS ---------------------------

// ----------------- LISTENERS ---------------------------

/**
 * An event that sets a flag indicating whether the railings will need to sport some curves
 *
 * @param {Event} event - the event associated with the firing of this listener
 */
function setCurvesFlag(event)
{
	var element = event.currentTarget;

	vm.curvesNecessary = element.value;
}

// ----------------- DATA INITIALIZATION -----------------------------

// ----------------- LISTENER INITIALIZATION -----------------------------

document.getElementById(CURVES_YES_RADIO).addEventListener('change', setCurvesFlag);
document.getElementById(CURVES_NO_RADIO).addEventListener('change', setCurvesFlag);

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

vm.curvesNecessary = '';