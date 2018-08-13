// ----------------- EXTERNAL MODULES --------------------------

import orderFilter from 'client/scripts/orders/orderFilter';
import orderListing from 'client/scripts/orders/orderListing';
import vm from 'client/scripts/orders/viewModel';

import translate from 'client/scripts/utility/translate';

// ----------------- ENUMS/CONSTANTS ---------------------------

// ----------------- PRIVATE VARIABLES ---------------------------

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

/**
 * Set up a listener to check for when the hash changes
 */
window.addEventListener('hashchange', function()
{
	var hash = window.location.href.split('#')[1];

	// If the hash currently set in the URL does not reflect the actual status filter in effect, then change the
	// status filter to reflect the value in the hash
	if (vm.statusFilter !== hash)
	{
		vm.statusFilter = hash || '';
	}
});

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