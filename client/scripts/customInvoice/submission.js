// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/customInvoice/viewModel';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

// ----------------- ENUMS/CONSTANTS ----------------------

var VALIDATE_VIEW_MODEL_LISTENER = 'validateCustomInvoiceVM',

	SUBMIT_BUTTON = 'customInvoiceSubmit',
	SAVE_BUTTON = 'customInvoiceSave',

	CREATE_INVOICE_URL = 'customInvoice/saveNewInvoice',
	SAVE_INVOICE_URL = 'customInvoice/saveChangesToInvoice',
	INVOICES_URL = '/orders',

	CREATE_SUCCESS_MESSAGE = 'Success! We sent an e-mail to the customer to point them to this invoice. Taking you' +
		' back to the main screen in a few moments...',
	SAVE_SUCCESS_MESSAGE = 'Success! We saved the changes. Taking you back to the main screen in a few moments...';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
var _submitButton = document.getElementById(SUBMIT_BUTTON),
	_saveButton = document.getElementById(SAVE_BUTTON);

// ----------------- PRIVATE METHODS ---------------------------

/**
 * Function meant to cull properties from an invoice item that do not need to be stored
 *
 * @param {Object} itemObject - the invoice item
 *
 * @returns {Object} - a cleaner item construct
 *
 * @author kinsho
 */
function _packageItem(itemObject)
{
	return {
		description: itemObject.description,
		price: itemObject.price
	};
}

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for calling the server endpoint to record the new invoice
 *
 * @author kinsho
 */
function submitInvoice()
{
	var data;

	// Check to ensure that the invoice is eligible for submission
	document.dispatchEvent(new CustomEvent(VALIDATE_VIEW_MODEL_LISTENER));

	if (vm.isFormSubmissible)
	{
		for (let i = 0; i < vm.items.length; i++)
		{
			vm.items[i] = _packageItem(vm.items[i]);
		}

		// Organize the data that will need to be sent over the wire
		data =
		{
			orderId: vm.orderId,
			name: vm.name,
			email: vm.email,
			address: vm.address,
			city: vm.city,
			state: vm.state,
			memo: vm.memo,
			items: vm.items,
			subtotal: vm.subtotal,
			isTaxWaived: vm.isTaxWaived,
			tax: vm.tax,
			totalPrice: vm.totalPrice
		};

		// Save the data
		axios.post(CREATE_INVOICE_URL, data, true).then(() =>
		{
			// Prevent the button from being clicked again
			_submitButton.disabled = true;

			// Show a message indicating that a request has been sent to us
			notifier.showSuccessMessage(CREATE_SUCCESS_MESSAGE);

			// If successful, put up a success banner and let's take the user back to the home page after
			// about 5 seconds
			window.setTimeout(() =>
			{
				window.location.href = INVOICES_URL;
			}, 7500);

		}, () =>
		{
			notifier.showGenericServerError();
		});
	}
}

/**
 * Listener responsible for calling the server endpoint to save changes to the invoice
 *
 * @author kinsho
 */
function saveChangesToInvoice()
{
	var data;

	if (vm.isFormSubmissible)
	{
		// Organize the data that will need to be sent over the wire
		data =
		{
			orderId: vm.orderId,
			name: vm.name,
			email: vm.email,
			items: vm.items,
			subtotal: vm.subtotal,
			isTaxWaived: vm.isTaxWaived,
			tax: vm.tax,
			totalPrice: vm.totalPrice
		};

		// Save the data
		axios.post(SAVE_INVOICE_URL, data, true).then(() =>
		{
			// Prevent the button from being clicked again
			_submitButton.disabled = true;

			// Show a message indicating that a request has been sent to us
			notifier.showSuccessMessage(SAVE_SUCCESS_MESSAGE);

			// If successful, put up a success banner and let's take the user back to the home page after
			// about 5 seconds
			window.setTimeout(() =>
			{
				window.location.href = INVOICES_URL;
			}, 7500);

		}, () =>
		{
			notifier.showGenericServerError();
		});
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

if (_submitButton)
{
	_submitButton.addEventListener('click', submitInvoice);
}
else if (_saveButton)
{
	_saveButton.addEventListener('click', saveChangesToInvoice);
}