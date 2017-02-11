// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orders/viewModel';
import orderUtility from 'client/scripts/orders/orderUtility';

import statuses from 'shared/orderStatus';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';
import confirmationModal from 'client/scripts/utility/confirmationModal';
import rQueryClient from 'client/scripts/utility/rQueryClient';

// ----------------- ENUMS/CONSTANTS ---------------------------

var UPDATE_STATUS_URL = 'orders/updateStatus',
	ORDER_DETAILS_URL = '/orderDetails?orderNumber=::orderID',

	LISTENER_INIT_EVENT = 'listenerInit',

	STATUS_LINK_CLASS = 'nextStatusLink',
	ORDER_DETAILS_BUTTON_CLASS = 'orderDetailsButton',

	NEXT_STATUS_MESSAGE = 'Are you sure you want to update order <b>::orderID</b> to <b>::nextStatus</b>?',

	ORDER_ID_PLACEHOLDER = '::orderID',
	NEXT_STATUS_PLACEHOLDER = '::nextStatus';

// ----------------- PRIVATE VARIABLES ---------------------------

/**
 * Function meant to dynamically attach listeners to all status upgrade links
 * Needed so that we can reattach listeners every time orders are re-rendered onto screen
 *
 * @author kinsho
 */
function _attachStatusLinkListeners()
{
	var statusLinks = document.getElementsByClassName(STATUS_LINK_CLASS),
		i;

	for (i = statusLinks.length - 1; i >= 0; i--)
	{
		statusLinks[i].addEventListener('click', updateStatus);
	}
}

/**
 * Function meant to dynamically attach listeners to all Edit buttons
 * Needed so that we can reattach listeners every time orders are re-rendered onto screen
 *
 * @author kinsho
 */
function _attachNavigationListeners()
{
	var editButtons = document.getElementsByClassName(ORDER_DETAILS_BUTTON_CLASS),
		i;

	for (i = editButtons.length - 1; i >= 0; i--)
	{
		editButtons[i].addEventListener('click', navigateToDetailsPage);
	}
}

// ----------------- PRIVATE FUNCTIONS ---------------------------

// ----------------- LISTENERS ---------------------------

/**
 * Listener meant to move an order along to the next phase of development
 *
 * @param {Event} event - the event associated with the firing of this listener
 *
 * @author kinsho
 */
function updateStatus(event)
{
	var targetElement = event.currentTarget,
		orderID = window.parseInt(targetElement.dataset.id, 10),
		orderIndex = orderUtility.findOrderIndexById(vm.orders, orderID),
		order = vm.orders[orderIndex],
		nextStatus = statuses.moveStatusToNextLevel(order.status),
		// Generate the message to place within the confirmation modal
		modalMessage = NEXT_STATUS_MESSAGE.replace(ORDER_ID_PLACEHOLDER, orderID)
			.replace(NEXT_STATUS_PLACEHOLDER, rQueryClient.capitalize(nextStatus));

	// Confirm that we will be updating the status
	confirmationModal.open([modalMessage], () =>
	{
		// Update the status in the back-end, then use the results from the service to modify the local copy of data as needed
		axios.post(UPDATE_STATUS_URL, { orderID: orderID }).then((results) =>
		{
			// Update the last known modification date for the order in context
			order.lastModifiedDate = results.data.lastModifiedDate;

			// Update the status to the next one in the development cycle
			order.status = results.data.status;

			// Move the newly modified order to the front of the pack to indicate that it was the order most recently modified
			vm.orders.splice(orderIndex, 1);
			vm.orders.unshift(order);
		}, () =>
		{
			notifier.showGenericServerError();
		});

	}, () => {});
}

/**
 * Listener meant to take the user to the order details page for a particular order
 *
 * @param {Event} event - the event associated with the firing of this listener
 *
 * @author kinsho
 */
function navigateToDetailsPage(event)
{
	var targetElement = event.currentTarget,
		orderID = targetElement.dataset.id,
		orderDetailsURL = ORDER_DETAILS_URL.replace(ORDER_ID_PLACEHOLDER, orderID);

	window.location.href = orderDetailsURL;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

document.addEventListener(LISTENER_INIT_EVENT, () =>
{
	_attachStatusLinkListeners();
	_attachNavigationListeners();
});