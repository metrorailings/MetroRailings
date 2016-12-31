// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderDetails/viewModel';
import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';
import confirmationModal from 'client/scripts/utility/confirmationModal';

// ----------------- ENUMS/CONSTANTS ---------------------------

var SUBMIT_BUTTON = 'saveChangesButton',

	TAG_ICON_CLASS = 'fa-tag',
	REVEAL_CLASS = 'reveal',

	SAVE_CHANGES_CONFIRMATION = 'Are you sure you want to save the changes you made to the order?',
	REFUND_CONFIRMATION = 'We will be <b>refunding $::charge</b> back to the customer. Are you sure you want to do this?',
	CHARGE_CONFIRMATION = "We will be <b>charging $::charge</b> to the customer's credit card. Are you sure you want to do this?",
	CHARGE_PLACEHOLDER = '::charge',

	SAVE_ORDER_URL = 'orderDetails/saveChanges';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
var _submitButton = document.getElementById(SUBMIT_BUTTON);

// ----------------- PRIVATE METHODS ---------------------------

/**
 * Function responsible for actually submitting the changes to the server
 *
 * @author kinsho
 */
function _submitChanges()
{
	// Organize the data that will need to be sent over the wire
	var data =
	{
	};

	// Save the data
console.log("SAVED!");
/**
	axios.post(SAVE_ORDER_URL, data, true).then(() =>
	{
		console.log('SAVED!');
	}, () =>
	{
		notifier.showGenericServerError();
	});
*/
}

// ----------------- LISTENERS ---------------------------

/**
 * Function responsible for submitting the form
 *
 * @author kinsho
 */
function submit()
{
	var modifications = document.getElementsByClassName(TAG_ICON_CLASS + ' ' + REVEAL_CLASS),
		chargeDifference = (window.parseFloat(vm.orderTotal) - vm.originalOrder.orderTotal).toFixed(2),
		confirmationMessages = [];

	if (vm.isFormValid)
	{
		// Hide any service-related error that may have popped up before
		notifier.hideServerError();

		// If there are changes, show a confirmation modal confirming whether the admin wants to
		// really save the changes he made to the order
		if (modifications.length)
		{
			confirmationMessages.push(SAVE_CHANGES_CONFIRMATION);
		}

		// If the customer's card needs to be charged more money, show a confirmation modal in order to warn the admin
		// that the customer's credit card will be charged
		if (chargeDifference > 0)
		{
			confirmationMessages.push(CHARGE_CONFIRMATION.replace(CHARGE_PLACEHOLDER, chargeDifference));
		}
		// If the customer needs to be refunded some money, show a confirmation modal in order to warn the admin
		// that the customer will be refunded some money
		else if (chargeDifference < 0)
		{
			confirmationMessages.push(REFUND_CONFIRMATION.replace(CHARGE_PLACEHOLDER, Math.abs(chargeDifference).toFixed(2)));
		}

		if (confirmationMessages.length)
		{
			confirmationModal.open(confirmationMessages, _submitChanges, () => {});
		}
		else
		{
			_submitChanges();
		}
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_submitButton.addEventListener('click', submit);

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

vm.isFormValid = true;