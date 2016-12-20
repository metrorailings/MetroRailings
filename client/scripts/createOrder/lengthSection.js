// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createOrder/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var RAILINGS_LENGTH_TEXTFIELD = 'railingsLength';

// ----------------- PRIVATE VARIABLES ---------------------------

var _lengthField = document.getElementById(RAILINGS_LENGTH_TEXTFIELD); // The length textfield

// ----------------- PRIVATE FUNCTIONS ---------------------------

// ----------------- LISTENERS ---------------------------

/**
 * A listener designed to limit the number of characters that can be types into the length textfield
 *
 * @param {Event} event - the event associated with the listener
 *
 * @author kinsho
 */
function restrictLength(event)
{
	if (event.charCode)
	{
		// Do not allow the user to type in more than three numbers here
		if (_lengthField.value.length >= 3)
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
 * A listener to set the length into the view model
 *
 * @author kinsho
 */
function setLength()
{
	vm.orderLength = _lengthField.value;
}

// ----------------- DATA INITIALIZATION -----------------------------

// ----------------- LISTENER INITIALIZATION -----------------------------

// Attach event listeners to the length input
_lengthField.addEventListener('keydown', restrictLength);
_lengthField.addEventListener('input', setLength);

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

vm.orderLength = '';