/**
 * The view model for the orders page
 */

// ----------------- EXTERNAL MODULES --------------------------

import orderUtility from 'client/scripts/orders/orderUtility';

import axios from 'client/scripts/utility/axios';
import rQueryClient from 'client/scripts/utility/rQueryClient';
import notifier from 'client/scripts/utility/notifications';

import statuses from 'shared/orderStatus';

// ----------------- ENUM/CONSTANTS -----------------------------

var STATUS_FILTER_CLASS = 'statusFilter',
	SELECTED_CLASS = 'selected',
	REVEAL_CLASS = 'reveal',

	SEARCH_FILTER = 'searchFilterTextfield',
	RESET_SEARCH_ICON = 'resetSearch',
	ORDER_LISTINGS_CONTAINER = 'orderListing',
	ORDER_LISTING_TEMPLATE = 'orderListingTemplate',

	SEARCH_ORDERS_URL = 'orders/searchOrders',

	LISTENER_INIT_EVENT = 'listenerInit',

	DEFAULT_MODIFICATION_DATE = new Date('1/1/2014');

// ----------------- PRIVATE VARIABLES -----------------------------

// Elements
var _statusFilterLinks = document.getElementsByClassName(STATUS_FILTER_CLASS),
	_searchFilter = document.getElementById(SEARCH_FILTER),
	_resetSearchIcon = document.getElementById(RESET_SEARCH_ICON),
	_orderListing = document.getElementById(ORDER_LISTINGS_CONTAINER);

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
 * Helper designed to help us figure out the next state to which to move an order
 */
Handlebars.registerHelper('next_state', function(str)
{
	return rQueryClient.capitalize(statuses.moveStatusToNextLevel(str));
});

/**
 * Helper designed to determine whether an order can have its status updated to the next level
 */
Handlebars.registerHelper('can_status_be_updated', function(str, block)
{
	if (statuses.moveStatusToNextLevel(str))
	{
		return block.fn(this);
	}
});

// ----------------- HANDLEBAR TEMPLATES ---------------------------

/**
 * The partial to render individual orders on the orders page
 */
var orderListingTemplate = Handlebars.compile(document.getElementById(ORDER_LISTING_TEMPLATE).innerHTML);

// ----------------- PRIVATE FUNCTIONS -----------------------------

/**
 * Function responsible for rendering all orders that abide by the selected filters
 *
 * @params {boolean} renderWithDelay - a flag indicating whether to render the orders in an animated fashion
 *
 * @author kinsho
 */
function _renderOrders(renderWithDelay)
{
	var filteredOrders = viewModel.orders;

	// We need this escape logic only during initialization
	if ( !(filteredOrders) )
	{
		return false;
	}

	filteredOrders = orderUtility.filterOrdersByStatus(filteredOrders, viewModel.statusFilter);
	filteredOrders = orderUtility.filterOrdersBySearchText(filteredOrders, viewModel.searchFilter);

	if (renderWithDelay)
	{
		_displayListingsWithDelay(filteredOrders);
	}
	else
	{
		_displayListings(filteredOrders);
	}
}

/**
 * Function meant to render the passed list of orders into a viewable HTML format
 *
 * @param {Array<Object>} orders - the orders to put on the screen
 *
 * @author kinsho
 */
function _displayListings(orders)
{
	try
	{
		_orderListing.innerHTML = orderListingTemplate({ orders: orders });

		// Trigger the following custom event so that we can trigger logic to attach event listeners to the status links
		document.dispatchEvent(new Event(LISTENER_INIT_EVENT));
	}
	catch(error)
	{
		console.log(error);
	}
}

/**
 * Function meant to render the passed list of orders into a viewable HTML format.
 * The order listings will fade out of view for a second before fading back into view with the newly rendered
 * collection of orders
 *
 * @param {Array<Object>} orders - the orders to put on the screen
 *
 * @author kinsho
 */
function _displayListingsWithDelay(orders)
{
	try
	{
		_orderListing.classList.remove(REVEAL_CLASS);

		window.setTimeout(() =>
		{
			_orderListing.innerHTML = orderListingTemplate({ orders: orders });

			// Trigger the following custom event so that we can trigger logic to attach event listeners to the status links
			document.dispatchEvent(new Event(LISTENER_INIT_EVENT));

			window.setTimeout(() =>
			{
				_orderListing.classList.add(REVEAL_CLASS);
			}, 500);
		}, 500);
	}
	catch(error)
	{
		console.log(error);
	}
}

// ----------------- VIEW MODEL DEFINITION -----------------------------

var viewModel = {};

// Orders Collection
Object.defineProperty(viewModel, 'orders',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return this.__orders;
	},

	set: (value) =>
	{
		var prevValue = this.__orders;

		// If we are initializing this collection from a cached array, ensure each cached order is properly
		// wrapped in a view model object and then render any open orders on the screen
		if (!(prevValue) && value.length)
		{
			this.__orders = orderUtility.wrapOrdersInModels(value);
			_renderOrders(true);
		}
		else
		{
			this.__orders = value || [];
		}
	}
});

// Status Filter
Object.defineProperty(viewModel, 'statusFilter',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return this.__statusFilter;
	},

	set: (value) =>
	{
		this.__statusFilter = value;

		// Properly indicate to the user by which status are the orders being filtered
		for (var i = _statusFilterLinks.length - 1; i >= 0; i--)
		{
			if (_statusFilterLinks[i].dataset.value === value)
			{
				_statusFilterLinks[i].classList.add(SELECTED_CLASS);
			}
			else
			{
				_statusFilterLinks[i].classList.remove(SELECTED_CLASS);
			}
		}

		// Reorganize the orders that are shown
		_renderOrders(true);
	}
});

// Search Filter
Object.defineProperty(viewModel, 'searchFilter',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return this.__searchFilter;
	},

	set: (value) =>
	{
		this.__searchFilter = value;

		// Reset the search filter should the value be empty
		rQueryClient.setField(_searchFilter, value);

		// If a value is present within the search field, show the button that can remove whatever text is inside
		// the search field
		if (value)
		{
			_resetSearchIcon.classList.add(REVEAL_CLASS);
		}
		else
		{
			_resetSearchIcon.classList.remove(REVEAL_CLASS);
		}

		// Reorganize the orders that are shown
		_renderOrders(false);
	}
});

/**
 * Trigger responsible for periodically checking for new data from the server. Should there be
 * new data from the server, the data will be integrated into the existing dataset and loaded on
 * the page
 *
 * @author kinsho
 */
Object.defineProperty(viewModel, 'pingTheServer',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return this.__pingTheServer;
	},

	set: () =>
	{
		var orders = viewModel.orders,
			// Before looking for new orders, figure out from what date to begin our search
			dateToSearch = (orders[0] ? orders[0].lastModifiedDate : DEFAULT_MODIFICATION_DATE),
			changeCount;

		axios.get(SEARCH_ORDERS_URL, { date: dateToSearch }).then((results) =>
		{
			changeCount = orderUtility.reconcileOrders(orders, results);

			// Only re-render the orders should there be any changes made to the order
			if (changeCount)
			{
				_renderOrders(true);
			}
		}, () =>
		{
			notifier.showGenericServerError();
		});
	}
});

// ----------------- EXPORT -----------------------------

export default viewModel;