// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createOrder/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var CURVES_YES_RADIO = 'curvesYes',
	CURVES_NO_RADIO = 'curvesNo',
	BIG_ORDER_YES_RADIO = 'bigOrderYes',
	BIG_ORDER_NO_RADIO = 'bigOrderNo';

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

/**
 * An event that sets a flag indicating whether more than a hundred feet of railing are needed
 *
 * @param {Event} event - the event associated with the firing of this listener
 */
function setBigOrderFlag(event)
{
	var element = event.currentTarget;

	vm.bigOrder = element.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

document.getElementById(CURVES_YES_RADIO).addEventListener('change', setCurvesFlag);
document.getElementById(CURVES_NO_RADIO).addEventListener('change', setCurvesFlag);

document.getElementById(BIG_ORDER_YES_RADIO).addEventListener('change', setBigOrderFlag);
document.getElementById(BIG_ORDER_NO_RADIO).addEventListener('change', setBigOrderFlag);

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

vm.curvesNecessary = '';
vm.bigOrder = '';