// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/prospectDetails/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var ADDRESS_TEXTFIELD = 'address',
	APT_SUITE_NUMBER_TEXTFIELD = 'aptSuiteNo',
	CITY_TEXTFIELD = 'city',
	STATE_SELECT = 'state',
	ZIP_CODE_TEXTFIELD = 'zipCode';

// ----------------- PRIVATE VARIABLES ---------------------------

var _addressField = document.getElementById(ADDRESS_TEXTFIELD),
	_aptSuiteNoField = document.getElementById(APT_SUITE_NUMBER_TEXTFIELD),
	_cityField = document.getElementById(CITY_TEXTFIELD),
	_stateField = document.getElementById(STATE_SELECT),
	_zipCodeField = document.getElementById(ZIP_CODE_TEXTFIELD);

// ----------------- PRIVATE FUNCTIONS ---------------------------

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the address into the view model
 *
 * @author kinsho
 */
function setAddress()
{
	vm.address = _addressField.value;
}

/**
 * Listener responsible for setting the apartment number or suite number into the view
 * model
 *
 * @author kinsho
 */
function setAptSuiteNo()
{
	vm.aptSuiteNo = _aptSuiteNoField.value;
}

/**
 * Listener responsible for setting the city into the view model
 *
 * @author kinsho
 */
function setCity()
{
	vm.city = _cityField.value;
}

/**
 * Listener responsible for setting the state into the view model
 *
 * @author kinsho
 */
function setState()
{
	vm.state = _stateField.value;
}

/**
 * Listener responsible for setting the zip code into the view model
 *
 * @author kinsho
 */
function setZipCode()
{
	vm.zipCode = _zipCodeField.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_addressField.addEventListener('change', setAddress);
_aptSuiteNoField.addEventListener('change', setAptSuiteNo);
_cityField.addEventListener('change', setCity);
_stateField.addEventListener('change', setState);
_zipCodeField.addEventListener('change', setZipCode);