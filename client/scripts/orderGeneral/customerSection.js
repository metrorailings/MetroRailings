// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderGeneral/viewModel';

import multiText from 'client/scripts/utility/multiText';

// ----------------- ENUMS/CONSTANTS ---------------------------

const CUSTOMER_NAME = 'customerName',
	COMPANY_NAME = 'companyName',
	EMAIL_ADDRESS = 'emailMultitext',
	AREA_CODE = 'areaCode',
	PHONE_ONE = 'phoneOne',
	PHONE_TWO = 'phoneTwo';

// ----------------- PRIVATE VARIABLES ---------------------------

let _nameField = document.getElementById(CUSTOMER_NAME),
	_companyField = document.getElementById(COMPANY_NAME),
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
 * Listener responsible for updating the view model with the name of the company buying our product
 *
 * @author kinsho
 */
function setCompany()
{
	vm.company = _companyField.value;
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
_companyField.addEventListener('change', setCompany);
_areaCodeField.addEventListener('change', setAreaCode);
_phoneOneField.addEventListener('change', setPhoneOne);
_phoneTwoField.addEventListener('change', setPhoneTwo);

// ----------------- DATA INITIALIZATION -----------------------------

// Instantiate the e-mail input as a multitext
new multiText(vm, 'email', _emailField.children[0]);

setName();
setCompany();
setAreaCode();
setPhoneOne();
setPhoneTwo();