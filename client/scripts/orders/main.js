// ----------------- EXTERNAL MODULES --------------------------

import orderFilter from 'client/scripts/orders/orderFilter';
import orderListing from 'client/scripts/orders/orderListing';
import vm from 'client/scripts/orders/viewModel';

import handlebarHelpers from 'client/scripts/utility/handlebarHelpers';

// ----------------- ENUMS/CONSTANTS ---------------------------

const LOCAL_STORAGE_ORDERS_KEY = 'mrAdminOrders',

	REFRESH_ORDERS_LINK = 'refreshOrdersLink',
	STALE_DATA_LINK = 'staleDataNotifier',

	NOTES_TEMPLATE = 'notesTemplate',
	NEW_NOTE_TEMPLATE = 'newNoteTemplate',
	NOTE_RECORD_TEMPLATE = 'noteRecordTemplate',
	FILE_UPLOAD_TEMPLATE = 'uploadTemplate',
	UPLOAD_FORM_TEMPLATE = 'uploadSectionTemplate',
	FILE_THUMBNAIL_TEMPLATE = 'thumbnailTemplate',

	REVEAL_CLASS = 'reveal';

// ----------------- PRIVATE VARIABLE ---------------------------

let _staleDataLink = document.getElementById(STALE_DATA_LINK);

// ----------------- HANDLEBAR TEMPLATES ---------------------------

/**
 * The partial to render the HTML that renders out all the notes associated with any given order
 */
Handlebars.registerPartial('notes', document.getElementById(NOTES_TEMPLATE).innerHTML);

/**
 * The partial to render individual notes
 */
Handlebars.registerPartial('noteRecord', document.getElementById(NOTE_RECORD_TEMPLATE).innerHTML);

/**
 * The partial to write new notes
 */
Handlebars.registerPartial('newNote', document.getElementById(NEW_NOTE_TEMPLATE).innerHTML);

/**
 * The partial to render the HTML that allows users to upload files for any order
 */
Handlebars.registerPartial('fileUpload', document.getElementById(FILE_UPLOAD_TEMPLATE).innerHTML);

/**
 * The partial to render the form that's directly responsible for uploading new files
 */
Handlebars.registerPartial('uploadSection', document.getElementById(UPLOAD_FORM_TEMPLATE).innerHTML);

/**
 * The partial to display a thumbnail for each uploaded file
 */
Handlebars.registerPartial('thumbnail', document.getElementById(FILE_THUMBNAIL_TEMPLATE).innerHTML);

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the flag that will trigger logic to check the server for new data
 *
 * @author kinsho
 */
function triggerPing()
{
	vm.pingTheServer = true;
}

/**
 * Listener responsible for wiping the cache and reloading all orders
 *
 * @author kinsho
 */
function refreshOrderCache()
{
	window.localStorage.clear();

	window.location.reload(false);
}

/**
 * Listener responsible for forcing the reload of all orders currently shown on screen
 *
 * @author kinsho
 */
function refreshOrders()
{
	// Hide the link that enabled the invocation of this function
	_staleDataLink.classList.remove(REVEAL_CLASS);

	vm.forceRefresh = true;
}

// ----------------- DATA INITIALIZATION -----------------------------

// Retrieve the orders either from the local browser cache or from the back-end

vm.orders = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY) || '[]');
vm.pingTheServer = true;

// ----------------- PAGE INITIALIZATION -----------------------------

// Set up the handler to allow the user to refresh the order cache at any point
document.getElementById(REFRESH_ORDERS_LINK).addEventListener('click', refreshOrderCache);

// Set up a handler to allow data to be updated on the fly
_staleDataLink.addEventListener('click', refreshOrders);

// Set up a regular timer to check the service for newly-updated data
window.setInterval(triggerPing, 60000);

// Scroll to the top when the page loads
window.scrollTo(0, 0);