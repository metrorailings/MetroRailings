// ----------------- EXTERNAL MODULES --------------------------

import orderFilter from 'client/scripts/orders/orderFilter';
import orderListing from 'client/scripts/orders/orderListing';
import vm from 'client/scripts/orders/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var LOCAL_STORAGE_ORDERS_KEY = 'metroRailings.orders';

// ----------------- PRIVATE VARIABLES ---------------------------

// ----------------- PRIVATE FUNCTIONS ---------------------------

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

// ----------------- LISTENER INITIALIZATION -----------------------------

// ----------------- DATA INITIALIZATION -----------------------------

// Retrieve the orders either from the local browser cache or from the back-end
vm.orders = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY) || '[]');
vm.pingTheServer = true;

// ----------------- PAGE INITIALIZATION -----------------------------

// Set up a regular timer to check the service for newly-updated data
window.setInterval(triggerPing, 20000);