// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderDetails/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var ORDER_NOTES_TEXT_AREA = 'orderNotes',
	STATUS_RADIO_BUTTONS = 'statusRadio';

// ----------------- PRIVATE VARIABLES ---------------------------

var _orderNotesFields = document.getElementById(ORDER_NOTES_TEXT_AREA);

// ----------------- PRIVATE FUNCTIONS ---------------------------

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the status in the view model
 *
 * @param {Event} event - the event associated with the firing of this event
 *
 * @author kinsho
 */
function setStatus(event)
{
	vm.status = event.currentTarget.value;
}

/**
 * Listener responsible for setting order notes into the view model
 *
 * @author kinsho
 */
function setNotes()
{
	vm.notes = _orderNotesFields.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

var statusRadioButtons = document.getElementsByClassName(STATUS_RADIO_BUTTONS),
	i;

// Set listeners on all the radio buttons related to order status
for (i = 0; i < statusRadioButtons.length; i++)
{
	statusRadioButtons[i].addEventListener('click', setStatus);
}

_orderNotesFields.addEventListener('change', setNotes);