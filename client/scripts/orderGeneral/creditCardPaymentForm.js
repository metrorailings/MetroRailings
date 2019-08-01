// ----------------- EXTERNAL MODULES --------------------------

import paymentsVM from 'client/scripts/orderGeneral/paymentsViewModel';
import vm from 'client/scripts/orderGeneral/viewModel';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

import paymentRecord from 'client/scripts/orderGeneral/paymentRecord';

// ----------------- ENUMS/CONSTANTS ---------------------------

const CC_PAYMENT_AMOUNT = 'newPaymentCCAmount',
	CC_MEMO = 'ccMemo',
	CC_EXISTING_CARDS = 'existingCC',
	CC_NEW_CARD_FORM = 'newPaymentCCForm',
	CC_NEW_NUMBER = 'newCCNumber',
	CC_NEW_EXP_MONTH = 'ccExpDateMonth',
	CC_NEW_EXP_YEAR = 'ccExpDateYear',
	CC_NEW_CVC = 'newCVCNumber',
	CC_SUBMIT_BUTTON = 'ccSaveButton',

	PARENT_SECTION_LISTENER = 'parentSectionListener',

	GENERATE_TOKEN_URL = 'payment/generateCCToken',
	CC_PAYMENT_URL = 'payment/processCCPayment',
	SUCCESS_MESSAGE = 'Success! A new credit card payment has been made on this order in the amount of $',
	CREDIT_CARD_INVALID_MESSAGE = 'Something went wrong. It\'s possible that the credit card failed authentication' +
		' here.',

	NEW_KEYWORD = 'new',
	DISABLED_CLASS = 'disabled';

// ----------------- PRIVATE VARIABLES ---------------------------

let _ccPaymentAmount = document.getElementById(CC_PAYMENT_AMOUNT),
	_ccMemo = document.getElementById(CC_MEMO),
	_ccCards = document.getElementsByName(CC_EXISTING_CARDS),
	_newCCForm = document.getElementById(CC_NEW_CARD_FORM),
	_ccNumber = document.getElementById(CC_NEW_NUMBER),
	_ccExpMonth = document.getElementById(CC_NEW_EXP_MONTH),
	_ccExpYear = document.getElementById(CC_NEW_EXP_YEAR),
	_ccCVC = document.getElementById(CC_NEW_CVC),
	_ccSubmit = document.getElementById(CC_SUBMIT_BUTTON);

// ----------------- PRIVATE FUNCTIONS ---------------------------

/**
 * Function that clears out all the values that were written or selected in the credit card form
 *
 * @param {Object} data - the data to wire over to our back-end
 *
 * @author kinsho
 */
function _clearCCForm()
{
	_ccPaymentAmount.value = '';
	_ccMemo.value = '';
	_ccNumber.value = '';
	_ccExpMonth.value = '';
	_ccExpYear.value = '';
	_ccCVC.value = '';

	// Unselect all credit card radio buttons that have been checked off
	for (let i = 0; i < _ccCards.length; i += 1)
	{
		_ccCards.checked = false;
	}

	// Disable the form that allows us to enter new credit card details
	_newCCForm.classList.add(DISABLED_CLASS);
	_ccNumber.disabled = true;
	_ccExpMonth.disabled = true;
	_ccExpYear.disabled = true;
	_ccCVC.disabled = true;

	// Adjust the view model as well
	paymentsVM.ccAmount = '';
	paymentsVM.ccMemo = '';
	paymentsVM.token = '';
	paymentsVM.ccNumber = '';
	paymentsVM.ccExpMonth = '';
	paymentsVM.ccExpYear = '';
	paymentsVM.ccSecurityCode = '';
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
 * Function that sets a memo in the view model
 */
function setCCMemo()
{
	paymentsVM.ccMemo = _ccMemo.value;
}

/**
 * Function that starts to process a new credit card transaction
 *
 * @author kinsho
 */
async function submitCCPayment()
{
	let data =
		{
			orderId: vm._id,
			amount: paymentsVM.ccAmount,
			memo: paymentsVM.ccMemo || ''
		},
		tokenData, paymentData,
		balanceEvent;

	try
	{
		if (paymentsVM.isCCFormSubmissible)
		{
			// If an existing credit card will be used to make the payment, then just note the token that belongs to
			// that card and process the charge from there
			if (paymentsVM.token !== NEW_KEYWORD)
			{
				data.card = paymentsVM.token;
			}
			else
			{
				// Generate a credit card token
				tokenData = await axios.post(GENERATE_TOKEN_URL,
				{
					orderId: vm._id,
					number: paymentsVM.ccNumber,
					exp_month: paymentsVM.ccExpMonth,
					exp_year: paymentsVM.ccExpYear,
					cvc: paymentsVM.ccSecurityCode
				}, true);

				// Append that token to the data to be sent over the wire
				data.card = tokenData.data.id;
			}

			// Disable the submission button to prevent accidental resends
			_ccSubmit.disabled = true;

			paymentData = await axios.post(CC_PAYMENT_URL, data, true);

			// Show a message indicating the payment was successfully made
			notifier.showSuccessMessage(SUCCESS_MESSAGE + data.amount);
		
			// Update the payments chart to reflect the new payment
			paymentRecord.produceNewRecord(paymentData.data);
		
			// Blank out all the values in the credit card form
			_clearCCForm();

			// Update the balance remaining
			balanceEvent = new CustomEvent(PARENT_SECTION_LISTENER,
				{ detail: { amount : data.amount } });
			document.dispatchEvent(balanceEvent);

			_ccSubmit.disabled = false;
		}
	}
	catch(error)
	{
		console.log('Ran into an error trying to record a new payment...');
		console.error(error);

		// Generate a message indicating something went wrong
		notifier.showSpecializedServerError(CREDIT_CARD_INVALID_MESSAGE);

		_ccSubmit.disabled = false;
	}
}

// ----------------- INITIALIZATION LOGIC ---------------------------

if (_ccPaymentAmount)
{
	_ccPaymentAmount.addEventListener('change', setCCAmount);

	for (let j = 0; j < _ccCards.length; j += 1)
	{
		_ccCards[j].addEventListener('click', setToken);
	}

	_ccMemo.addEventListener('change', setCCMemo);
	_ccNumber.addEventListener('change', setCCNumber);
	_ccExpMonth.addEventListener('change', setCCExpMonth);
	_ccExpYear.addEventListener('change', setCCExpYear);
	_ccCVC.addEventListener('change', setCVC);
	_ccSubmit.addEventListener('click', submitCCPayment);

	paymentsVM.isCCFormSubmissible = false;	
}