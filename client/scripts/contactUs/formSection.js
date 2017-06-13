// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/contactUs/viewModel';

// ----------------- ENUMS/CONSTANTS ----------------------

var CUSTOMER_NAME_FIELD = 'customerName',
	ORDER_ID_FIELD = 'orderId',
	AREA_CODE_FIELD = 'customerPhoneAreaCode',
	PHONE_ONE_FIELD = 'customerPhoneNumber1',
	PHONE_TWO_FIELD = 'customerPhoneNumber2',
	EMAIL_FIELD = 'customerEmail',
	COMMENTS_FIELD = 'comments';

// ----------------- PRIVATE VARIABLES ---------------------------

var _nameField = document.getElementById(CUSTOMER_NAME_FIELD),
	_orderIdField = document.getElementById(ORDER_ID_FIELD),
	_areaCodeField = document.getElementById(AREA_CODE_FIELD),
	_phoneOneField = document.getElementById(PHONE_ONE_FIELD),
	_phoneTwoField = document.getElementById(PHONE_TWO_FIELD),
	_emailField = document.getElementById(EMAIL_FIELD),
	_commentsField = document.getElementById(COMMENTS_FIELD);

// ----------------- PRIVATE FUNCTIONS ---------------------------

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
 * A listener to set the order ID into the view model
 *
 * @author kinsho
 */
function setOrderId()
{
	vm.orderId = _orderIdField.value;
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

/**
 * A listener to set the customer's email address into the view model
 *
 * @author kinsho
 */
function setEmail()
{
	vm.email = _emailField.value;
}

/**
 * A listener to set comments into the view model
 *
 * @author kinsho
 */
function setComments()
{
	vm.comments = _commentsField.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

// Attach event listeners to set data into the view model
_nameField.addEventListener('keyup', setName);
_orderIdField.addEventListener('keyup', setOrderId);
_areaCodeField.addEventListener('blur', setAreaCode);
_phoneOneField.addEventListener('blur', setPhoneOne);
_phoneTwoField.addEventListener('blur', setPhoneTwo);
_emailField.addEventListener('blur', setEmail);
_commentsField.addEventListener('keyup', setComments);