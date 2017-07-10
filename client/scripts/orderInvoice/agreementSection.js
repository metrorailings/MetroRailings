// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderInvoice/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var AGREEMENT_YES_RADIO = 'agreedToTerms';

// ----------------- PRIVATE FUNCTIONS ---------------------------

// ----------------- LISTENERS ---------------------------

/**
 * An event that sets a flag indicating whether the user has agreed to the terms of conditions
 *
 * @param {Event} event - the event associated with the firing of this listener
 */
function setAgreedFlag()
{
	vm.agreedToTerms = true;
}

// ----------------- DATA INITIALIZATION -----------------------------

// ----------------- LISTENER INITIALIZATION -----------------------------

document.getElementById(AGREEMENT_YES_RADIO).addEventListener('change', setAgreedFlag);

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

vm.agreedToTerms = false;