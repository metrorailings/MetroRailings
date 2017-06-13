// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/contactUs/viewModel';
import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

// ----------------- ENUMS/CONSTANTS ---------------------------

var SUBMIT_BUTTON = 'contactUsSubmissionButton',

	SUCCESS_MESSAGE = 'Your request has been successfully sent! Expect us to reach out back to you shortly. Now we ' +
		'will be redirecting you back to the main home page in several seconds.',

	SEND_REQUEST_URL = 'contactUs/sendRequest',
	HOME_URL = '/';

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
			name: vm.name,
			orderId: vm.orderId,
			email: vm.email,
			areaCode: vm.areaCode,
			phoneOne: vm.phoneOne,
			phoneTwo: vm.phoneTwo,
			comments: vm.comments
		};

		// Save the data
		axios.post(SEND_REQUEST_URL, data, true).then(() =>
		{
			// Prevent the button from being clicked again
			_submitButton.disabled = true;

			// Show a message indicating that a request has been sent to us
			notifier.showSuccessMessage(SUCCESS_MESSAGE);

			// If successful, put up a success banner and let's take the user back to the home page after
			// about 5 seconds
			window.setTimeout(() =>
			{
				window.location.href = HOME_URL;
			}, 7500);

		}, () =>
		{
			notifier.showGenericServerError();
		});
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_submitButton.addEventListener('click', submit);

// ----------------- PAGE INITIALIZATION -----------------------------

_submitButton.disabled = false;