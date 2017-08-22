// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/designRailings/viewModel';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

// ----------------- ENUMS/CONSTANTS ---------------------------

var SUBMIT_BUTTON = 'submissionButton',

	CONTINUE_ORDER_URL = 'design/continueWithOrder';

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

	// Organize the data that will need to be sent over the wire
	data =
	{
		post: vm.postDesign,
		postEnd: vm.postEndDesign,
		postCap: vm.postCapDesign,
		center: vm.centerDesign,
		color: vm.orderColor
	};

	// Submit the user's inputs so far
	axios.post(CONTINUE_ORDER_URL, data, true).then(() =>
	{
		// If successful, let's take the user to the design page to continue the order
		// @TODO: Take the user to the next page of the estimation process
		window.location.href = '';
	}, () =>
	{
		notifier.showGenericServerError();
	});
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_submitButton.addEventListener('click', submit);