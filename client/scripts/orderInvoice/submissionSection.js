// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderInvoice/viewModel';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

// ----------------- ENUMS/CONSTANTS ---------------------------

var SUBMIT_BUTTON = 'orderSubmissionButton',

	CREDIT_CARD_PAYMENT_METHOD = 'cc',

	SAVE_ORDER_URL = 'orderInvoice/approveOrder',
	ORDER_CONFIRMATION_URL = 'orderConfirmation',

	ID_URL_PARAM = 'id=',

	CREDIT_CARD_INVALID_MESSAGE = 'Your credit card failed our authentication process. Please check your credit card ' +
		'information and try again.';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
var _submitButton = document.getElementById(SUBMIT_BUTTON);

// ----------------- PRIVATE METHODS ---------------------------

/**
 * Function responsible for connecting to the server and saving the order
 *
 * @param {Object} data - the data to submit to the back-end
 *
 * @author kinsho
 */
function _submitOrder(data)
{
	axios.toggleLoadingVeil();

	// Save the data
	axios.post(SAVE_ORDER_URL, data, true).then(() =>
	{
		// If successful, let's take the user to the order confirmation page to conclude this approval
		// process
		window.location.href = ORDER_CONFIRMATION_URL;
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
	var data,
		orderID;

	if (vm.isFormSubmissible)
	{
		// Hide any service-related error that may have popped up before
		notifier.hideErrorBar();

		// Show that loading veil before we reach out to Stripe to pre-verify the credit card
		axios.toggleLoadingVeil();

		// Figure out the order ID
		orderID = window.location.href.slice(window.location.href.indexOf(ID_URL_PARAM) + 3);
		orderID = window.parseInt(orderID, 10);

		// Organize the data that will need to be sent over the wire
		data =
		{
			_id: orderID,
			customer:
			{
				name: vm.customerName,
				address: vm.customerAddress,
				areaCode: vm.areaCode,
				phoneOne: vm.phoneOne,
				phoneTwo: vm.phoneTwo,
				email: vm.customerEmail,
				aptSuiteNumber: vm.customerAptSuiteNumber,
				city: vm.customerCity,
				state: vm.customerState,
				zipCode: vm.customerZipCode,
			}
		};

		// For credit card payments, process the information through Stripe first prior to submitting the order
		// to our back-end
		if (vm.paymentMethod === CREDIT_CARD_PAYMENT_METHOD)
		{
			window.Stripe.card.createToken(
			{
				number: vm.ccNumber,
				exp_month: vm.ccExpMonth,
				exp_year: vm.ccExpYear,
				cvc: vm.ccSecurityCode
			}, (status, token) =>
			{
				if (status === 200)
				{
					// Append the token to the data to be sent over the wire
					data.ccToken = token.id;

					_submitOrder(data);
				}
				else
				{
					axios.toggleLoadingVeil();
					notifier.showSpecializedServerError(CREDIT_CARD_INVALID_MESSAGE);
				}
			});
		}
		// For check jobs, just submit the order
		else
		{
			_submitOrder(data);
		}
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

// Only allow this listener to be added should such a button exist in the first place
if (_submitButton)
{
	_submitButton.addEventListener('click', submit);
}

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

// Only allow view model logic here should this section be shown to the user
if (_submitButton)
{
	vm.isFormSubmissible = false;
}