// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/payInvoice/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var AREA_CODE_TEXTFIELD = 'customerPhoneAreaCode',
	PHONE_NUMBER_ONE = 'customerPhoneNumber1',
	PHONE_NUMBER_TWO = 'customerPhoneNumber2',
	NAME_TEXTFIELD = 'customerName',
	EMAIL_TEXTFIELD = 'customerEmail';

// ----------------- PRIVATE VARIABLES ---------------------------

var _areaCodeField = document.getElementById(AREA_CODE_TEXTFIELD),
	_phoneOneField = document.getElementById(PHONE_NUMBER_ONE),
	_phoneTwoField = document.getElementById(PHONE_NUMBER_TWO),
	_nameField = document.getElementById(NAME_TEXTFIELD),
	_emailField = document.getElementById(EMAIL_TEXTFIELD);

// ----------------- PRIVATE FUNCTIONS ---------------------------

// ----------------- LISTENERS ---------------------------

/**
 * A listener to set the customer's name into the view model
 *
 * @author kinsho
 */
function setName()
{
	vm.customerName = _nameField.value;
}

/**
 * A listener to set the customer's area code into the view model
 *
 * @author kinsho
 */
function setAreaCode()
{
	vm.areaCode = _areaCodeField.value;
}

/**
 * A listener to set the first part of the customer's phone number into the view model
 *
 * @author kinsho
 */
function setPhoneOne()
{
	vm.phoneOne = _phoneOneField.value;
}

/**
 * A listener to set the second part of the customer's phone number into the view model
 *
 * @author kinsho
 */
function setPhoneTwo()
{
	vm.phoneTwo = _phoneTwoField.value;
}

/**
 * A listener to set the customer's email address into the view model
 *
 * @author kinsho
 */
function setEmail()
{
	vm.customerEmail = _emailField.value;
}

// ----------------- DATA INITIALIZATION -----------------------------

// ----------------- LISTENER INITIALIZATION -----------------------------

// Attach event listeners to set data into the view model
_areaCodeField.addEventListener('blur', setAreaCode);
_phoneOneField.addEventListener('blur', setPhoneOne);
_phoneTwoField.addEventListener('blur', setPhoneTwo);
_emailField.addEventListener('blur', setEmail);
_nameField.addEventListener('keyup', setName);

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

vm.areaCode = '';
vm.phoneOne = '';
vm.phoneTwo = '';
vm.customerEmail = '';
vm.customerName = '';