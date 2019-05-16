// ----------------- EXTERNAL MODULES --------------------------

import orderFilter from 'client/scripts/orders/orderFilter';
import orderListing from 'client/scripts/orders/orderListing';
import vm from 'client/scripts/orders/viewModel';

import handlebarHelpers from 'client/scripts/utility/handlebarHelpers';
import translate from 'client/scripts/utility/translate';

// ----------------- ENUMS/CONSTANTS ---------------------------

// ----------------- PRIVATE VARIABLES ---------------------------

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the flag that will trigger logic to check the server for new data
 *
 * @author kinsho
 */
// function triggerPing()
// {
//	vm.pingTheServer = true;
// }

// ----------------- DATA INITIALIZATION -----------------------------

// Retrieve the orders either from the local browser cache or from the back-end

// @TODO: Set up caching of orders
// vm.orders = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY) || '[]');
// vm.pingTheServer = true;
vm.orders = window.MetroRailings.orders;

// ----------------- PAGE INITIALIZATION -----------------------------

// Set up a regular timer to check the service for newly-updated data
// @TODO - Get the ping service working to update orders in real-time
// window.setInterval(triggerPing, 45000);

// Scroll to the top when the page loads
window.scrollTo(0, 0);