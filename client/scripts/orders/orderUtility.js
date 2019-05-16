// ----------------- EXTERNAL MODULES --------------------------

import orderModel from 'client/scripts/orders/orderModel';

import statuses from 'shared/orderStatus';

// ----------------- ENUMS/CONSTANTS ---------------------------

const SORT_METHODS =
	{
		DUE_DATE : 'dueDate',
		LAST_MODIFIED_DATE : 'lastModified'
	};

	// const LOCAL_STORAGE_ORDERS_KEY = 'metroRailings.orders';

// ----------------- PRIVATE FUNCTIONS ---------------------------

/**
 * The sorting function that we will use to keep orders organized by modification date
 *
 * @param {Object} a - the order to compare to the other order passed into this function
 * @param {Object} b - the order to compare to the other order passed into this function
 *
 * @returns {Number} - a number indicating whether the first order's modification date comes before the second order's
 *
 * @author kinsho
 */
function _sortOrdersByModDate(a, b)
{
	return ( (new Date(a.dates.lastModified) < new Date(b.dates.lastModified)) ? 1 : -1 );
}

/**
 * The sorting function that we will use to keep orders organized by due date
 *
 * @param {Object} a - the order to compare to the other order passed into this function
 * @param {Object} b - the order to compare to the other order passed into this function
 *
 * @returns {Number} - a number indicating whether the first order's modification date comes before the second order's
 *
 * @author kinsho
 */
function _sortOrdersByDueDate(a, b)
{
	return ( (new Date(a.dates.due) < new Date(b.dates.due)) ? 1 : -1 );
}

// ----------------- MODULE DEFINITION -----------------------------

