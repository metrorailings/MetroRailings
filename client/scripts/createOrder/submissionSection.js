// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createOrder/viewModel';
import axios from 'client/scripts/utility/axios';

// ----------------- ENUMS/CONSTANTS ---------------------------

var SUBMIT_BUTTON = 'orderSubmissionButton';

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
	if (vm.isFormSubmissible)
	{
		console.log('Good');
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_submitButton.addEventListener('click', submit);