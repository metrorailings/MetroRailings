// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/deckRemodelersQuestionnaire/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

let CUSTOMER_NAME = 'customerName',
	PROJECT_MANAGER = 'projectManager',
	STREET_ADDRESS = 'customerAddress',
	CITY = 'customerCity',
	STATE = 'customerState';

// ----------------- PRIVATE MEMBERS ---------------------------

// Elements
let _nameField = document.getElementById(CUSTOMER_NAME),
	_managerField = document.getElementById(PROJECT_MANAGER),
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
	vm.customerName = _nameField.value;
}

/**
 * Listener responsible for setting the project manager's name into the view model
 *
 * @author kinsho
 */
function setManager()
{
	vm.projectManager = _managerField.value;
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
_managerField.addEventListener('change', setManager);
_addressField.addEventListener('change', setAddress);
_cityField.addEventListener('change', setCity);
_stateField.addEventListener('change', setState);

// ----------------- DATA INITIALIZATION -----------------------------

setName();
setManager();
setAddress();
setCity();
setState();