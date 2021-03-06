/**
 * The view model for the orders page
 */

// ----------------- EXTERNAL MODULES --------------------------

import orderUtility from 'client/scripts/orders/orderUtility';

import axios from 'client/scripts/utility/axios';
import rQueryClient from 'client/scripts/utility/rQueryClient';
import notifier from 'client/scripts/utility/notifications';

// ----------------- ENUM/CONSTANTS -----------------------------

const SORT_FILTER_CLASS = 'sortFilter',
	STATUS_FILTER_CLASS = 'statusFilter',
	SELECTED_CLASS = 'selected',
	REVEAL_CLASS = 'reveal',

	COMPANY_FILTER = 'companySelector',
	SEARCH_FILTER = 'searchFilterTextfield',
	RESET_SEARCH_ICON = 'resetSearch',
	RESET_COMPANY_ICON = 'resetCompany',
	ORDER_LISTINGS_CONTAINER = 'orderListing',
	ORDER_LISTING_TEMPLATE = 'orderListingTemplate',
	STALE_DATA_FOUND = 'staleDataNotifier',

	SEARCH_ORDERS_URL = 'orders/searchOrders',

	LISTENER_INIT_EVENT = 'listenerInit',

	LOCAL_STORAGE_ORDERS_LAST_MODIFIED_KEY = 'mrAdminOrdersLastModified',
	DEFAULT_MODIFICATION_DATE = new Date('1/1/2014'),

	HASH_LABELS =
	{
		SORT : 'sort',
		STATUS : 'status',
		COMPANY : 'company',
		SEARCH : 'search'
	};

// ----------------- PRIVATE VARIABLES -----------------------------

// Elements
let _sortFilterLinks = document.getElementsByClassName(SORT_FILTER_CLASS),
	_statusFilterLinks = document.getElementsByClassName(STATUS_FILTER_CLASS),
	_companyFilter = document.getElementById(COMPANY_FILTER),
	_searchFilter = document.getElementById(SEARCH_FILTER),
	_resetCompanyIcon = document.getElementById(RESET_COMPANY_ICON),
	_resetSearchIcon = document.getElementById(RESET_SEARCH_ICON),
	_orderListing = document.getElementById(ORDER_LISTINGS_CONTAINER),
	_staleDataNotifier = document.getElementById(STALE_DATA_FOUND),

	_pingInitRendered = false;

// ----------------- HANDLEBAR TEMPLATES ---------------------------

/**
 * The partial to render individual orders on the orders page
 */
let orderListingTemplate = Handlebars.compile(document.getElementById(ORDER_LISTING_TEMPLATE).innerHTML);

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
	let filteredOrders = viewModel.orders;

	// We need this escape logic only during initialization
	if ( !(filteredOrders) )
	{
		return false;
	}

	filteredOrders = orderUtility.filterOrdersByStatus(filteredOrders, viewModel.statusFilter);
	filteredOrders = orderUtility.filterOrdersByCompany(filteredOrders, viewModel.companyFilter);
	filteredOrders = orderUtility.filterOrdersBySearchText(filteredOrders, viewModel.searchFilter);
	orderUtility.sortOrders(filteredOrders, viewModel.sortFilter);

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

/**
 * Function updates the hash values in the URL depending on the filters that were selected
 *
 * @author kinsho
 */
function _updateHash()
{
	let hash = [];

	if (viewModel.sortFilter)
	{
		hash.push(HASH_LABELS.SORT + '=' + viewModel.sortFilter);
	}
	if (viewModel.statusFilter)
	{
		hash.push(HASH_LABELS.STATUS + '=' + viewModel.statusFilter);
	}

	if (viewModel.companyFilter)
	{
		hash.push(HASH_LABELS.COMPANY + '=' + viewModel.companyFilter);
	}

	if (viewModel.searchFilter)
	{
		hash.push(HASH_LABELS.SEARCH + '=' + viewModel.searchFilter);
	}

	// Join the hash key/value pairs together 
	hash = hash.join('&');

	// Set the hash values into the URL
	window.location.href = (window.location.href.split('#')[0]) + '#' + hash;
}

