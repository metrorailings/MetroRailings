// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/payInvoice/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var PHONE_NUMBER_TEXTFIELD = 'customerPhone',
	NAME_TEXTFIELD = 'customerName',
	EMAIL_TEXTFIELD = 'customerEmail';

// ----------------- PRIVATE VARIABLES ---------------------------

var _phoneField = document.getElementById(PHONE_NUMBER_TEXTFIELD),
	_nameField = document.getElementById(NAME_TEXTFIELD),
	_emailField = document.getElementById(EMAIL_TEXTFIELD);

// ----------------- PRIVATE FUNCTIONS ---------------------------

// ----------------- LISTENERS ---------------------------

/**
 * A listener to set the customer's name into the view model
 *
 * @author kinsho
 */
function setName()
{
	vm.customerName = _nameField.value;
}

/**
 * A listener to strip the dashes from the phone number when the user goes to modify the number
 *
 * @author kinsho
 */
function deformatPhoneNumber()
{
	_phoneField.value = _phoneField.value.split('-').join('');
}

/**
 * A listener designed to limit the number of characters that can be typed into the phone textfield. Also, dashes
 * will be added into the number as necessary
 *
 * @param {Event} event - the event associated with the listener
 *
 * @author kinsho
 */
function watchOverPhoneNumber(event)
{
	var value = _phoneField.value;

	if (event.charCode)
	{
		// Check if the user has gone past the prescribed length
		if (value.length >= 10)
		{
			event.preventDefault();
		}

		// Check if the user is typing in something else besides numbers
		if (event.charCode < 48 || event.charCode > 57)
		{
			event.preventDefault();
		}
	}
}

/**
 * A listener to set the customer's phone number into the view model and format the look of the phone number
 * on the screen
 *
 * @author kinsho
 */
function setAndFormatPhoneNumber()
{
	var value = _phoneField.value;

	vm.customerPhone = value;

	// Format the value in the input field to look more like a traditional phone number
	if (value.length >= 3)
	{
		value = value.substring(0, 3) + '-' + value.substring(3);
	}

	if (value.length >= 7)
	{
		value = value.substring(0, 7) + '-' + value.substring(7);
	}

	_phoneField.value = value;
}

/**
 * A listener to set the customer's email address into the view model
 *
 * @author kinsho
 */
function setEmail()
{
	vm.customerEmail = _emailField.value;
}

// ----------------- DATA INITIALIZATION -----------------------------

// ----------------- LISTENER INITIALIZATION -----------------------------

// Attach specialized event listeners to the phone number input
_phoneField.addEventListener('keypress', watchOverPhoneNumber);
_phoneField.addEventListener('focus', deformatPhoneNumber);
_phoneField.addEventListener('blur', setAndFormatPhoneNumber);

// Attach event listeners to the email and name inputs
_emailField.addEventListener('blur', setEmail);
_nameField.addEventListener('keyup', setName);

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

vm.customerPhone = '';
vm.customerEmail = '';
vm.customerName = '';