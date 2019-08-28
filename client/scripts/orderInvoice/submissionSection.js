// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderInvoice/viewModel';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';
import rQuery from 'client/scripts/utility/rQueryClient';

// ----------------- ENUMS/CONSTANTS ---------------------------

const SUBMIT_BUTTON = 'orderSubmissionButton',
	ORDER_ID = 'orderIdHidden',
	DEPOSIT_AMOUNT_LISTING = 'depositAmountListing',

	GENERATE_TOKEN_URL = 'payment/generateCCToken',
	CREDIT_CARD_PAYMENT_URL = 'payment/processCCPaymentFromCustomer',
	SAVE_CUSTOMER_INFO_CHANGES = 'orderInvoice/saveChangesToOrder',
	FINALIZE_ORDER_URL = 'orderInvoice/updateStatus',
	SEND_OUT_EMAILS_URL = 'orderInvoice/sendConfirmationEmails',
	ORDER_CONFIRMATION_URL = 'orderConfirmation?id=',

	ERROR_MESSAGES =
	{
		CREDIT_CARD_INVALID_MESSAGE: 'Your credit card failed our authentication process. Please check your credit' +
			' card information and try again.',
		SERVER_ISSUES: 'Something went wrong behind the scenes with our payment processor. Please try again later or' +
			' reach out to us via phone.',
		ALMOST_SUCCESSFUL: 'Your credit card payment seems to have gone through, but we\'re having issues with our' +
			' own internal systems. Please reach out to us to ensure that the order has been fully finalized.',
		ISSUES_SENDING_EMAILS: 'The system ran into issues sending out confirmation updates to the admins. Please' +
			' call the admins to ensure your order has been acknowledged as confirmed.'
	};

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
let _submitButton = document.getElementById(SUBMIT_BUTTON),

	_depositAmount = document.getElementById(DEPOSIT_AMOUNT_LISTING) ?
		window.parseFloat(document.getElementById(DEPOSIT_AMOUNT_LISTING).dataset.depositAmount) : 0,
	_orderId = document.getElementById(ORDER_ID) ? window.parseInt(document.getElementById(ORDER_ID).value, 10) : 0;

// ----------------- LISTENERS ---------------------------

/**
 * Function responsible for submitting the form
 *
 * @author kinsho
 */
async function submit()
{
	let customerData, tokenData;

	if (vm.isFormSubmissible)
	{
		// Hide any service-related error that may have popped up before
		notifier.hideErrorBar();

		// Disable the submission button to prevent accidental resends
		_submitButton.disabled = true;

		// Organize the data that will need to be sent over the wire
		customerData =
		{
			_id: _orderId,

			customer:
			{
				name: vm.name,
				company: vm.company || '',
				email: vm.email || '',
				areaCode: vm.areaCode,
				phoneOne: vm.phoneOne,
				phoneTwo: vm.phoneTwo,
				address: vm.address,
				aptSuiteNo: vm.aptSuiteNumber,
				city: vm.city,
				state: vm.state,
				zipCode: vm.zipCode || ''
			}
		};

		try
		{
			// Save any changes that may have been made to the customer's personal information prior to charging them
			await axios.post(SAVE_CUSTOMER_INFO_CHANGES, customerData);
		}
		catch(error)
		{
			notifier.showSpecializedServerError(ERROR_MESSAGES.SERVER_ISSUES);

			// Reactivate the submission button for retries
			_submitButton.disabled = true;
			return;
		}

		try
		{
			// Generate a credit card token
			tokenData = await axios.post(GENERATE_TOKEN_URL,
			{
				orderId: _orderId,
				number: vm.ccNumber,
				exp_month: vm.ccExpMonth,
				exp_year: vm.ccExpYear,
				cvc: vm.ccSecurityCode
			}, true);
		}
		catch(error)
		{
			notifier.showSpecializedServerError(ERROR_MESSAGES.CREDIT_CARD_INVALID_MESSAGE);

			// Reactivate the submission button for retries
			_submitButton.disabled = true;
			return;
		}

		try
		{
			// Now let's make that payment
			await axios.post(CREDIT_CARD_PAYMENT_URL,
			{
				orderId: _orderId,
				card: tokenData.data.id,
				amount: _depositAmount
			}, true);
		}
		catch(error)
		{
			notifier.showSpecializedServerError(ERROR_MESSAGES.SERVER_ISSUES);
			
			// Reactivate the submission button for retries
			_submitButton.disabled = true;
			return;
		}

		// Next, update the status on the order to indicate that it is now an open order ready for production
		try
		{
			await axios.post(FINALIZE_ORDER_URL, { orderId: _orderId }, true);
		}
		catch(error)
		{
			notifier.showSpecializedServerError(ERROR_MESSAGES.ALMOST_SUCCESSFUL);

			return;
		}

		// Lastly, send out e-mails to notify the customer and the admins that the order has been confirmed
		try
		{
			await axios.post(SEND_OUT_EMAILS_URL, { orderId: _orderId }, true);
		}
		catch(error)
		{
			notifier.showSpecializedServerError();
		}

		window.location.href = ORDER_CONFIRMATION_URL + rQuery.obfuscateNumbers(_orderId);
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