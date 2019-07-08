// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderGeneral/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

const STATUS_FIELD = 'statusHiddenField',
	STATUS_RADIO_BUTTONS = 'statusRadio';

// ----------------- PRIVATE VARIABLES ---------------------------

let _statusField = document.getElementById(STATUS_FIELD),
	_statusRadios = document.getElementsByClassName(STATUS_RADIO_BUTTONS);

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the status on the order
 *
 * @param {Event} event - the event object responsible for invoking this function
 *
 * @author kinsho
 */
function setStatus(event)
{
	let radioButton = event.currentTarget;

	if (radioButton.checked)
	{
		vm.status = radioButton.value;
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

// Set the status currently selected into the view model
for (let i = 0; i < _statusRadios.length; i += 1)
{
	_statusRadios[i].addEventListener('change', setStatus);
}

// ----------------- DATA INITIALIZATION -----------------------------

// Only set the ID of the order into the view model should one exist
if (_statusField)
{
	vm.status = _statusField.value;
}