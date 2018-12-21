// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderGeneral/viewModel';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';
import rQuery from 'client/scripts/utility/rQueryClient';

import orderSubmissionUtility from 'client/scripts/orderGeneral/submissionUtility';

// ----------------- ENUMS/CONSTANTS ---------------------------

var SAVE_BUTTON = 'saveButton',

	SUCCESS_MESSAGE = 'Success! A new order has been created and the client has been e-mailed the link to approve' +
		' the order. The system will automatically take you back to the orders listings in a few moments.',

	ORDERS_PAGE_URL = '/orders',
	ORDER_INVOICE_URL = '/orderInvoice?id=::orderId',
	SAVE_ORDER_URL = 'createQuote/saveNewOrder',

	ORDER_ID_PLACEHOLDER = '::orderId';

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
	var data = {},
		isDesignValid = orderSubmissionUtility.validate(),
		designObject = rQuery.copyObject(vm.design, true),
		designDescriptionObject = rQuery.copyObject(vm.designDescriptions, true);

	// Organize the data that will be sent over the wire as long as the entire form is valid
	if (vm.isFormValid && isDesignValid)
	{
		data =
		{
			_id: window.MetroRailings.prospectId || '', // Set an ID here in case we are transforming a prospect into an order

			dimensions:
			{
				length: window.parseInt(vm.length, 10),
				finishedHeight: window.parseInt(vm.finishedHeight, 10)
			},

			text:
			{
				agreement: vm.agreement,
				additionalDescription: vm.additionalDescription ?
					vm.additionalDescription.split('\n\n').join('<br' + ' /><br />') : ''
			},

			installation:
			{
				platformType: vm.platformType,
				coverPlates: vm.coverPlates
			},

			pricing:
			{
				pricePerFoot: window.parseFloat(vm.pricePerFoot),
				additionalPrice: window.parseFloat(vm.additionalPrice) || 0,
				isTaxApplied: vm.applyTaxes,
				isTariffApplied: vm.applyTariffs
			},

			customer:
			{
				name: vm.name,
				company: vm.company || '',
				email: vm.email || '',
				areaCode: vm.areaCode,
				phoneOne: vm.phoneOne,
				phoneTwo: vm.phoneTwo,
				address: vm.address,
				aptSuiteNo: vm.aptSuiteNo,
				city: vm.city,
				state: vm.state,
				zipCode: vm.zipCode || ''
			},

			design: rQuery.prunePrivateMembers(designObject),
			designDescription: rQuery.prunePrivateMembers(designDescriptionObject)
		};

		// Disable the button to ensure the order is not accidentally sent multiple times
		_saveButton.disabled = true;

		axios.post(SAVE_ORDER_URL, data, true).then(() =>
		{
			// In the main tab, show a message indicating success and navigate the user back to the main admin page
			notifier.showSuccessMessage(SUCCESS_MESSAGE);

			window.setTimeout(function()
			{
				window.location.href = ORDERS_PAGE_URL;
			}, 2000);

			// Open the newly-generated invoice in a new tab
			window.open(ORDER_INVOICE_URL.replace(ORDER_ID_PLACEHOLDER), '_blank');
		}, () =>
		{
			notifier.showGenericServerError();

			_saveButton.disabled = false;
		});
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_saveButton.addEventListener('click', submit);