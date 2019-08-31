// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderGeneral/viewModel';

import confirmationModal from 'client/scripts/utility/confirmationModal';
import axios from '../utility/axios';
import notifier from '../utility/notifications';

// ----------------- ENUMS/CONSTANTS ---------------------------

const STATUS_FIELD = 'statusHiddenField',
	STATUS_RADIO_BUTTONS = 'statusRadio',
	FINALIZE_ORDER_BUTTON = 'makeOrderLiveButton',

	FINALIZE_ORDER_URL = 'orderGeneral/openOrder',
	SEND_OUT_EMAILS_URL = 'orderGeneral/sendConfirmationEmails',

	CONFIRM_LIVE_ORDER = 'Are you sure you want to send this order into production? Once this is done, you cannot' +
		' undo this. Furthermore, the client will no longer be able to pay for the order directly.',

	ERROR_MESSAGES =
	{
		FINALIZATION_ERROR: 'Something went wrong finalizing this order. Try again or contact Rickin.'
	};

// ----------------- PRIVATE VARIABLES ---------------------------

let _statusField = document.getElementById(STATUS_FIELD),
	_statusRadios = document.getElementsByClassName(STATUS_RADIO_BUTTONS),
	_liveButton = document.getElementById(FINALIZE_ORDER_BUTTON);

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

/**
 * Listener responsible for sending an order into production
 *
 * @author kinsho
 */
function finalizeOrder()
{
	confirmationModal.open([CONFIRM_LIVE_ORDER], async () =>
	{
		// Make the service calls necessary to finalize the order
		try
		{
			await axios.post(FINALIZE_ORDER_URL, { orderId: vm._id }, true);
			await axios.post(SEND_OUT_EMAILS_URL, { orderId: vm._id }, true);

			window.location.reload(true);
		}
		catch(error)
		{
			notifier.showSpecializedServerError(ERROR_MESSAGES.FINALIZATION_ERROR);

			return;
		}
	}, () => {});
}

// ----------------- LISTENER INITIALIZATION -----------------------------

// Set the status currently selected into the view model
for (let i = 0; i < _statusRadios.length; i += 1)
{
	_statusRadios[i].addEventListener('change', setStatus);
}

// ----------------- DATA INITIALIZATION -----------------------------

// Only set the status of the order into the view model should one exist
if (_statusField)
{
	vm.status = _statusField.value;
}

// If the button to send an order into production is present, set a listener on it
if (_liveButton)
{
	_liveButton.addEventListener('click', finalizeOrder);
}