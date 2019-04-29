// ----------------- EXTERNAL MODULES --------------------------

import paymentsVM from 'client/scripts/orderGeneral/paymentsViewModel';
import vm from 'client/scripts/orderGeneral/viewModel';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

// ----------------- ENUMS/CONSTANTS ---------------------------

const CC_PAYMENT_AMOUNT = 'newPaymentCCAmount',
	CC_EXISTING_CARDS = 'existingCC',
	CC_NEW_CARD_FORM = 'newPaymentCCForm',
	CC_NEW_NUMBER = 'newCCNumber',
	CC_NEW_EXP_MONTH = 'ccExpDateMonth',
	CC_NEW_EXP_YEAR = 'ccExpDateYear',
	CC_NEW_CVC = 'newCVCNumber',
	CC_SUBMIT_BUTTON = 'ccSaveButton',

	GENERATE_TOKEN_URL = 'payment/generateCCToken',
	CC_PAYMENT_URL = 'payment/processCCPayment',
	SUCCESS_MESSAGE = 'Success! A new payment has been made on this order in the amount of $',
	CREDIT_CARD_INVALID_MESSAGE = 'The credit card failed authentication.',

	NEW_KEYWORD = 'new',
	DISABLED_CLASS = 'disabled';

// ----------------- PRIVATE VARIABLES ---------------------------

let _ccPaymentAmount = document.getElementById(CC_PAYMENT_AMOUNT),
	_ccTokens = document.getElementsByName(CC_EXISTING_CARDS),
	_newCCForm = document.getElementById(CC_NEW_CARD_FORM),
	_ccNumber = document.getElementById(CC_NEW_NUMBER),
	_ccExpMonth = document.getElementById(CC_NEW_EXP_MONTH),
	_ccExpYear = document.getElementById(CC_NEW_EXP_YEAR),
	_ccCVC = document.getElementById(CC_NEW_CVC),
	_ccSubmit = document.getElementById(CC_SUBMIT_BUTTON);

// ----------------- PRIVATE FUNCTIONS ---------------------------

/**
 * Function that properly submits the credit card payment form once a token has been set
 *
 * @param {Object} data - the data to wire over to our back-end
 *
 * @author kinsho
 */
function _submitCCForm(data)
{
	_ccSubmit.disabled = true;

	axios.post(CC_PAYMENT_URL, data, true).then(() =>
	{
		// Show a message indicating the payment was successfully made
		notifier.showSuccessMessage(SUCCESS_MESSAGE + data.amount);

		// @TODO Update the payment chart to show the new payment now that it has been successfully made
		// @TODO Re-render the credit card list should a new credit card number have been used to make the payment

		_ccSubmit.disabled = false;
	}, () =>
	{
		notifier.showGenericServerError();

		_ccSubmit.disabled = false;
	});
}

// ----------------- LISTENERS ---------------------------

/**
 * Function to set the credit card amount into the payment view model
 *
 * @author kinsho
 */
function setCCAmount()
{
	paymentsVM.ccAmount = _ccPaymentAmount.value;
}

/**
 * Function that dictates whether an existing credit card will be used to make a new payment or whether a new credit
 * card will be used instead
 *
 * @param {Event} event - the event responsible for invoking this function
 *
 * @author kinsho
 */
function setToken(event)
{
	let value = event.currentTarget.value;

	paymentsVM.token = value;

	// If a new credit card is to be provided, enable all the fields needed to input new credit card data
	if (value === NEW_KEYWORD)
	{
		_newCCForm.classList.remove(DISABLED_CLASS);

		_ccNumber.disabled = false;
		_ccExpMonth.disabled = false;
		_ccExpYear.disabled = false;
		_ccCVC.disabled = false;
	}
	else
	{
		_newCCForm.classList.add(DISABLED_CLASS);

		_ccNumber.disabled = true;
		_ccExpMonth.disabled = true;
		_ccExpYear.disabled = true;
		_ccCVC.disabled = true;
	}
}

/**
 * Function that sets a new credit card number into the view model
 *
 * @author kinsho
 */
function setCCNumber()
{
	paymentsVM.ccNumber = _ccNumber.value;
}

/**
 * Function that sets a new credit card expiration month into the view model
 *
 * @author kinsho
 */
function setCCExpMonth()
{
	paymentsVM.ccExpMonth = _ccExpMonth.value;
}

/**
 * Function that sets a new credit card expiration year into the view model
 *
 * @author kinsho
 */
function setCCExpYear()
{
	paymentsVM.ccExpYear = _ccExpYear.value;
}

/**
 * Function that sets a new credit card verification code into the view model
 *
 * @author kinsho
 */
function setCVC()
{
	paymentsVM.ccSecurityCode = _ccCVC.value;
}

/**
 * Function that starts to process a new credit card transaction
 *
 * @author kinsho
 */
function submitCCPayment()
{
	let data =
		{
			orderId: vm._id,
			amount: paymentsVM.ccAmount
		};

	if (paymentsVM.isCCFormSubmissible)
	{
		if (paymentsVM.token !== NEW_KEYWORD)
		{
			data.token = paymentsVM.token;

			_submitCCForm(data);
		}
		else
		{
			// Generate a credit card token
			axios.post(GENERATE_TOKEN_URL,
				{
					number: paymentsVM.ccNumber,
					exp_month: paymentsVM.ccExpMonth,
					exp_year: paymentsVM.ccExpYear,
					cvc: paymentsVM.ccSecurityCode
				}, true).then((response) =>
			{
				// Append that token to the data to be sent over the wire
				data.token = response.data;

				_submitCCForm(data);
			}, () =>
			{
				notifier.showSpecializedServerError(CREDIT_CARD_INVALID_MESSAGE);
			});
		}
	}
}

// ----------------- INITIALIZATION LOGIC ---------------------------

_ccPaymentAmount.addEventListener('change', setCCAmount);

for (let j = 0; j < _ccTokens.length; j += 1)
{
	_ccTokens[j].addEventListener('click', setToken);
}

_ccNumber.addEventListener('change', setCCNumber);
_ccExpMonth.addEventListener('change', setCCExpMonth);
_ccExpYear.addEventListener('change', setCCExpYear);
_ccCVC.addEventListener('change', setCVC);
_ccSubmit.addEventListener('click', submitCCPayment);