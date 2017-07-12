// ----------------- EXTERNAL MODULES --------------------------

import orderFilter from 'client/scripts/orders/orderFilter';
import orderListing from 'client/scripts/orders/orderListing';
import vm from 'client/scripts/orders/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var ORDER_CREATION_BUTTON = 'orderCreationButton',
	PAPER_ORDER_BUTTON = 'printPaperOrder',

	CREATE_INVOICE_URL = '/createInvoice',
	PAPER_ORDER_URL = '/paperOrder';

// ----------------- PRIVATE VARIABLES ---------------------------

var _customOrderButton = document.getElementById(ORDER_CREATION_BUTTON),
	_paperOrderButton = document.getElementById(PAPER_ORDER_BUTTON);

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
 * Listener responsible for taking us to the custom order page
 *
 * @author kinsho
 */
function createNewCustomOrder()
{
	window.location.href = CREATE_INVOICE_URL;
}

/**
 * Listener responsible for taking us to the paper order page
 *
 * @author kinsho
 */
function navigateToPaperOrder()
{
	window.location.href = PAPER_ORDER_URL;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_customOrderButton.addEventListener('click', createNewCustomOrder);
_paperOrderButton.addEventListener('click', navigateToPaperOrder);

// ----------------- DATA INITIALIZATION -----------------------------

// Retrieve the orders either from the local browser cache or from the back-end

// @TODO: Set up caching of orders
// vm.orders = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY) || '[]');
vm.orders = [];
vm.pingTheServer = true;

// ----------------- PAGE INITIALIZATION -----------------------------

// Set up a regular timer to check the service for newly-updated data
window.setInterval(triggerPing, 45000);

// Scroll to the top when the page loads
window.scrollTo(0, 0);