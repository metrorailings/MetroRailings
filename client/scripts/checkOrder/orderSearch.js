// ----------------- EXTERNAL MODULES --------------------------

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

import vm from 'client/scripts/checkOrder/viewModel';

// ----------------- ENUMS/CONSTANTS ----------------------

var ORDER_ID_TEXTFIELD = 'orderId',
	EMAIL_TEXTFIELD = 'orderEmail',
	PHONE_TWO_TEXTFIELD = 'orderPhoneTwo',
	SUBMISSION_BUTTON = 'orderSearchButton',

	ORDER_RENDER_EVENT = 'orderRender',

	SEARCH_FOR_ORDERS_URL = 'checkOrder/searchForOrders';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
var _orderIdField = document.getElementById(ORDER_ID_TEXTFIELD),
	_emailField = document.getElementById(EMAIL_TEXTFIELD),
	_phoneTwoField = document.getElementById(PHONE_TWO_TEXTFIELD),

	_submitButton = document.getElementById(SUBMISSION_BUTTON);

// ----------------- PRIVATE FUNCTIONS ---------------------------

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the order ID into the view model
 *
 * @author kinsho
 */
function setOrderID()
{
	vm.orderID = _orderIdField.value;
}

/**
 * Listener responsible for setting the e-mail address into the view model
 *
 * @author kinsho
 */
function setEmail()
{
	vm.email = _emailField.value;
}

/**
 * Listener responsible for setting the last four digits of a phone number into the view model
 *
 * @author kinsho
 */
function setPhoneTwo()
{
	vm.phoneTwo = _phoneTwoField.value;
}

/**
 * Listener responsible for initiating a search for orders
 *
 * @author kinsho
 */
function searchForOrders()
{
	var data = {};

	// Only proceed should the form be readily submissible
	if (vm.isFormSubmissible)
	{
		// Organize the data to send over the wire
		data =
		{
			orderID: vm.orderID,
			email: vm.email,
			phoneTwo: vm.phoneTwo
		};

		axios.post(SEARCH_FOR_ORDERS_URL, data, true).then((results) =>
		{
			vm.orders = results.data;

			// Broadcast a signal indicating that the page should render the order listings over
			document.dispatchEvent(new Event(ORDER_RENDER_EVENT));
		}, () =>
		{
			notifier.showGenericServerError();
		});
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

// Set up the view model listeners
_orderIdField.addEventListener('input', setOrderID);
_emailField.addEventListener('input', setEmail);
_phoneTwoField.addEventListener('input', setPhoneTwo);

_submitButton.addEventListener('click', searchForOrders);

// ----------------- DATA INITIALIZATION -----------------------------

vm.orderID = '';
vm.email = '';
vm.phoneTwo = '';