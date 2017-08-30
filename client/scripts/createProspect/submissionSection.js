// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createProspect/viewModel';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

// ----------------- ENUMS/CONSTANTS ---------------------------

var SAVE_BUTTON = 'saveProspect',

	SUCCESS_MESSAGE = 'Success! A new prospect has been created. Taking you back to the orders page shortly...',

	SAVE_PROSPECT_URL = 'createProspect/saveNewProspect';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
var _saveButton = document.getElementById(SAVE_BUTTON);

// ----------------- LISTENERS ---------------------------

/**
 * Function responsible for submitting the form
 *
 * @author kinsho
 */
function submit()
{
	var data = {};

	// Organize the data that will be sent over the wire as long as the form is valid
	if (vm.isFormValid)
	{
		data =
		{
			notes:
			{
				internal: vm.notes.split('\n').join('<br />')
			},

			customer:
			{
				name: vm.name,
				email: vm.email || '',
				areaCode: vm.areaCode,
				phoneOne: vm.phoneOne,
				phoneTwo: vm.phoneTwo,
				address: vm.address,
				aptSuiteNo: vm.aptSuiteNo,
				city: vm.city,
				state: vm.state,
				zipCode: vm.zipCode
			}
		};

		// Disable the button to ensure the order is not accidentally sent multiple times
		_saveButton.disabled = true;

		axios.post(SAVE_PROSPECT_URL, data, true).then(() =>
		{
			notifier.showSuccessMessage(SUCCESS_MESSAGE);

			window.setTimeout(function()
			{
				window.history.back();
			}, 3000);
		}, () =>
		{
			notifier.showGenericServerError();

			_saveButton.disabled = false;
		});
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_saveButton.addEventListener('click', submit);