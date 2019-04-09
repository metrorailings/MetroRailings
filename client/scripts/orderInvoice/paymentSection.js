// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderInvoice/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

const CREDIT_CARD_RADIO = 'creditCardOption',
	CHECK_RADIO = 'checkOption',

	CREDIT_CARD_TEXTFIELD = 'creditCardNumber',
	SECURITY_CODE_TEXTFIELD = 'securityCode',
	EXPIRATION_MONTH_DROPDOWN = 'expirationDateMonth',
	EXPIRATION_YEAR_DROPDOWN = 'expirationDateYear';

// ----------------- PRIVATE VARIABLES ---------------------------

let _creditCardRadio = document.getElementById(CREDIT_CARD_RADIO),
	_checkRadio = document.getElementById(CHECK_RADIO),

	_creditCardNumberField = document.getElementById(CREDIT_CARD_TEXTFIELD),
	_securityCodeField = document.getElementById(SECURITY_CODE_TEXTFIELD),
	_expirationMonthField = document.getElementById(EXPIRATION_MONTH_DROPDOWN),
	_expirationYearField = document.getElementById(EXPIRATION_YEAR_DROPDOWN);

// ----------------- LISTENERS ---------------------------

/**
 * A listener to set the payment method into the view model
 *
 * @author kinsho
 */
function setPaymentMethod(event)
{
	let element = event.currentTarget;

	vm.paymentMethod = element.value;
}

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

// Only allow this listener to be added should such a button exist in the first place
// Usually, the button exists only when the order is still pending
if (_creditCardRadio)
{
	_creditCardRadio.addEventListener('click', setPaymentMethod);
	_checkRadio.addEventListener('click', setPaymentMethod);
	_creditCardNumberField.addEventListener('keyup', setCCNumber);
	_expirationMonthField.addEventListener('change', setCCExpMonth);
	_expirationYearField.addEventListener('change', setCCExpYear);
	_securityCodeField.addEventListener('blur', setCCSecurityCode);
}

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

// Only allow view model logic here should this section be visible to the user
if (_creditCardRadio)
{
	vm.paymentMethod = '';
	vm.ccNumber = '';
	vm.ccSecurityCode = '';
	vm.ccExpYear = '';
	vm.ccExpMonth = '';
}