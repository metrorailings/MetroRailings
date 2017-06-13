// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/payInvoice/viewModel';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

// ----------------- ENUMS/CONSTANTS ---------------------------

var SUBMIT_BUTTON = 'orderSubmissionButton',

	SAVE_ORDER_URL = 'payInvoice/saveConfirmedOrder',
	ORDER_CONFIRMATION_URL = 'orderConfirmation',

	CREDIT_CARD_INVALID_MESSAGE = 'Your credit card failed our authentication process. Please check your credit card ' +
			'information and try again.';

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
	var order = window.MetroRailings.order,
		data;

	if (vm.isFormSubmissible)
	{
		// Hide any service-related error that may have popped up before
		notifier.hideErrorBar();

		// Show that loading veil before we reach out to Stripe to pre-verify the credit card
		axios.toggleLoadingVeil();

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
					type: order.type,
					length: order.length,
					ccToken: token.id,
					design: order.design,

					customer:
					{
						name: vm.customerName,
						address: vm.customerAddress,
						areaCode: vm.areaCode,
						phoneOne: vm.phoneOne,
						phoneTwo: vm.phoneTwo,
						email: vm.customerEmail,
						aptSuiteNumber: vm.customerAptSuiteNumber,
						city: vm.customerCity,
						state: vm.customerState,
						zipCode: vm.customerZipCode,
					}
				};

				axios.toggleLoadingVeil();

				// Save the data
				axios.post(SAVE_ORDER_URL, data, true).then(() =>
				{
					// If successful, let's take the user to the order confirmation page to conclude this ordering process
					window.location.href = ORDER_CONFIRMATION_URL;
				}, () =>
				{
					notifier.showGenericServerError();
				});
			}
			else
			{
				axios.toggleLoadingVeil();
				notifier.showSpecializedServerError(CREDIT_CARD_INVALID_MESSAGE);
			}
		});
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_submitButton.addEventListener('click', submit);

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

vm.isFormSubmissible = false;