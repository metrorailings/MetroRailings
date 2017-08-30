// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/prospectDetails/viewModel';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';
import confirmationModal from 'client/scripts/utility/confirmationModal';

// ----------------- ENUMS/CONSTANTS ---------------------------

var SUBMIT_BUTTON = 'saveChangesButton',

	TAG_ICON_CLASS = 'fa-tag',
	REVEAL_CLASS = 'reveal',

	SAVE_CHANGES_CONFIRMATION = 'Are you sure you want to save the changes you made to the prospect?',

	SAVE_ORDER_URL = 'prospectDetails/saveChanges';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
var _submitButton = document.getElementById(SUBMIT_BUTTON);

// ----------------- PRIVATE METHODS ---------------------------

/**
 * Function responsible for actually submitting the changes to the server
 *
 * @author kinsho
 */
function _submitChanges()
{
	var numOfChangesMade,
		data = {};

	// Calculate the number of changes made to see if we should justify a connection to the server being made
	numOfChangesMade = document.getElementsByClassName(TAG_ICON_CLASS + ' ' + REVEAL_CLASS).length;

	// If no changes were made, take the user back to the orders page without even making a call to the server
	if ( !(numOfChangesMade) )
	{
		window.history.back();
		return;
	}

	// Otherwise, process to organize the data that will be sent over the wire
	data =
	{
		_id: vm._id,

		notes:
		{
			internal: (vm.notes ? vm.notes.split('\n').join('<br />') : '')
		},

		customer:
		{
			areaCode: vm.areaCode,
			phoneOne: vm.phoneOne,
			phoneTwo: vm.phoneTwo,
			email: vm.email,
			address: vm.address,
			aptSuiteNo: vm.aptSuiteNo,
			city: vm.city,
			state: vm.state,
			zipCode: vm.zipCode
		}
	};

	axios.post(SAVE_ORDER_URL, data, true).then(() =>
	{
		window.history.back();
	}, () =>
	{
		notifier.showGenericServerError();
	});
}

// ----------------- LISTENERS ---------------------------

/**
 * Function responsible for submitting the form
 *
 * @author kinsho
 */
function submit()
{
	var modifications = document.getElementsByClassName(TAG_ICON_CLASS + ' ' + REVEAL_CLASS),
		confirmationMessages = [];

	if (vm.isFormValid)
	{
		// Hide any service-related error that may have popped up before
		notifier.hideErrorBar();

		// If there are changes, show a confirmation modal confirming whether the admin wants to
		// really save the changes he made to the order
		if (modifications.length)
		{
			confirmationMessages.push(SAVE_CHANGES_CONFIRMATION);
		}

		if (confirmationMessages.length)
		{
			confirmationModal.open(confirmationMessages, _submitChanges, () => {});
		}
		else
		{
			_submitChanges();
		}
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_submitButton.addEventListener('click', submit);

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

vm.isFormValid = true;