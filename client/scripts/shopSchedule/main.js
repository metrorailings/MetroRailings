// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/shopSchedule/viewModel';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';
import actionModal from 'client/scripts/utility/actionModal';

import statuses from 'shared/orderStatus';

import statusModal from 'client/scripts/shopSchedule/statusModal';
import uploader from 'client/scripts/uploadFile/uploadFile';

// ----------------- ENUMS/CONSTANTS ---------------------------

const STATUS_LINKS = 'statusLink',
	FILE_LISTING = 'filesListing',
	STATUS_MODAL_TEMPLATE ='statusModalTemplate',
	STALE_DATA_FOUND = 'staleDataNotifier',

	STATUS_CHANGE_SUCCESSFUL = 'El cambio de estado ha sido exitoso.',
	STATUS_CHANGE_FAILED = 'El cambio de estado no fue efectuado. Por favor contacte a Rick.',
	STATUS_CHANGE_URL = 'shopSchedule/updateProductionStatus';

// ----------------- PRIVATE VARIABLES ---------------------------

let _statusLinks = document.getElementsByClassName(STATUS_LINKS),
	_fileListings = document.getElementsByClassName(FILE_LISTING),
	_staleDataLink = document.getElementById(STALE_DATA_FOUND);

// ----------------- PRIVATE FUNCTIONS ---------------------------

/**
 * Function that reaches out to the back-end to update the status on a particular order
 *
 * @param {HTMLElement} statusLink - the link element that will need to be updated after the status is successfully
*  		changed
*  @param {String} status - the new status to post on the order
 * 
 * @author kinsho
 */
function _changeStatus(statusLink, status)
{
	let data =
	{
		id : statusLink.dataset.orderId,
		status: status
	};

	axios.post(STATUS_CHANGE_URL, data, true).then(() =>
	{
		// Update the order status on the view to reflect the newly updated status
		statusLink.innerHTML = statuses.getSpanishTranslation(status);
		statusLink.dataset.status = status;

		// Show a notification indicating the due date was successfully changed
		notifier.showSuccessMessage(STATUS_CHANGE_SUCCESSFUL);
		window.setTimeout(notifier.hideSuccessBar, 5000);
	}, () =>
	{
		notifier.showSpecializedServerError(STATUS_CHANGE_FAILED);
	});
}

// ----------------- LISTENERS ---------------------------

/**
 * Listener function that sets a new due date for any open order inside our database
 *
 * @param {Event} event - the event responsible for triggering the invocation of this function
 *
 * @author kinsho
 */
function openStatusModal(event)
{
	let target = event.currentTarget,
		oldStatus = target.dataset.status; // Remember to pull the English reading of the status from the element's dataset

	// Record the status currently in effect so we can properly determine whether to even bother making a server call
	vm.oldStatus = oldStatus;

	actionModal.open(document.getElementById(STATUS_MODAL_TEMPLATE).innerHTML, {}, () =>
	{
		// Only make that service call if we are indeed recording a change in order status
		if (vm.oldStatus !== vm.newStatus)
		{
			_changeStatus(target, vm.newStatus);
		}
	}, statusModal.initializeStatusModalListeners);
}

/**
 * Listener responsible for forcing the reload of all orders of the page
 *
 * @author kinsho
 */
function reloadPage()
{
	window.location.reload();
}

/**
 * Listener responsible for setting the flag that will trigger logic to check the server for new data
 *
 * @author kinsho
 */
function triggerPing()
{
	vm.pingTheServer = true;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

for (let i = _statusLinks.length - 1; i >= 0; i -= 1)
{
	_statusLinks[i].addEventListener('click', openStatusModal);
}

for (let j = _fileListings.length - 1; j >= 0; j -= 1)
{
	new uploader(_fileListings[j]);
}

// Set up a handler to allow data to be updated on the fly
_staleDataLink.addEventListener('click', reloadPage);

// Set up a regular timer to check the service for newly-updated data
window.setInterval(triggerPing, 60000);