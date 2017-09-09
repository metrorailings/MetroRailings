/**
 * The sub-view model for an order
 */

// ----------------- EXTERNAL MODULES --------------------------

import rQueryClient from 'client/scripts/utility/rQueryClient';

import statuses from 'shared/orderStatus';

import designModel from 'client/scripts/orders/designModel';
import vm from 'client/scripts/orders/viewModel';

// ----------------- ENUM/CONSTANTS -----------------------------

var ORDER_BLOCK_PREFIX = 'order-',
	LEVEL_UP_ICON = '<i class="fa fa-level-up"></i>',
	MOVE_TO_NEXT_STATUS_PREFIX = 'Move to ',

	ORDER_STATUS_CLASS = 'orderStatusCell',
	NEXT_STATUS_LINK_CLASS = 'nextStatusLink',
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
	var orderModel = {},
		keys = Object.keys(order),
		i;

	// Order Status
	Object.defineProperty(orderModel, 'status',
	{
		configurable: false,
		enumerable: false,

		get: () =>
		{
			return orderModel.__status;
		},

		set: (value) =>
		{
			var prevStatus = orderModel.__status;
			orderModel.__status = value;

			// Only execute the logic below if we're actively changing the status
			if (prevStatus)
			{
				var orderBlock = document.getElementById(ORDER_BLOCK_PREFIX + orderModel._id),
					statusDisplay = orderBlock.getElementsByClassName(ORDER_STATUS_CLASS)[0],
					statusUpdater = orderBlock.getElementsByClassName(NEXT_STATUS_LINK_CLASS)[0],
					nextStatus = statuses.moveStatusToNextLevel(value);

				// If a status filter is currently in effect, remove the updated order from the list of displayed orders.
				// Otherwise, update the status text right away within the order block itself
				if (statusDisplay.textContent !== value)
				{
					if (vm.statusFilter)
					{
						orderBlock.classList.add(HIDE_CLASS);
					}
					else
					{
						statusDisplay.textContent = rQueryClient.capitalize(value);

						// Make sure to also update the link that allows the user to update the state if there is a
						// a state to update to
						if (nextStatus)
						{
							statusUpdater.innerHTML = LEVEL_UP_ICON + MOVE_TO_NEXT_STATUS_PREFIX + rQueryClient.capitalize(nextStatus);
						}
						else
						{
							// Otherwise, get rid of the update link entirely
							statusUpdater.parentNode.removeChild(statusUpdater);
						}
					}
				}
			}
		}
	});

	Object.defineProperty(orderModel, 'design',
	{
		configurable: false,
		enumerable: false,

		get: () =>
		{
			return orderModel.__design;
		},

		set: (value) =>
		{
			orderModel.__design = new designModel(value);
		}
	});

	// Now copy over the values from the passed order into this order model
	for (i = keys.length - 1; i >= 0; i--)
	{
		orderModel[keys[i]] = order[keys[i]];
	}

	return orderModel;
}

// ----------------- EXPORT -----------------------------

export default createNewModel;