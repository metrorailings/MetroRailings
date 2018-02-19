// ----------------- EXTERNAL MODULES --------------------------

import officeTasks from 'client/scripts/orders/officeTasks';
import orderFilter from 'client/scripts/orders/orderFilter';
import orderListing from 'client/scripts/orders/orderListing';
import vm from 'client/scripts/orders/viewModel';

import translate from 'client/scripts/utility/translate';

// ----------------- ENUMS/CONSTANTS ---------------------------

var ORDER_CREATION_BUTTON = 'orderCreationButton',
	PROSPECT_CREATION_BUTTON = 'prospectCreationButton',

	CREATE_INVOICE_URL = '/createInvoice',
	PROSPECT_CREATION_URL = '/createProspect';

// ----------------- PRIVATE VARIABLES ---------------------------

var _customOrderButton = document.getElementById(ORDER_CREATION_BUTTON),
	_prospectCreationButton = document.getElementById(PROSPECT_CREATION_BUTTON);

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
function navigateToProspectCreation()
{
	window.location.href = PROSPECT_CREATION_URL;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_customOrderButton.addEventListener('click', createNewCustomOrder);
_prospectCreationButton.addEventListener('click', navigateToProspectCreation);

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