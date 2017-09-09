// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createInvoice/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var AGREEMENT_FIELD = 'agreement',
	TIME_LIMIT_FIELD = 'timeLimit';

// ----------------- PRIVATE VARIABLES ---------------------------

var _agreementField = document.getElementById(AGREEMENT_FIELD),
	_timeLimitField = document.getElementById(TIME_LIMIT_FIELD);

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

/**
 * Listener responsible for setting any time limit on this order into the view model
 *
 * @author kinsho
 */
function setTimeLimit()
{
	vm.timeLimit = _timeLimitField.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_agreementField.addEventListener('change', setAgreementText);
_timeLimitField.addEventListener('change', setTimeLimit);

// ----------------- DATA INITIALIZATION -----------------------------

setAgreementText();
setTimeLimit();