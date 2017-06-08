/**
 * The view model for the order search page
 */

// ----------------- EXTERNAL MODULES --------------------------

import rQueryClient from 'client/scripts/utility/rQueryClient';
import tooltipManager from 'client/scripts/utility/tooltip';

// ----------------- ENUM/CONSTANTS -----------------------------

var ORDER_ID_TEXTFIELD = 'orderId',
	EMAIL_TEXTFIELD = 'orderEmail',
	PHONE_TWO_TEXTFIELD = 'orderPhoneTwo',

	ORDER_SEARCH_BUTTON = 'orderSearchButton',

	SEARCH_BUTTON_DISABLED_MESSAGE = 'You must fill out at least two of the search fields above before we can conduct an order search.';

// ----------------- PRIVATE VARIABLES -----------------------------

// Elements
var _orderIdField = document.getElementById(ORDER_ID_TEXTFIELD),
	_emailField = document.getElementById(EMAIL_TEXTFIELD),
	_phoneTwoField = document.getElementById(PHONE_TWO_TEXTFIELD),

	_orderSearchButton = document.getElementById(ORDER_SEARCH_BUTTON);

// ----------------- PRIVATE FUNCTIONS -----------------------------

/**
 * Function that determines whether the user has filled out enough fields to search for orders
 *
 * @author kinsho
 */
function _checkWhetherFormIsSubmissible()
{
	// A search can only be initiated should the user have filled out at least two of the search fields
	viewModel.isFormSubmissible = ((viewModel.orderID && viewModel.email) ||
		(viewModel.orderID && viewModel.phoneTwo) ||
		(viewModel.email && viewModel.phoneTwo));
}

// ----------------- VIEW MODEL DEFINITION -----------------------------

var viewModel = {};

// Order ID
Object.defineProperty(viewModel, 'orderID',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__orderID;
	},

	set: (value) =>
	{
		viewModel.__orderID = value;

		rQueryClient.setField(_orderIdField, value);
		_checkWhetherFormIsSubmissible();
	}
});

// E-mail Address
Object.defineProperty(viewModel, 'email',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__email;
	},

	set: (value) =>
	{
		viewModel.__email = value;

		rQueryClient.setField(_emailField, value);
		_checkWhetherFormIsSubmissible();
	}
});

// Phone Two
Object.defineProperty(viewModel, 'phoneTwo',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__phoneTwo;
	},

	set: (value) =>
	{
		rQueryClient.setField(_phoneTwoField, value);

		// Only set the value into the view model if we have a four-digit value
		viewModel.__phoneTwo = (value.length === 4 ? value : '');

		_checkWhetherFormIsSubmissible();
	}
});

// Orders to show on the page
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
		viewModel.__orders = value;
	}
});

// Form Submission Flag
Object.defineProperty(viewModel, 'isFormSubmissible',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__isFormSubmissible;
	},

	set: (value) =>
	{
		viewModel.__isFormSubmissible = value;

		if ( !(value) )
		{
			// Ensure that a tooltip is there to alert the user as to why the button is disabled
			if ( !(tooltipManager.doesTooltipExist(_orderSearchButton)) )
			{
				tooltipManager.setTooltip(_orderSearchButton, SEARCH_BUTTON_DISABLED_MESSAGE);
			}
		}
		else
		{
			tooltipManager.closeTooltip(_orderSearchButton, true);
		}
	}
});

// ----------------- EXPORT -----------------------------

export default viewModel;