// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createInvoice/viewModel';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

// ----------------- ENUMS/CONSTANTS ---------------------------

var SAVE_AND_CONTINUE_BUTTON = 'saveAndContinue',
	SAVE_AND_EXIT_BUTTON = 'saveAndExit',

	SUCCESS_MESSAGE = 'Success! A new order has been created and the client has been e-mailed the link to approve' +
		' the order. The system will automatically take you back to the orders listings in a few moments.',

	ORDERS_PAGE_URL = '/orders',
	ORDER_INVOICE_URL = '/orderInvoice?id=::orderId',
	SAVE_ORDER_URL = 'createInvoice/saveNewOrder',

	ORDER_ID_PLACEHOLDER = '::orderId';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
var _saveContinueButton = document.getElementById(SAVE_AND_CONTINUE_BUTTON),
	_saveExitButton = document.getElementById(SAVE_AND_EXIT_BUTTON);

// ----------------- LISTENERS ---------------------------

/**
 * Function responsible for submitting the form
 *
 * @author kinsho
 */
function submit(event)
{
	var data = {},
		button = event.currentTarget.id;

	// Organize the data that will be sent over the wire as long as the form is valid
	if (vm.isFormValid)
	{
		data =
		{
			_id: window.MetroRailings.prospectId || '', // Set an ID here in case we are transforming a prospect into an order
			length: window.parseInt(vm.length, 10),
			finishedHeight: window.parseInt(vm.finishedHeight, 10),
			additionalFeatures: vm.additionalFeatures.split('\n\n').join('<br /><br />'),
			agreement: vm.agreement,

			notes:
			{
				order: vm.notes.order.split('\n').join('<br />'),
				internal: '',
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
				deductions: window.parseFloat(vm.deductions) || 0
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
				zipCode: vm.zipCode || ''
			},

			design:
			{
				post: vm.design.post,
				handrailing: vm.design.handrailing,
				picket: vm.design.picket,
				postEnd: vm.design.postEnd,
				postCap: vm.design.postCap,
				center: vm.design.center,
				color: vm.design.color
			}
		};

		// Disable the button to ensure the order is not accidentally sent multiple times
		_saveContinueButton.disabled = true;
		_saveExitButton.disabled = true;

		axios.post(SAVE_ORDER_URL, data, true).then((response) =>
		{
			if (button === SAVE_AND_EXIT_BUTTON)
			{
				notifier.showSuccessMessage(SUCCESS_MESSAGE);

				window.setTimeout(function()
				{
					window.location.href = ORDERS_PAGE_URL;
				}, 2000);
			}
			else
			{
				window.location.href = ORDER_INVOICE_URL.replace(ORDER_ID_PLACEHOLDER, response.data.id);
			}
		}, () =>
		{
			notifier.showGenericServerError();

			_saveContinueButton.disabled = false;
			_saveExitButton.disabled = false;
		});
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_saveContinueButton.addEventListener('click', submit);
_saveExitButton.addEventListener('click', submit);