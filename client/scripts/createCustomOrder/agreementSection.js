// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createCustomOrder/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var AGREEMENT_FIELD = 'agreement';

// ----------------- PRIVATE VARIABLES ---------------------------

var _agreementField = document.getElementById(AGREEMENT_FIELD);

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the additional price of custom features into the view model
 *
 * @author kinsho
 */
function setAgreementText()
{
	vm.agreement = _agreementField.value.split('\n\n');
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_agreementField.addEventListener('change', setAgreementText);

// ----------------- DATA INITIALIZATION -----------------------------

_agreementField.value = window.MetroRailings.agreement;

setAgreementText();