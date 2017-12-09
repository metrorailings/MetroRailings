/**
 * The view model for the orders page
 */

// ----------------- EXTERNAL MODULES --------------------------

import orderUtility from 'client/scripts/orders/orderUtility';

import axios from 'client/scripts/utility/axios';
import rQueryClient from 'client/scripts/utility/rQueryClient';
import notifier from 'client/scripts/utility/notifications';

import statuses from 'shared/orderStatus';
import designTranslator from 'shared/designs/translator';
import dateUtility from 'shared/dateUtility';

// ----------------- ENUM/CONSTANTS -----------------------------

var STATUS_FILTER_CLASS = 'statusFilter',
	SELECTED_CLASS = 'selected',
	REVEAL_CLASS = 'reveal',

	SEARCH_FILTER = 'searchFilterTextfield',
	RESET_SEARCH_ICON = 'resetSearch',
	ORDER_LISTINGS_CONTAINER = 'orderListing',
	ORDER_LISTING_TEMPLATE = 'orderListingTemplate',
	ORDER_NOTES_TEMPLATE = 'orderNotesTemplate',

	PRIORITY_LEVELS =
	{
		GREEN: 'greenPriority',
		YELLOW: 'yellowPriority',
		RED: 'redPriority',
		CRITICAL: 'criticalPriority'
	},

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
 * Helper designed to determine whether an order can have its status updated to the next level from the orders listing
 */
Handlebars.registerHelper('can_status_be_updated', function(str, block)
{
	if (statuses.moveStatusToNextLevel(str) && (statuses.isShopStatus(str)))
	{
		return block.fn(this);
	}
});

/**
 * Handlebars helper function designed to map a design's code name to a full name
 *
 * @author kinsho
 */
Handlebars.registerHelper('map_design_code_to_full_name', function(designCode)
{
	return designTranslator.findDesignName(designCode);
});

/**
 * Handlebars helper function designed to test whether two values are equal
 *
 * @author kinsho
 */
Handlebars.registerHelper('if_cond', function(val1, val2, block)
{
	return (val1 === val2 ? block.fn(this) : block.inverse(this));
});

/**
 * Helper designed to help us test for the equality of two values and execute opposite blocks of code depending on
 * the results of that test
 *
 * @author kinsho
 */
Handlebars.registerHelper('unless_cond', function(val1, val2, block)
{
	return (val1 === val2 ? block.inverse(this) : block.fn(this));
});

/**
 * Helper designed to help us test whether a value already exists within a set of given values. We execute
 * blocks of code depending on the results of that test
 *
 * @author kinsho
 */
Handlebars.registerHelper('if_cond_group', function(val, groupVals, block)
{
	groupVals = JSON.parse(groupVals);

	for (var i = groupVals.length - 1; i >= 0; i--)
	{
		if (groupVals[i] === val)
		{
			return block.fn(this);
		}
	}

	return block.inverse(this);
});

/**
 * Helper designed to help us test whether a value already exists within a set of given values. We execute opposite
 * blocks of code depending on the results of that test
 *
 * @author kinsho
 */
Handlebars.registerHelper('unless_cond_group', function(val, groupVals, block)
{
	groupVals = JSON.parse(groupVals);

	for (var i = groupVals.length - 1; i >= 0; i--)
	{
		if (groupVals[i] === val)
		{
			return block.inverse(this);
		}
	}

	return block.fn(this);
});

/**
 * Helper designed to determine how many days are left before a given date has been reached
 *
 * @author kinsho
 */
Handlebars.registerHelper('determine_days_left', function(goalDate)
{
	var currentDate = new Date(),
		timeRemaining = new Date(goalDate) - currentDate,
		daysRemaining = Math.ceil(timeRemaining / (1000 * 3600 * 24));

	return daysRemaining;
});

/**
 * Helper designed to determine the priority level of the order given the number of days remaining before its due date
 *
 * @author kinsho
 */
