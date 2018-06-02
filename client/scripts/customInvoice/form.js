// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/customInvoice/viewModel';

// ----------------- ENUMS/CONSTANTS ----------------------

var ORDER_ID_TEXTFIELD = 'orderID',
	CUSTOMER_NAME_TEXTFIELD = 'customerName',
	EMAIL_TEXTFIELD = 'customerEmail',
	ADDRESS_TEXTFIELD = 'customerAddress',
	CITY_TEXTFIELD = 'customerCity',
	STATE_DROPDOWN = 'customerState';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
var _orderIdField = document.getElementById(ORDER_ID_TEXTFIELD),
	_nameField = document.getElementById(CUSTOMER_NAME_TEXTFIELD),
	_emailField = document.getElementById(EMAIL_TEXTFIELD),
	_addressField = document.getElementById(ADDRESS_TEXTFIELD),
	_cityField = document.getElementById(CITY_TEXTFIELD),
	_stateField = document.getElementById(STATE_DROPDOWN);

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the order ID into the view model
 *
 * @author kinsho
 */
function setOrderID()
{
	vm.orderId = _orderIdField.value;
}

/**
 * Listener responsible for setting the recipient's name into the view model
 *
 * @author kinsho
 */
function setName()
{
	vm.name = _nameField.value;
}

/**
 * Listener responsible for setting the recipient's e-mail address into the view model
 *
 * @author kinsho
 */
function setEmail()
{
	vm.email = _emailField.value;
}

/**
 * Listener responsible for setting the recipient's e-mail address into the view model
 *
 * @author kinsho
 */
function setAddress()
{
	vm.address = _addressField.value;
}

/**
 * Listener responsible for setting the recipient's e-mail address into the view model
 *
 * @author kinsho
 */
function setCity()
{
	vm.city = _cityField.value;
}

/**
 * Listener responsible for setting the recipient's e-mail address into the view model
 *
 * @author kinsho
 */
function setState()
{
	vm.state = _stateField.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

// Set up the view model listeners
_orderIdField.addEventListener('blur', setOrderID);
_nameField.addEventListener('blur', setName);
_emailField.addEventListener('blur', setEmail);
_addressField.addEventListener('blur', setAddress);
_cityField.addEventListener('blur', setCity);
_stateField.addEventListener('change', setState);

// ----------------- DATA INITIALIZATION -----------------------------

vm.orderId = window.MetroRailings.order ? window.MetroRailings.order._id : '';
vm.name = window.MetroRailings.order ? window.MetroRailings.order.customer.name : '';
vm.email = window.MetroRailings.order ? window.MetroRailings.order.customer.email : '';
vm.address = window.MetroRailings.order ? window.MetroRailings.order.customer.address : '';
vm.city = window.MetroRailings.order ? window.MetroRailings.order.customer.city : '';
vm.state = window.MetroRailings.order ? window.MetroRailings.order.customer.state : '';;