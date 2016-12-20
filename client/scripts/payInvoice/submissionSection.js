// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/payInvoice/viewModel';
import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

// ----------------- ENUMS/CONSTANTS ---------------------------

var SUBMIT_BUTTON = 'orderSubmissionButton',

	SAVE_ORDER_URL = 'payInvoice/saveConfirmedOrder',

	CREDIT_CARD_INVALID_MESSAGE = 'Your credit card failed our authentication process. Please fix your credit card ' +
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
	var data;

	if (vm.isFormSubmissible)
	{
		// Hide any service-related error that may have popped up before
		notifier.hideServerError();

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
			axios.toggleLoadingVeil();

			if (status === 200)
			{
				// Organize the data that will need to be sent over the wire
				data =
				{
					customerName: vm.customerName,
					customerAreaCode: vm.areaCode,
					customerPhoneOne: vm.phoneOne,
					customerPhoneTwo: vm.phoneTwo,
					customerEmail: vm.customerEmail,
					customerAddress: vm.customerAddress,
					customerAptSuiteNumber: vm.customerAptSuiteNumber,
					customerCity: vm.customerCity,
					customerState: vm.customerState,
					customerZipCode: vm.customerZipCode,
					ccToken: token.id
				};

				// Save the data
				axios.post(SAVE_ORDER_URL, data, true).then(() =>
				{
					console.log('SAVED!');
				}, () =>
				{
					notifier.showGenericServerError();
				});
			}
			else
			{
				notifier.showSpecializedServerError(CREDIT_CARD_INVALID_MESSAGE);
			}
		});
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_submitButton.addEventListener('click', submit);

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

vm.isFormSubmissible = false;