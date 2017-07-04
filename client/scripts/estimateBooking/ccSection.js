// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/estimateBooking/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var CREDIT_CARD_TEXTFIELD = 'creditCardNumber',
	SECURITY_CODE_TEXTFIELD = 'securityCode',
	EXPIRATION_MONTH_DROPDOWN = 'expirationDateMonth',
	EXPIRATION_YEAR_DROPDOWN = 'expirationDateYear';

// ----------------- PRIVATE VARIABLES ---------------------------

var _creditCardNumberField = document.getElementById(CREDIT_CARD_TEXTFIELD),
	_securityCodeField = document.getElementById(SECURITY_CODE_TEXTFIELD),
	_expirationMonthField = document.getElementById(EXPIRATION_MONTH_DROPDOWN),
	_expirationYearField = document.getElementById(EXPIRATION_YEAR_DROPDOWN);

// ----------------- PRIVATE FUNCTIONS ---------------------------

// ----------------- LISTENERS ---------------------------

/**
 * A listener to set the credit card number into the view model
 *
 * @author kinsho
 */
function setCCNumber()
{
	vm.ccNumber = _creditCardNumberField.value;
}

/**
 * A listener to set the credit card's expiration month into the view model
 *
 * @author kinsho
 */
function setCCExpMonth()
{
	vm.ccExpMonth = _expirationMonthField.value;
}

/**
 * A listener to set the credit card's expiration year into the view model
 *
 * @author kinsho
 */
function setCCExpYear()
{
	vm.ccExpYear = _expirationYearField.value;
}

/**
 * A listener to set the credit card security code into the view model
 *
 * @author kinsho
 */
function setCCSecurityCode()
{
	vm.ccSecurityCode = _securityCodeField.value;
}

// ----------------- DATA INITIALIZATION -----------------------------

// ----------------- LISTENER INITIALIZATION -----------------------------

// Bind the view model to the relevant inputs
_creditCardNumberField.addEventListener('keyup', setCCNumber);
_expirationMonthField.addEventListener('change', setCCExpMonth);
_expirationYearField.addEventListener('change', setCCExpYear);
_securityCodeField.addEventListener('blur', setCCSecurityCode);

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

vm.ccNumber = '';
vm.ccSecurityCode = '';
vm.ccExpYear = '';
vm.ccExpMonth = '';