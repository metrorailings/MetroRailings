/**
 * The view model for the create custom invoice page
 */

// ----------------- EXTERNAL MODULES --------------------------

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

import formValidator from 'shared/formValidator';
import rQueryClient from 'client/scripts/utility/rQueryClient';
import tooltipManager from 'client/scripts/utility/tooltip';

// ----------------- ENUM/CONSTANTS -----------------------------

var ORDER_ID_TEXTFIELD = 'orderID',
	CUSTOMER_NAME_TEXTFIELD = 'customerName',
	EMAIL_TEXTFIELD = 'customerEmail',
	SUBTOTAL_DISPLAY = 'customInvoiceSubtotalDisplay',
	STATE_TAX_DISPLAY = 'stateTaxDisplay',
	TOTAL_DISPLAY = 'customInvoiceTotalDisplay',
	CUSTOM_INVOICE_SUBMIT_BUTTON = 'customInvoiceSubmit',
	
	SEARCH_FOR_ORDER_URL = 'customInvoice/searchForOrder',

	ERROR =
	{
		ORDER_ID_INVALID: 'Please enter only numbers here.',
		EMAIL_INVALID: 'Please enter a valid e-mail address here.',

		NO_ORDER_FOUND: 'No order was found that matched the ID you put in. Either change the order ID or leave the' +
		' field empty.'
	},

	SUBMISSION_INSTRUCTIONS =
	{
		EMPTY_FIELDS: 'At least one of the required fields above is empty. Fill out all fields that are marked with' +
			' an asterik.',
		INVALID_FIELDS: 'At least one of the fields above has an improper value. Please fix all erroneous values' +
			' before submitting this form.'
	};

// ----------------- PRIVATE VARIABLES -----------------------------

var _validationSet = new Set(),

	// Elements
	_orderIdField = document.getElementById(ORDER_ID_TEXTFIELD),
	_nameField = document.getElementById(CUSTOMER_NAME_TEXTFIELD),
	_emailField = document.getElementById(EMAIL_TEXTFIELD),

	_subtotalDisplay = document.getElementById(SUBTOTAL_DISPLAY),
	_taxDisplay = document.getElementById(STATE_TAX_DISPLAY),
	_totalDisplay = document.getElementById(TOTAL_DISPLAY),

	_submitButton = document.getElementById(CUSTOM_INVOICE_SUBMIT_BUTTON);

// ----------------- PRIVATE FUNCTIONS -----------------------------

/**
 * Generic function for invoking the logic that briefly validates this view model
 *
 * @returns {boolean} - indicating whether this view model has been validated
 *
 * @author kinsho
 */
function _validate()
{
	return rQueryClient.validateModel(viewModel, _validationSet);
}

// ----------------- VIEW MODEL DEFINITION -----------------------------

var viewModel = {};

// Order ID
Object.defineProperty(viewModel, 'orderId',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__orderId;
	},

	set: (value) =>
	{
		var validationStatus;

		// Ensure that the value does not simply consist of spaces
		value = (value.trim() ? window.parseInt(value, 10) : '');

		validationStatus = formValidator.isNumeric(value + '', '');

		viewModel.__orderId = value;

		rQueryClient.updateValidationOnField(!validationStatus, _orderIdField, ERROR.ORDER_ID_INVALID, _validationSet);
		rQueryClient.setField(_orderIdField, value, _validationSet);
		viewModel.isFormSubmissible = _validate();

		// If a valid order ID has been submitted, then see if a corresponding order can be found from the database
		if (validationStatus && value)
		{
			axios.post(SEARCH_FOR_ORDER_URL, { id : value }, true).then((results) =>
			{
				viewModel.name = results.data.customer.name;
				viewModel.email = results.data.customer.email;
			}, () =>
			{
				notifier.showSpecializedServerError(ERROR.NO_ORDER_FOUND);
			});
		}
	}
});

// Recipient Name
Object.defineProperty(viewModel, 'name',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__name;
	},

	set: (value) =>
	{
		// Ensure that the value does not simply consist of spaces
		value = (value.trim() ? value : '');
		viewModel.__name = value;

		rQueryClient.setField(_nameField, value, _validationSet);

		// Run through the validation logic, as this is a required field
		viewModel.isFormSubmissible = _validate();
	}
});

// Customer's e-mail address
Object.defineProperty(viewModel, 'email',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__email;
	},

	set: (value) =>
	{
		// Ensure that the value does not simply consist of spaces
		value = (value.trim() ? value : '');
		viewModel.__email = value;

		// Test whether the value qualifies as an e-mail address
		rQueryClient.updateValidationOnField(!(formValidator.isEmail(value)), _emailField, ERROR.EMAIL_INVALID, _validationSet);
		rQueryClient.setField(_emailField, value, _validationSet);
		viewModel.isFormSubmissible = _validate();
	}
});

// Items on the invoice
Object.defineProperty(viewModel, 'items',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__items;
	},

	set: (value) =>
	{
		viewModel.__items = value;
	}
});

// Invoice Subtotal
Object.defineProperty(viewModel, 'subtotal',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__subtotal;
	},

	set: (value) =>
	{
		viewModel.__subtotal = value;

		_subtotalDisplay.innerHTML = '$' + parseFloat(value).toFixed(2);
	}
});

// Tax Waived Flag
Object.defineProperty(viewModel, 'isTaxWaived',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__taxWaived;
	},

	set: (value) =>
	{
		viewModel.__taxWaived = value;
	}
});

// Invoice State Tax
Object.defineProperty(viewModel, 'tax',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__tax;
	},

	set: (value) =>
	{
		viewModel.__tax = value;

		_taxDisplay.innerHTML = '$' + parseFloat(value).toFixed(2);
	}
});

// Invoice Total
Object.defineProperty(viewModel, 'totalPrice',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__totalPrice;
	},

	set: (value) =>
	{
		viewModel.__totalPrice = value;

		_totalDisplay.innerHTML = '$' + parseFloat(value).toFixed(2);
	}
});

// Validation Flag
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

		if (!(value))
		{
			// Set up a tooltip indicating why the button is disabled
			tooltipManager.setTooltip(_submitButton, _validationSet.size ? SUBMISSION_INSTRUCTIONS.INVALID_FIELDS : SUBMISSION_INSTRUCTIONS.EMPTY_FIELDS);
		}
		else
		{
			tooltipManager.closeTooltip(_submitButton, true);
		}
	}
});

// ----------------- EXPORT -----------------------------

export default viewModel;