// ----------------- EXTERNAL MODULES --------------------------

import rQueryClient from 'client/scripts/utility/rQueryClient';

import statuses from 'shared/orderStatus';

import vm from 'client/scripts/checkOrder/viewModel';

// ----------------- ENUMS/CONSTANTS ----------------------

var ORDER_LISTING_CONTAINER = 'orderListing',
	ORDER_LISTING_TEMPLATE = 'orderListingTemplate',

	REVEAL_CLASS = 'reveal',

	ORDER_RENDER_EVENT = 'orderRender';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
var _orderListing = document.getElementById(ORDER_LISTING_CONTAINER);

// ----------------- PRIVATE FUNCTIONS ---------------------------

/**
 * Function responsible for rendering the orders on screen
 *
 * @author kinsho
 */
function _renderOrders()
{
	try
	{
		_orderListing.classList.remove(REVEAL_CLASS);

		// We use timed logic below in order to gracefully animate the new results to the user
		window.setTimeout(() =>
		{
			_orderListing.innerHTML = orderListingTemplate(
				{
					orders: vm.orders,
					areThereOrders: !!(vm.orders.length)
				});

			window.setTimeout(() =>
			{
				_orderListing.classList.add(REVEAL_CLASS);
			}, 400);
		}, 400);
	}
	catch(error)
	{
		console.log(error);
	}
}

// ----------------- HANDLEBAR HELPERS ---------------------------

/**
 * Helper designed to capitalize any string passed to it
 *
 * @author kinsho
 */
Handlebars.registerHelper('capitalize', function(str)
{
	str = str + '' || '';

	return rQueryClient.capitalize(str);
});

/**
 * Helper designed to fetch a description for any given status
 *
 * @author kinsho
 */
Handlebars.registerHelper('status_text', function(status)
{
	return statuses.getVerboseStatusDescription(status);
});

// ----------------- HANDLEBAR TEMPLATES ---------------------------

/**
 * The partial to render individual orders on the orders page
 */
var orderListingTemplate = Handlebars.compile(document.getElementById(ORDER_LISTING_TEMPLATE).innerHTML);

// ----------------- LISTENERS ---------------------------


// ----------------- LISTENER INITIALIZATION -----------------------------

// Set up a listener that we can use to publicly tell this module to render a new batch of orders
document.addEventListener(ORDER_RENDER_EVENT, _renderOrders);


// ----------------- DATA INITIALIZATION -----------------------------

// ----------------- PAGE INITIALIZATION -----------------------------