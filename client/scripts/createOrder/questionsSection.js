// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createOrder/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var CURVES_YES_RADIO = 'curvesYes',
	CURVES_NO_RADIO = 'curvesNo',
	BALCONY_YES_RADIO = 'balconyYes',
	BALCONY_NO_RADIO = 'balconyNo',
	DESIGN_METHODOLOGY_PREMIUM = 'designMethodologyPremium',
	DESIGN_METHODOLOGY_BASIC = 'designMethodologyBasic';

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
 * An event that sets a flag indicating whether the railings are intended for a balcony off the ground
 *
 * @param {Event} event - the event associated with the firing of this listener
 */
function setBalconyFlag(event)
{
	var element = event.currentTarget;

	vm.balconyOrder = element.value;
}

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

document.getElementById(CURVES_YES_RADIO).addEventListener('change', setCurvesFlag);
document.getElementById(CURVES_NO_RADIO).addEventListener('change', setCurvesFlag);

document.getElementById(BALCONY_YES_RADIO).addEventListener('change', setBalconyFlag);
document.getElementById(BALCONY_NO_RADIO).addEventListener('change', setBalconyFlag);

document.getElementById(DESIGN_METHODOLOGY_PREMIUM).addEventListener('change', setDesignMethodology);
document.getElementById(DESIGN_METHODOLOGY_BASIC).addEventListener('change', setDesignMethodology);

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

vm.curvesNecessary = '';
vm.balconyOrder = '';
vm.designMethodology = '';