let orderManagerModule =
{
	/**
	 * Function that takes a passed collection of orders and wraps each order in a specialized order view model.
	 *
	 * @param {Array<Object>} orders - the orders to wrap
	 *
	 * @returns {Array<Object>} - the collection of orders, each one wrapped in a view model
	 */
	wrapOrdersInModels: (orders = []) =>
	{
		let wrappedOrders = [];

		for (let i = 0; i < orders.length; i++)
		{
			wrappedOrders.push(orderModel(orders[i]));
		}

		return wrappedOrders;
	},

	/**
	 * Function that sets default values into an order should certain properties be not defined
	 *
	 * @param {Object} order - the order to stud with default values
	 *
	 * @returns {Object} - the order, initialized with default values in certain spots if needed
	 *
	 * @author kinsho
	 */
	studWithDefaultValues: (order) =>
	{
		order.customer.company = order.customer.company || '';
		order.customer.email = order.customer.email || '';
		order.customer.areaCode = order.customer.areaCode || '';
		order.customer.phoneOne = order.customer.phoneOne || '';
		order.customer.phoneTwo = order.customer.phoneTwo || '';
		order.customer.address = order.customer.address || '';
		order.customer.city = order.customer.city || '';
		order.customer.state = order.customer.state || '';
	},

	/**
	 * Function that integrates new order data into an existing set of order data
	 *
	 * @param {Array<Object>} existingOrders - the existing set of order data
	 * @param {Array<Object>} data - the new set of data to integrate gracefully into the existing set
	 *
	 * @returns {Number} - the number of new orders that were appended to the existing set of orders
	 *
	 * @author kinsho
	 */
	reconcileOrders: (existingOrders, data) =>
	{
		let changedOrderCount = 0,
			changedOrders = [],
			i, j;

		data = data || [];

		for (i = 0; i < data.length; i++)
		{
			for (j = existingOrders.length - 1; j >= 0; j--)
			{
				if (existingOrders[j]._id === data[i]._id)
				{
					// Replace the old order from the existing set with the newly modified order
					existingOrders.splice(j, 1, orderModel(data[i]));

					changedOrderCount += 1;
					break;
				}
			}

			// If we are unable to match up the new data with any existing order, consider that piece of data to be
			// a new order in and of itself
			if (j < 0)
			{
				changedOrders.push(orderModel(data[i]));

				changedOrderCount += 1;
			}
		}

		// Sift the orders through whatever filters and sorting methodology have been selected
		existingOrders.unshift(...changedOrders);

		// @TODO: Set up caching of orders
		// Ensure that the currently reconciled collection of orders are saved into the user's local browser cache
		// window.localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(existingOrders));

		return changedOrderCount;
	},

	/**
	 * Function meant to filter orders by a given status
	 *
	 * @param {Array<Object>} orders - the collection of orders to filter
	 * @param {String} status - the status by which to filter orders
	 *
	 * @return {Array<Object>} - the subset of orders that are currently tagged as the passed status
	 *
	 * @author kinsho
	 */
	filterOrdersByStatus: (orders, status) =>
	{
		let filteredOrders = [];

		// In the event that the user does not want to filter by status, return all the orders together
		if ( !(status) )
		{
			return orders;
		}

		if (status === statuses.LIVE)
		{
			for (let i = 0; i < orders.length; i++)
			{
				if (statuses.isOpenStatus(orders[i].status))
				{
					filteredOrders.push(orders[i]);
				}
			}
		}
		else if (status === statuses.SHOP)
		{
			for (let i = 0; i < orders.length; i++)
			{
				if (statuses.isShopStatus(orders[i].status))
				{
					filteredOrders.push(orders[i]);
				}
			}
		}
		for (let i = 0; i < orders.length; i++)
		{
			if (orders[i].status === status)
			{
				filteredOrders.push(orders[i]);
			}
		}

		return filteredOrders;
	},

	/**
	 * Function meant to filter orders by company
	 *
	 * @param {Array<Object>} orders - the collection of orders to filter
	 * @param {String} company - the company whose orders we are seeking
	 *
	 * @return {Array<Object>} - the subset of orders that are currently affiliated with the passed company
	 *
	 * @author kinsho
	 */
	filterOrdersByCompany: (orders, company) =>
	{
		let filteredOrders = [];

		// In the event that the user does not want to filter by company, return all the orders together
		if ( !(company) )
		{
			return orders;
		}

		for (let i = 0; i < orders.length; i += 1)
		{
			// Test to ensure that a company is present first before testing for whether the order belongs to the
			// company being searched
			if ((orders[i].customer.company) && (orders[i].customer.company === company))
			{
				filteredOrders.push(orders[i]);
			}
		}

		return filteredOrders;
	},

	/**
	 * 
	 * Function meant to filter orders given search text
	 *
	 * @param {Array<Object>} orders - the collection of orders to filter
	 * @param {String} searchText - the text by which to filter orders - we will be matching the search text against
	 * 		various parts of the orders in order to determine if the search text applies to any of the properties that
	 * 		we examine
	 *
	 * @return {Array<Object>} - the subset of orders that contains the searchText in some capacity
	 *
	 * @author kinsho
	 */
	filterOrdersBySearchText: (orders, searchText) =>
	{
		let filteredOrders = [],
			order, phoneNumber;

		// Convert the search text over to lower case for the purposes of easier searching
		searchText = searchText || '';
		searchText = searchText.toLowerCase();

		for (let i = 0; i < orders.length; i += 1)
		{
			order = orders[i];

			// Populate the order with default values should we be dealing with a prospect here
			orderManagerModule.studWithDefaultValues(order);

			phoneNumber = '' + order.customer.areaCode + order.customer.phoneOne + order.customer.phoneTwo;

			// @TODO: Allow to search design selections and notes as well
			// Note that the search text will only work on order IDs and customer information
			if ((order._id.toString().indexOf(searchText) >= 0) ||
				(order.customer.name.toLowerCase().indexOf(searchText) >= 0) ||
				(order.customer.company.toLowerCase().indexOf(searchText) >= 0) ||
				(order.customer.email.toLowerCase().indexOf(searchText) >= 0) ||
				(phoneNumber.indexOf(searchText) >= 0) ||
				(order.customer.address.toLowerCase().indexOf(searchText) >= 0) ||
				(order.customer.city.toLowerCase().indexOf(searchText) >= 0) ||
				(order.customer.state.toLowerCase().indexOf(searchText) >= 0))
			{
				filteredOrders.push(orders[i]);
			}
		}

		return filteredOrders;
	},

	/**
	 * Function that sorts a collection of orders by a prescribed method
	 *
	 * @param {Array<Object>} orders - the collection of orders
	 * @param {Enum} sortBy - the methodology by which to organize the orders within the collection
	 *
	 * @author kinsho
	 */
	sortOrders: (orders, sortBy) =>
	{
		if (sortBy === SORT_METHODS.LAST_MODIFIED_DATE)
		{
			orders.sort(_sortOrdersByModDate);
		}
		else if (sortBy === SORT_METHODS.DUE_DATE)
		{
			orders.sort(_sortOrdersByDueDate);
		}
	},

	/**
	 * Function meant to locate the index of a certain order within a collection of orders
	 *
	 * @param {Array<Object>} orders - the collection of orders
	 * @param {Number} orderID - the ID of the order to find within the collection
	 *
	 * @returns {Number} - the index of the targeted order within the collection
	 *
	 * @author kinsho
	 */
	findOrderIndexById: (orders, orderID) =>
	{
		for (let i = 0 ; i < orders.length; i++)
		{
			if (orders[i]._id === orderID)
			{
				return i;
			}
		}

		// Return an impossible index to indicate that the order does not exist within the collection
		// We should never reach this point in the function
		return -1;
	}
};

// ----------------- SCHEDULED UPDATE LOGIC -----------------------------


// ----------------- EXPORT MODULE -----------------------------

export default orderManagerModule;