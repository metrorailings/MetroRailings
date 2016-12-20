// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createOrder/viewModel';
import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

// ----------------- ENUMS/CONSTANTS ---------------------------

var SUBMIT_BUTTON = 'orderSubmissionButton',

	SAVE_ORDER_URL = 'createOrder/saveOrder',
	PAY_INVOICE_URL = '/payInvoice';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
var _submitButton = document.getElementById(SUBMIT_BUTTON);

// ----------------- LISTENERS ---------------------------

/**
 * Function responsible for submitting the form
 *
 * @author kinsho
 */
function submit()
{
	var data;

	if (vm.isFormSubmissible)
	{
		// Organize the data that will need to be sent over the wire
		data =
		{
			type: vm.orderType,
			length: vm.orderLength,
			style: vm.orderStyle,
			color: vm.orderColor
		};

		// Save the data
		axios.post(SAVE_ORDER_URL, data, true).then(() =>
		{
			// If successful, let's take the user to the invoice page to complete the order
			window.location.href = PAY_INVOICE_URL;
		}, () =>
		{
			notifier.showGenericServerError();
		});
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_submitButton.addEventListener('click', submit);