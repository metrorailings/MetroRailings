// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderDetails/viewModel';
import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';
import confirmationModal from 'client/scripts/utility/confirmationModal';

// ----------------- ENUMS/CONSTANTS ---------------------------

var SUBMIT_BUTTON = 'saveChangesButton',

	CLOSED_STATUS = 'closed',

	TAG_ICON_CLASS = 'fa-tag',
	REVEAL_CLASS = 'reveal',

	SAVE_CHANGES_CONFIRMATION = 'Are you sure you want to save the changes you made to the order?',
	REFUND_CONFIRMATION = 'Are you sure you want to <b>deduct $::charge</b> from the customer\'s remaining balance?',
	CHARGE_CONFIRMATION = 'Are you sure you want to <b>add $::charge</b> more on top of the remaining balance to be' +
		' paid?',
	CHARGE_PLACEHOLDER = '::charge',

	SAVE_ORDER_URL = 'orderDetails/saveChanges';

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
		status: vm.status,
		length: vm.length,
		finishedHeight: vm.finishedHeight,
		rushOrder: vm.rushOrder,

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
		},

		design:
		{
			post: vm.postDesign,
			handrailing: vm.handrailing,
			picket: vm.picket,
			postEnd: vm.postEnd || '',
			postCap: vm.postCap || '',
			center: vm.centerDesign,
			color: vm.color
		},

		installation:
		{
			coverPlates: vm.coverPlates,
			platformType: vm.platformType
		},

		pricing:
		{
			restByCheck: vm.restByCheck,
			modification: vm.pricingModifications
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
		modifiedPricing = vm.pricingModifications || 0,
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

		// If the order is going to be closed, check to see whether we are changing the order total here. If we are,
		// set up a modal indicating whether the admin is intent on changing the order total
		if (vm.status === CLOSED_STATUS)
		{
			// If the customer ultimately needs to be charged more money, show a confirmation modal in order to warn the
			// admin that the customer will be charged more money
			if (modifiedPricing > 0)
			{
				confirmationMessages.push(CHARGE_CONFIRMATION.replace(CHARGE_PLACEHOLDER, vm.pricingModifications));
			}

			// If the customer is going to have his balance lessened, show a confirmation modal in
			// order to warn the admin that the customer will be paying less of the balance.
			else if (modifiedPricing < 0)
			{
				confirmationMessages.push(REFUND_CONFIRMATION.replace(CHARGE_PLACEHOLDER, Math.abs(vm.pricingModifications).toFixed(2)));
			}
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