// ----------------- VIEW MODEL DEFINITION -----------------------------

let viewModel = {};

// Orders Collection
Object.defineProperty(viewModel, 'orders',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__orders;
	},

	set: (value) =>
	{
		viewModel.__orders = orderUtility.wrapOrdersInModels(value);
	}
});

// General Filter
Object.defineProperty(viewModel, 'sortFilter',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__sortFilter;
	},

	set: (value) =>
	{
		viewModel.__sortFilter = value;

		// Properly indicate to the user by which status are the orders being filtered
		for (let i = _sortFilterLinks.length - 1; i >= 0; i--)
		{
			if (_sortFilterLinks[i].dataset.value === value)
			{
				_sortFilterLinks[i].classList.add(SELECTED_CLASS);
			}
			else
			{
				_sortFilterLinks[i].classList.remove(SELECTED_CLASS);
			}
		}

		// Reorganize the orders that are shown
		_renderOrders(true);

		// Set this filter into the URL
		_updateHash();
	}
});

// Company Filter
Object.defineProperty(viewModel, 'companyFilter',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__companyFilter;
	},

	set: (value) =>
	{
		viewModel.__companyFilter = value;

		// Set the company filter input
		_companyFilter.value = value;

		// Figure out whether to show the icon used to cancel out any value that's been set inside the company selector
		if (value)
		{
			_resetCompanyIcon.classList.add(REVEAL_CLASS);
		}
		else
		{
			_resetCompanyIcon.classList.remove(REVEAL_CLASS);
		}

		// Reorganize the orders that are shown
		_renderOrders(true);

		// Set this filter into the URL
		_updateHash();
	}
});

// Status Filter
Object.defineProperty(viewModel, 'statusFilter',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__statusFilter;
	},

	set: (value) =>
	{
		viewModel.__statusFilter = value;

		// Properly indicate to the user by which status are the orders being filtered
		for (let i = _statusFilterLinks.length - 1; i >= 0; i--)
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

		// Set this filter into the URL
		_updateHash();
	}
});

// Search Filter
Object.defineProperty(viewModel, 'searchFilter',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__searchFilter;
	},

	set: (value) =>
	{
		viewModel.__searchFilter = value;

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

		// Set this filter into the URL
		_updateHash();
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
		return null;
	},

	set: () =>
	{
		let dateToSearch = (window.localStorage.getItem(LOCAL_STORAGE_ORDERS_LAST_MODIFIED_KEY) ? JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_ORDERS_LAST_MODIFIED_KEY)) : DEFAULT_MODIFICATION_DATE),
			formalDate = new Date(dateToSearch);

		axios.post(SEARCH_ORDERS_URL, { date: formalDate.toString() }).then((results) =>
		{
			if (orderUtility.reconcileOrders(viewModel.orders, results.data))
			{
				// In the event that data is present on the screen, show the alert indicating that the data present
				// is stale
				if (_pingInitRendered)
				{
					_staleDataNotifier.classList.add(REVEAL_CLASS);
				}
				else
				{
					_pingInitRendered = true;

					_renderOrders(true);
				}
			}
			// As part of the page initialization process, orders will need to be rendered even if the back-end
			// indicates no orders have been updated since the last ping
			else if ( !(_pingInitRendered) )
			{
				_pingInitRendered = true;

				_renderOrders(true);
			}
		}, () =>
		{
			notifier.showGenericServerError();
		});
	}
});

/**
 * A flag that simply forces the orders on screen to reload
 *
 * @author kinsho
 */
Object.defineProperty(viewModel, 'forceRefresh',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return false;
	},

	set: () =>
	{
		_renderOrders(true);
	}
});

// ----------------- EXPORT -----------------------------

export default viewModel;