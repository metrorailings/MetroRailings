// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orders/viewModel';
import orderUtility from 'client/scripts/orders/orderUtility';

import noteHandler from 'client/scripts/notes/notes';
import uploader from 'client/scripts/uploadFile/uploadFile';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';
import confirmationModal from 'client/scripts/utility/confirmationModal';

// ----------------- ENUMS/CONSTANTS ---------------------------

const LISTENER_INIT_EVENT = 'listenerInit',

	ORDER_BLOCK_PREFIX = 'order-',

	REMOVE_ORDER_CLASS = 'trashLink',
	NOTE_LISTING = 'noteListing',
	FILE_LISTING = 'filesListing',

	HIDE_CLASS = 'hide',

	DELETE_ORDER_MESSAGE = '<span> Are you sure you want to <b> DELETE </b> this potential order? Once you delete' +
		' this order, you will need to go to the database administrator to restore this prospect back into the' +
		' system. </span>',

	DELETE_ORDER_URL = 'orders/removeOrder';

// ----------------- PRIVATE VARIABLES ---------------------------

let _noteListings = document.getElementsByClassName(NOTE_LISTING),
	_fileListings = document.getElementsByClassName(FILE_LISTING);

// ----------------- PRIVATE FUNCTIONS ---------------------------

/**
 * Function meant to dynamically attach listeners to all 'Remove from System' links
 * Needed so that we can reattach listeners every time orders are re-rendered onto screen
 *
 * @author kinsho
 */
function _attachOrderRemovalListeners()
{
	let removeLinks = document.getElementsByClassName(REMOVE_ORDER_CLASS);

	for (let i = removeLinks.length - 1; i >= 0; i--)
	{
		removeLinks[i].addEventListener('click', removeOrder);
	}
}

/**
 * Function meant to initialize sections where users can upload files to orders
 *
 * @author kinsho
 */
function _initializeUploadFileSections()
{
	// Ensure it's possible to upload files before running any uploading logic
	if (_fileListings)
	{
		// Initialize all uploading sections
		for (let j = _fileListings.length - 1; j >= 0; j -= 1)
		{
			new uploader(_fileListings[j]);
		}
	}
}

/**
 * Function meant to initialize sections where users can write notes under orders
 *
 * @author kinsho
 */
function _initializeNoteSections()
{
	// Ensure notes are submittable prior to running any note-specific logic
	if (_noteListings)
	{
		// Initializes all note areas
		for (let i = _noteListings.length - 1; i >= 0; i -= 1)
		{
			new noteHandler(_noteListings[i]);
		}
	}
}

// ----------------- LISTENERS ---------------------------

/**
 * Listener meant to remove a prospect or pending order from the system
 *
 * @param {Event} event - the event associated with the firing of this listener
 *
 * @author kinsho
 */
function removeOrder(event)
{
	let targetElement = event.currentTarget,
		orderID = window.parseInt(targetElement.dataset.id, 10),
		orderIndex = orderUtility.findOrderIndexById(vm.orders, orderID),
		orderBlock = document.getElementById(ORDER_BLOCK_PREFIX + orderID);

	// Confirm that we will be updating the status
	confirmationModal.open([DELETE_ORDER_MESSAGE], () =>
	{
		// Remove the order in the back-end so that it will no longer appear in the front-facing admin system
		axios.post(DELETE_ORDER_URL, { orderID: orderID }).then(() =>
		{
			// Remove the order from the cached collection of orders
			vm.orders.splice(orderIndex, 1);

			// Hide the block associated with this order from view
			orderBlock.classList.add(HIDE_CLASS);

		}, () =>
		{
			notifier.showGenericServerError();
		});

	}, () => {});
}

// ----------------- LISTENER INITIALIZATION -----------------------------

document.addEventListener(LISTENER_INIT_EVENT, () =>
{
	_attachOrderRemovalListeners();
	_initializeUploadFileSections();
	_initializeNoteSections();
});