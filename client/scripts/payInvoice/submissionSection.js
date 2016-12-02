// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/payInvoice/viewModel';
import axios from 'client/scripts/utility/axios';

// ----------------- ENUMS/CONSTANTS ---------------------------

var SUBMIT_BUTTON = 'orderSubmissionButton',

	SAVE_ORDER_URL = 'payInvoice/saveOrder';

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
		window.Stripe.card.createToken(
		{
			number: vm.ccNumber,
			exp_month: vm.ccExpMonth,
			exp_year: vm.ccExpYear,
			cvc: vm.ccSecurityCode
		}, (status, token) =>
		{
			if (status === 200)
			{
				// Organize the data that will need to be sent over the wire
				data =
				{
					customerName: vm.customerName,
					customerPhone: vm.customerPhone,
					customerEmail: vm.customerEmail,
					customerAddress: vm.customerAddress,
					customerAptSuiteNumber: vm.customerAptSuiteNumber,
					customerCity: vm.customerCity,
					customerState: vm.customerState,
					customerZipCode: vm.customerZipCode,
					ccToken: token
				};
			}
		});

		// Save the data
		axios.post(SAVE_ORDER_URL, data, true).then(() =>
		{
			console.log('SAVED!');
		});
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_submitButton.addEventListener('click', submit);

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

vm.isFormSubmissible = false;