Handlebars.registerHelper('determine_priority_level', function(goalDate)
{
	var currentDate = new Date(),
		timeRemaining = new Date(goalDate) - currentDate,
		daysRemaining = Math.ceil(timeRemaining / (1000 * 3600 * 24));

	if (daysRemaining >= 35)
	{
		return PRIORITY_LEVELS.GREEN;
	}
	else if (daysRemaining >= 20)
	{
		return PRIORITY_LEVELS.YELLOW;
	}
	else if (daysRemaining > 7)
	{
		return PRIORITY_LEVELS.RED;
	}
	else
	{
		return PRIORITY_LEVELS.CRITICAL;
	}
});

/**
 * Handlebars helper function designed to test whether a value qualifies as a string
 *
 * @author kinsho
 */
Handlebars.registerHelper('is_string', function(val)
{
	return (typeof val === 'string');
});

/**
 * Handlebars helper function designed to translate computerized dates into user-friendly text
 *
 * @author kinsho
 */
Handlebars.registerHelper('format_date', function(date)
{
	date = new Date(date);

	return dateUtility.FULL_MONTHS[date.getMonth()] + ' ' + date.getDate() + dateUtility.findOrdinalSuffix(date.getDate()) + ', ' + date.getFullYear();
});

/**
 * Handlebars helper function designed to translate computerized time strings into user-friendly text
 *
 * @author kinsho
 */
Handlebars.registerHelper('format_time', function(date)
{
	var dateObj = new Date(date),
		militaryHour = dateObj.getHours(),
		readableHour = (militaryHour % 12 ? militaryHour % 12 : 12),
		useAMorPM = (militaryHour - 12 < 0 ? 'AM' : 'PM'),
		readableMinute = dateObj.getMinutes(),
		readableSecond = dateObj.getSeconds();

	// Add zeroes to the front of any time component that's less than 10
	if (readableHour < 10)
	{
		readableHour = '0' + readableHour;
	}
	if (readableMinute < 10)
	{
		readableMinute = '0' + readableMinute;
	}
	if (readableSecond < 10)
	{
		readableSecond = '0' + readableSecond;
	}

	return readableHour + ':' + readableMinute + ':' + readableSecond + ' ' + useAMorPM;
});

// ----------------- HANDLEBAR TEMPLATES ---------------------------

/**
 * The partial to render individual orders on the orders page
 */
var orderListingTemplate = Handlebars.compile(document.getElementById(ORDER_LISTING_TEMPLATE).innerHTML);

/**
 * The partial to render the HTML that renders out all the notes associated with any given order
 */
Handlebars.registerPartial('orderNotes', document.getElementById(ORDER_NOTES_TEMPLATE).innerHTML);

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
		return viewModel.__orders;
	},

	set: (value) =>
	{
		var prevValue = viewModel.__orders;

		// If we are initializing this collection from a cached array, ensure each cached order is properly
		// wrapped in a view model object and then render any open orders on the screen
		if (!(prevValue) && value.length)
		{
			viewModel.__orders = orderUtility.wrapOrdersInModels(value);
			_renderOrders(true);
		}
		else
		{
			viewModel.__orders = value || [];
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
		return viewModel.__statusFilter;
	},

	set: (value) =>
	{
		viewModel.__statusFilter = value;

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

		// Set this filter into the URL
		window.location.href = (window.location.href.split('#')[0]) + '#' + value;
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
		return viewModel.__pingTheServer;
	},

	set: () =>
	{
		var orders = viewModel.orders,
			// Before looking for new orders, figure out from what date to begin our search
			dateToSearch = (orders[0] ? new Date(orders[0].lastModifiedDate) : DEFAULT_MODIFICATION_DATE),
			changeCount;

		axios.post(SEARCH_ORDERS_URL, { date: dateToSearch }).then((results) =>
		{
			changeCount = orderUtility.reconcileOrders(orders, results.data);

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