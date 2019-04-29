// ----------------- EXTERNAL MODULES --------------------------

import ccForm from 'client/scripts/orderGeneral/creditCardPaymentForm';
import checkForm from 'client/scripts/orderGeneral/checkPaymentForm';
import cashForm from 'client/scripts/orderGeneral/cashPaymentForm';

// ----------------- ENUMS/CONSTANTS ---------------------------

const PAYMENT_OPTION_HEADER = 'paymentOptionHeader',
	PAYMENT_FORM = 'paymentForm',

	HIDE_CLASS = 'hide',
	SELECTED_CLASS = 'selected';

// ----------------- PRIVATE VARIABLES ---------------------------

let _paymentOptionHeaders = document.getElementsByClassName(PAYMENT_OPTION_HEADER),
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

// ----------------- INITIALIZATION LOGIC ---------------------------

for (let i = 0; i < _paymentOptionHeaders.length; i += 1)
{
	_paymentOptionHeaders[i].addEventListener('click', switchPaymentForms);
}