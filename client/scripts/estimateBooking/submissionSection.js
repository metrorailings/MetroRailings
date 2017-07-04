// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/estimateBooking/viewModel';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

// ----------------- ENUMS/CONSTANTS ---------------------------

var SUBMIT_BUTTON = 'estimateSubmissionButton',

	BOOK_ESTIMATE_URL = 'estimateBooking/bookEstimate',
	BOOKING_CONFIRMATION_URL = 'estimateConfirmation',

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
	var data;

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
					ccToken: token.id,

					customer:
					{
						name: vm.customerName,
						areaCode: vm.areaCode,
						phoneOne: vm.phoneOne,
						phoneTwo: vm.phoneTwo,
						email: vm.customerEmail
					}
				};

				axios.toggleLoadingVeil();

				// Save the data
				axios.post(BOOK_ESTIMATE_URL, data, true).then(() =>
				{
					// If successful, let's take the user to the booking confirmation page to conclude this scheduling
					// process
					window.location.href = BOOKING_CONFIRMATION_URL;
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