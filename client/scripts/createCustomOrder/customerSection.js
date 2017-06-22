// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createCustomOrder/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var CUSTOMER_NAME = 'customerName',
	EMAIL_ADDRESS = 'customerEmail',
	AREA_CODE = 'areaCode',
	PHONE_ONE = 'phoneOne',
	PHONE_TWO = 'phoneTwo';

// ----------------- PRIVATE VARIABLES ---------------------------

var _nameField = document.getElementById(CUSTOMER_NAME),
	_emailField = document.getElementById(EMAIL_ADDRESS),
	_areaCodeField = document.getElementById(AREA_CODE),
	_phoneOneField = document.getElementById(PHONE_ONE),
	_phoneTwoField = document.getElementById(PHONE_TWO);

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting a customer's name into the view model
 *
 * @author kinsho
 */
function setName()
{
	vm.name = _nameField.value;
}

/**
 * Listener responsible for setting a customer's e-mail address into the view model
 *
 * @author kinsho
 */
function setEmail()
{
	vm.email = _emailField.value;
}

/**
 * Listener responsible for setting a customer's area code into the view model
 *
 * @author kinsho
 */
function setAreaCode()
{
	vm.areaCode = _areaCodeField.value;
}

/**
 * Listener responsible for setting a part of the customer's phone number into the view model
 *
 * @author kinsho
 */
function setPhoneOne()
{
	vm.phoneOne = _phoneOneField.value;
}

/**
 * Listener responsible for setting a part of the customer's phone number into the view model
 *
 * @author kinsho
 */
function setPhoneTwo()
{
	vm.phoneTwo = _phoneTwoField.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_nameField.addEventListener('change', setName);
_emailField.addEventListener('change', setEmail);
_areaCodeField.addEventListener('change', setAreaCode);
_phoneOneField.addEventListener('change', setPhoneOne);
_phoneTwoField.addEventListener('change', setPhoneTwo);

// ----------------- DATA INITIALIZATION -----------------------------

setName();
setEmail();
setAreaCode();
setPhoneOne();
setPhoneTwo();