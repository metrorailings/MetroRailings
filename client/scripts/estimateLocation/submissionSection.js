// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/estimateLocation/viewModel';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

// ----------------- ENUMS/CONSTANTS ---------------------------

var SUBMIT_BUTTON = 'estimateSubmissionButton',

	CHECK_LOCATION_URL = 'estimateLocation/checkLocationValidity',
	SCHEDULE_ESTIMATE_URL = 'estimateBooking',

	LOCATION_INVALID_MESSAGE = 'Odd...Googly Maps did not recognize that address. Check the address again to make' +
		' sure it\'s correct. If you keep seeing this error message, call us and explain the issue.';

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

		// Organize the data that will need to be sent over the wire
		data =
		{
			address: vm.customerAddress,
			aptSuiteNumber: vm.customerAptSuiteNumber,
			city: vm.customerCity,
			state: vm.customerState,
			zipCode: vm.customerZipCode
		};

		// Show that loading veil before we reach out to the server to proceed further
		axios.toggleLoadingVeil();

		// Post the data
		axios.post(CHECK_LOCATION_URL, data, true).then(() =>
		{
			// If successful, let's take the user to the booking page where he could book the estimate
			window.location.href = SCHEDULE_ESTIMATE_URL;
		}, () =>
		{
			notifier.showSpecializedServerError(LOCATION_INVALID_MESSAGE);
		});
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_submitButton.addEventListener('click', submit);

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

vm.isFormSubmissible = false;