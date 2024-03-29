// ----------------- EXTERNAL MODULES --------------------------

import ccForm from 'client/scripts/orderGeneral/creditCardPaymentForm';
import checkForm from 'client/scripts/orderGeneral/checkPaymentForm';
import cashForm from 'client/scripts/orderGeneral/cashPaymentForm';

import vm from 'client/scripts/orderGeneral/paymentsViewModel';
import orderVM from 'client/scripts/orderGeneral/viewModel';
import axios from '../utility/axios';
import notifier from '../utility/notifications';

// ----------------- ENUMS/CONSTANTS ---------------------------

const BALANCE_REMAINING = 'balanceRemaining',
	PAYMENT_OPTION_HEADER = 'paymentOptionHeader',
	PAYMENT_FORM = 'paymentForm',

	BALANCE_REMAINING_PREFIX = 'Balance Remaining: $',
	PARENT_SECTION_LISTENER = 'parentSectionListener',

	PENDING_STATUS = 'pending',

	HIDE_CLASS = 'hide',
	SELECTED_CLASS = 'selected',

	FINALIZE_ORDER_URL = 'orderGeneral/openOrder',
	SEND_OUT_EMAILS_URL = 'orderGeneral/sendConfirmationEmails',

	ERROR_MESSAGES =
	{
		FINALIZATION_ERROR: 'Something went wrong finalizing this order. Try again or contact Rickin.'
	};

// ----------------- PRIVATE VARIABLES ---------------------------

let _balanceRemaining = document.getElementById(BALANCE_REMAINING),
	_paymentOptionHeaders = document.getElementsByClassName(PAYMENT_OPTION_HEADER),
	_paymentForms = document.getElementsByClassName(PAYMENT_FORM);

// ----------------- LISTENERS ---------------------------

/**
 * Function responsible for switching out payment forms depending on how the customer is making a new payment
 *
 * @param {Event} event - the event responsible for triggering the invocation of this function
 *
 * @author kinsho
 */
function switchPaymentForms(event)
{
	let currentTarget = event.currentTarget;

	// Determine if the user is just clicking on the payment header that already corresponds to the payment form in view
	// If so, bail out of the function
	if (currentTarget.classList.contains(SELECTED_CLASS))
	{
		return;
	}

	// Cycle through all the payment forms and hide them from view
	for (let i = 0; i < _paymentForms.length; i += 1)
	{
		_paymentForms[i].classList.add(HIDE_CLASS);
	}

	// Now show the payment form that the user wants selected
	document.getElementById(currentTarget.dataset.payForm).classList.remove(HIDE_CLASS);

	// Update the look of the headers to denote which pay form is currently being shown
	for (let j = 0; j < _paymentOptionHeaders.length; j += 1)
	{
		_paymentOptionHeaders[j].classList.remove(SELECTED_CLASS);
	}
	currentTarget.classList.add(SELECTED_CLASS);
}

/**
 * Function responsible for updating the balance remaining on the order dynamically
 *
 * @param {Event} event - the event responsible for triggering the invocation of this function
 *
 * @author kinsho
 */
function updateBalanceRemaining(event)
{
	let newPaymentAmount = window.parseFloat(event.detail.amount),
		balanceRemaining = window.parseFloat(_balanceRemaining.dataset.balanceRemaining),
		newBalance = balanceRemaining - newPaymentAmount;

	_balanceRemaining.dataset.balanceRemaining = newBalance;
	_balanceRemaining.innerHTML = BALANCE_REMAINING_PREFIX + newBalance.toFixed(2);
}


/**
 * Function responsible for checking whether the order needs to be made live if the order is still noted as pending
 *
 * @param {Event} event - the event responsible for triggering the invocation of this function
 */
async function finalizeOrder()
{
	// Only finalize the order should the order still be in pending status and a payment has been recorded on this order
	if (orderVM.status === PENDING_STATUS)
	{
		// Make the service calls necessary to finalize the order
		try
		{
			await axios.post(FINALIZE_ORDER_URL, { orderId: orderVM._id }, true);
			await axios.post(SEND_OUT_EMAILS_URL, { orderId: orderVM._id }, true);

			window.location.reload(true);
		}
		catch(error)
		{
			notifier.showSpecializedServerError(ERROR_MESSAGES.FINALIZATION_ERROR);

			return;
		}
	}
}

// ----------------- INITIALIZATION LOGIC ---------------------------

// Ensure we're able to create payments prior to running logic that necessitates payment elements being present on
// the page
if (_paymentOptionHeaders.length)
{
	for (let i = 0; i < _paymentOptionHeaders.length; i += 1)
	{
		_paymentOptionHeaders[i].addEventListener('click', switchPaymentForms);
	}

	vm.balanceRemaining = window.parseFloat(_balanceRemaining.dataset.balanceRemaining);

	document.addEventListener(PARENT_SECTION_LISTENER, async (event) =>
	{
		await finalizeOrder(event);
		updateBalanceRemaining(event);
	});
}