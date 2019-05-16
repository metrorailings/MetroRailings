/**
 * The sub-view model for an order
 */

// ----------------- EXTERNAL MODULES --------------------------

import rQueryClient from 'client/scripts/utility/rQueryClient';

import statuses from 'shared/orderStatus';

// ----------------- ENUM/CONSTANTS -----------------------------

const ORDER_BLOCK_PREFIX = 'order-',
	HIDE_CLASS = 'hide';

// ----------------- PRIVATE VARIABLES -----------------------------

// ----------------- PRIVATE FUNCTIONS -----------------------------

// ----------------- VIEW MODEL DEFINITION -----------------------------

/**
 * The constructor function used to build an order model
 *
 * @param {Object} order - the order to copy over into this model
 *
 * @returns {Object} - the order studded with the getters and setters in this model
 *
 * @author kinsho
 */
function createNewModel(order)
{
	let orderModel = {},
		keys = Object.keys(order);

	// Now copy over the values from the passed order into this order model
	for (let i = keys.length - 1; i >= 0; i--)
	{
		orderModel[keys[i]] = order[keys[i]];
	}

	return orderModel;
}

// ----------------- EXPORT -----------------------------

export default createNewModel;