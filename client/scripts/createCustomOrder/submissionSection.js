// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createCustomOrder/viewModel';
import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

// ----------------- ENUMS/CONSTANTS ---------------------------

var SUBMIT_BUTTON = 'saveCustomOrder',

	SUCCESS_MESSAGE = 'Success! A new order has been created and the client has been e-mailed the link to approve' +
		' the order. The system will automatically take you back to the orders listings in a few moments.',

	ORDERS_PAGE_URL = '/orders',
	SAVE_ORDER_URL = 'createCustomOrder/saveNewOrder';

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
	var data = {};

	// Organize the data that will be sent over the wire as long as the form is valid
	if (vm.isFormValid)
	{
		data =
		{
			type: vm.type,
			length: window.parseInt(vm.length, 10),
			customMetadata:
			{
				pricePerFoot: window.parseFloat(vm.pricePerFoot),
				customFeatures: vm.customFeatures,
				customPrice: window.parseFloat(vm.customPrice),
				agreement: vm.agreement
			},
			customer:
			{
				name: vm.name,
				email: vm.email,
				areaCode: vm.areaCode,
				phoneOne: vm.phoneOne,
				phoneTwo: vm.phoneTwo,
				address: vm.address,
				aptSuiteNo: vm.aptSuiteNo,
				city: vm.city,
				state: vm.state,
				zipCode: vm.zipCode
			},
			design:
			{
				post: vm.design.post,
				postEnd: vm.design.postEnd,
				postCap: vm.design.postCap,
				center: vm.design.center,
				color: vm.design.color
			}
		};

		// Disable the button to ensure the order is not accidentally sent multiple times
		_submitButton.disabled = true;

		axios.post(SAVE_ORDER_URL, data, true).then(() =>
		{
			notifier.showSuccessMessage(SUCCESS_MESSAGE);

			window.setTimeout(function()
			{
				window.location.href = ORDERS_PAGE_URL;
			}, 6000);
		}, () =>
		{
			notifier.showGenericServerError();
			_submitButton.disabled = false;
		});
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_submitButton.addEventListener('click', submit);