// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/customInvoice/viewModel';

// ----------------- ENUMS/CONSTANTS ----------------------

var ORDER_ID_TEXTFIELD = 'orderID',
	CUSTOMER_NAME_TEXTFIELD = 'customerName',
	EMAIL_TEXTFIELD = 'customerEmail';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
var _orderIdField = document.getElementById(ORDER_ID_TEXTFIELD),
	_nameField = document.getElementById(CUSTOMER_NAME_TEXTFIELD),
	_emailField = document.getElementById(EMAIL_TEXTFIELD);

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
	vm.recipient.name = _nameField.value;
}

/**
 * Listener responsible for setting the recipient's e-mail address into the view model
 *
 * @author kinsho
 */
function setNewEmail()
{
	vm.recipient.email = _emailField.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

// Set up the view model listeners
_orderIdField.addEventListener('change', setOrderID);
_nameField.addEventListener('change', setName);
_emailField.addEventListener('change', setNewEmail);

// ----------------- DATA INITIALIZATION -----------------------------

vm.orderId = window.MetroRailings.order ? window.MetroRailings.order._id : '';
vm.name = window.MetroRailings.order ? window.MetroRailings.order.customer.name : '';
vm.email = window.MetroRailings.order ? window.MetroRailings.order.customer.email : '';