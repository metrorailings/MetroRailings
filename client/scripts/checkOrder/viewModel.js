/**
 * The view model for the order search page
 */

// ----------------- EXTERNAL MODULES --------------------------

import rQueryClient from 'client/scripts/utility/rQueryClient';

// ----------------- ENUM/CONSTANTS -----------------------------

var ORDER_ID_TEXTFIELD = 'orderId',
	EMAIL_TEXTFIELD = 'orderEmail',
	PHONE_TWO_TEXTFIELD = 'orderPhoneTwo',

	ORDER_SEARCH_BUTTON_CONTAINER = 'orderSearchButtonContainer',
	ORDER_SEARCH_BUTTON = 'orderSearchButton',

	SEARCH_BUTTON_DISABLED_MESSAGE = 'You must fill out at least two of the search fields above before we can conduct an order search.';

// ----------------- PRIVATE VARIABLES -----------------------------

// Elements
var _orderIdField = document.getElementById(ORDER_ID_TEXTFIELD),
	_emailField = document.getElementById(EMAIL_TEXTFIELD),
	_phoneTwoField = document.getElementById(PHONE_TWO_TEXTFIELD),

	_orderSearchButtonContainer = document.getElementById(ORDER_SEARCH_BUTTON_CONTAINER),
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
		return this.__orderID;
	},

	set: (value) =>
	{
		this.__orderID = value;

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
		return this.__email;
	},

	set: (value) =>
	{
		this.__email = value;

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
		return this.__phoneTwo;
	},

	set: (value) =>
	{
		rQueryClient.setField(_phoneTwoField, value);

		// Only set the value into the view model if we have a four-digit value
		this.__phoneTwo = (value.length === 4 ? value : '');

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
		return this.__orders;
	},

	set: (value) =>
	{
		this.__orders = value;
	}
});

// Form Submission Flag
Object.defineProperty(viewModel, 'isFormSubmissible',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return this.__isFormSubmissible;
	},

	set: (value) =>
	{
		this.__isFormSubmissible = value;

		// Figure out whether the button to submit the form should be disabled
		// Also ensure that a tooltip is there to alert the user as to why the button may be disabled
		_orderSearchButton.disabled = !(value);
		_orderSearchButtonContainer.dataset.hint = (value ? '' : SEARCH_BUTTON_DISABLED_MESSAGE);
	}
});

// ----------------- EXPORT -----------------------------

export default viewModel;