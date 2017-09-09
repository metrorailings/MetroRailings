// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderDetails/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var DESCRIPTION_TEXT_AREA = 'orderDescription',
	AGREEMENT_TEXT_AREA = 'agreement',
	EXTEND_TIME_LIMIT_TEXTFIELD = 'extendTimeLimit';

// ----------------- PRIVATE VARIABLES ---------------------------

var _descriptionField = document.getElementById(DESCRIPTION_TEXT_AREA),
	_agreementField = document.getElementById(AGREEMENT_TEXT_AREA),
	_extendTimeLimitField = document.getElementById(EXTEND_TIME_LIMIT_TEXTFIELD) || { value: '', addEventListener: () => {} };

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the terms of the contract into the view model
 *
 * @author kinsho
 */
function setAgreement()
{
	vm.agreement = _agreementField.value;
}

/**
 * Listener responsible for setting the customer-friendly description of the order into the view model
 *
 * @author kinsho
 */
function setDescription()
{
	vm.orderDescription = _descriptionField.value;
}

/**
 * Listener responsible for setting any time limit extension into the view model
 *
 * @author kinsho
 */
function setTimeLimitExtension()
{
	vm.extendTimeLimit = _extendTimeLimitField.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_descriptionField.addEventListener('change', setDescription);
_agreementField.addEventListener('change', setAgreement);
_extendTimeLimitField.addEventListener('change', setTimeLimitExtension);

// ----------------- DATA INITIALIZATION -----------------------------

setTimeLimitExtension();