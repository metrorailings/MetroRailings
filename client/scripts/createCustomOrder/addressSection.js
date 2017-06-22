// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createCustomOrder/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var STREET_ADDRESS = 'address',
	APT_NUMBER_SUITE = 'aptSuiteNo',
	CITY = 'city',
	STATE = 'state',
	ZIP_CODE = 'zipCode';

// ----------------- PRIVATE VARIABLES ---------------------------

var _streetAddressField = document.getElementById(STREET_ADDRESS),
	_aptNumberSuiteField = document.getElementById(APT_NUMBER_SUITE),
	_cityField = document.getElementById(CITY),
	_stateField = document.getElementById(STATE),
	_zipCodeField = document.getElementById(ZIP_CODE);

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the installation address into the view model
 *
 * @author kinsho
 */
function setAddress()
{
	vm.address = _streetAddressField.value;
}

/**
 * Listener responsible for setting the apartment or suite number of the installation address into the view model
 *
 * @author kinsho
 */
function setAptSuiteNo()
{
	vm.aptSuiteNo = _aptNumberSuiteField.value;
}

/**
 * Listener responsible for setting the city of the installation address into the view model
 *
 * @author kinsho
 */
function setCity()
{
	vm.city = _cityField.value;
}

/**
 * Listener responsible for setting the state of the installation address into the view model
 *
 * @author kinsho
 */
function setState()
{
	vm.state = _stateField.value;
}

/**
 * Listener responsible for setting the zip code of the installation address into the view model
 *
 * @author kinsho
 */
function setZipCode()
{
	vm.zipCode = _zipCodeField.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_streetAddressField.addEventListener('change', setAddress);
_aptNumberSuiteField.addEventListener('change', setAptSuiteNo);
_cityField.addEventListener('change', setCity);
_stateField.addEventListener('change', setState);
_zipCodeField.addEventListener('change', setZipCode);

// ----------------- DATA INITIALIZATION -----------------------------

setAddress();
setAptSuiteNo();
setCity();
setState();
setZipCode();