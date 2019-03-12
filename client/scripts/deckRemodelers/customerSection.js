// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/deckRemodelers/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

let CUSTOMER_NAME = 'customerName',
	STREET_ADDRESS = 'customerAddress',
	CITY = 'customerCity',
	STATE = 'customerState';

// ----------------- PRIVATE MEMBERS ---------------------------

// Elements
let _nameField = document.getElementById(CUSTOMER_NAME),
	_addressField = document.getElementById(STREET_ADDRESS),
	_cityField = document.getElementById(CITY),
	_stateField = document.getElementById(STATE);

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
 * Listener responsible for setting a customer's name into the view model
 *
 * @author kinsho
 */
function setAddress()
{
	vm.address = _addressField.value;
}

/**
 * Listener responsible for setting a customer's name into the view model
 *
 * @author kinsho
 */
function setCity()
{
	vm.city = _cityField.value;
}

/**
 * Listener responsible for setting a customer's name into the view model
 *
 * @author kinsho
 */
function setState()
{
	vm.state = _stateField.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_nameField.addEventListener('change', setName);
_addressField.addEventListener('change', setAddress);
_cityField.addEventListener('change', setCity);
_stateField.addEventListener('change', setState);

// ----------------- DATA INITIALIZATION -----------------------------

setName();
setAddress();
setCity();
setState();