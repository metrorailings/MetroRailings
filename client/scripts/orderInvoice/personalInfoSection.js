// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderInvoice/viewModel';

import multiText from 'client/scripts/utility/multiText';

// ----------------- ENUMS/CONSTANTS ---------------------------

const AREA_CODE_TEXTFIELD = 'customerPhoneAreaCode',
	PHONE_NUMBER_ONE = 'customerPhoneNumber1',
	PHONE_NUMBER_TWO = 'customerPhoneNumber2',
	NAME_TEXTFIELD = 'customerName',
	EMAIL_TEXTFIELD = 'emailMultitext',
	COMPANY_NAME_FIELD = 'companyName';

// ----------------- PRIVATE VARIABLES ---------------------------

let _areaCodeField = document.getElementById(AREA_CODE_TEXTFIELD),
	_phoneOneField = document.getElementById(PHONE_NUMBER_ONE),
	_phoneTwoField = document.getElementById(PHONE_NUMBER_TWO),
	_nameField = document.getElementById(NAME_TEXTFIELD),
	_companyField = document.getElementById(COMPANY_NAME_FIELD),

	_emailField = document.getElementById(EMAIL_TEXTFIELD);

// ----------------- LISTENERS ---------------------------

/**
 * A listener to set the customer's name into the view model
 *
 * @author kinsho
 */
function setName()
{
	vm.name = _nameField.value;
}

/**
 * A listener to set the customer's company affiliation into the view model
 *
 * @author kinsho
 */
function setCompany()
{
	vm.company = _companyField.value;
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

// ----------------- LISTENER INITIALIZATION -----------------------------

// Attach event listeners to set data into the view model
_areaCodeField.addEventListener('change', setAreaCode);
_phoneOneField.addEventListener('change', setPhoneOne);
_phoneTwoField.addEventListener('change', setPhoneTwo);
_nameField.addEventListener('change', setName);
_companyField.addEventListener('change', setCompany);

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

// Instantiate the e-mail input as a multitext
new multiText(vm, 'email', _emailField.children[0]);

vm.name = _nameField.value;
vm.company = _companyField.value;
vm.areaCode = _areaCodeField.value;
vm.phoneOne = _phoneOneField.value;
vm.phoneTwo = _phoneTwoField.value;