// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/payInvoice/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var STREET_ADDRESS_TEXTFIELD = 'streetAddress',
	APT_SUITE_NUMBER_TEXTFIELD = 'aptSuiteNumber',
	CITY_TEXTFIELD = 'city',
	STATE_DROPDOWN = 'state',
	ZIP_CODE_TEXTFIELD = 'addressZipCode';

// ----------------- PRIVATE VARIABLES ---------------------------

var _streetAddressField = document.getElementById(STREET_ADDRESS_TEXTFIELD),
	_aptSuiteNumberField = document.getElementById(APT_SUITE_NUMBER_TEXTFIELD),
	_cityField = document.getElementById(CITY_TEXTFIELD),
	_stateField = document.getElementById(STATE_DROPDOWN),
	_zipCodeField = document.getElementById(ZIP_CODE_TEXTFIELD);

// ----------------- PRIVATE FUNCTIONS ---------------------------

// ----------------- LISTENERS ---------------------------

/**
 * A listener to set the customer's address into the view model
 *
 * @author kinsho
 */
function setAddress()
{
	vm.customerAddress = _streetAddressField.value;
}

/**
 * A listener to set the customer's apartment/suite number into the view model
 *
 * @author kinsho
 */
function setAptSuiteNumber()
{
	vm.customerAptSuiteNumber = _aptSuiteNumberField.value;
}

/**
 * A listener to set the customer's city into the view model
 *
 * @author kinsho
 */
function setCity()
{
	vm.customerCity = _cityField.value;
}

/**
 * A listener to set the customer's state into the view model
 *
 * @author kinsho
 */
function setState()
{
	vm.customerState = _stateField.value;
}

/**
 * A listener to set the customer's zip code into the view model
 *
 * @author kinsho
 */
function setZipCode()
{
	vm.customerZipCode = _zipCodeField.value;
}

// ----------------- DATA INITIALIZATION -----------------------------

// ----------------- LISTENER INITIALIZATION -----------------------------

// Bind the view model to the relevant inputs
_streetAddressField.addEventListener('keyup', setAddress);
_aptSuiteNumberField.addEventListener('keyup', setAptSuiteNumber);
_cityField.addEventListener('keyup', setCity);
_stateField.addEventListener('change', setState);
_zipCodeField.addEventListener('blur', setZipCode);

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

vm.customerAddress = '';
vm.customerAptSuiteNumber = '';
vm.customerCity = '';
vm.customerState = '';
vm.customerZipCode = '';