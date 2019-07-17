// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderInvoice/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

const CREDIT_CARD_TEXTFIELD = 'creditCardNumber',
	SECURITY_CODE_TEXTFIELD = 'securityCode',
	EXPIRATION_MONTH_DROPDOWN = 'expirationDateMonth',
	EXPIRATION_YEAR_DROPDOWN = 'expirationDateYear';

// ----------------- PRIVATE VARIABLES ---------------------------

let _creditCardNumberField = document.getElementById(CREDIT_CARD_TEXTFIELD),
	_securityCodeField = document.getElementById(SECURITY_CODE_TEXTFIELD),
	_expirationMonthField = document.getElementById(EXPIRATION_MONTH_DROPDOWN),
	_expirationYearField = document.getElementById(EXPIRATION_YEAR_DROPDOWN);

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

// ----------------- LISTENER INITIALIZATION -----------------------------

// Only allow this listener to be added should we still be awaiting payment on this order
if (_creditCardNumberField)
{
	_creditCardNumberField.addEventListener('keyup', setCCNumber);
	_expirationMonthField.addEventListener('change', setCCExpMonth);
	_expirationYearField.addEventListener('change', setCCExpYear);
	_securityCodeField.addEventListener('blur', setCCSecurityCode);
}

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

// Only allow view model logic here should this section be visible to the user
if (_creditCardNumberField)
{
	vm.ccNumber = '';
	vm.ccSecurityCode = '';
	vm.ccExpYear = '';
	vm.ccExpMonth = '';
}