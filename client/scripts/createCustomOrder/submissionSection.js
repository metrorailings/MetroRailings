// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createCustomOrder/viewModel';
import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

// ----------------- ENUMS/CONSTANTS ---------------------------

var SUBMIT_BUTTON = 'saveCustomOrder',

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
			length: vm.length,
			orderTotal: vm.orderTotal,
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

		axios.post(SAVE_ORDER_URL, data, true).then(() =>
		{
			window.location.href = ORDERS_PAGE_URL;
		}, () =>
		{
			notifier.showGenericServerError();
		});
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_submitButton.addEventListener('click', submit);