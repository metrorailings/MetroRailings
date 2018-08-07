/**
 * The view model for the create custom invoice page
 */

// ----------------- EXTERNAL MODULES --------------------------

import formValidator from 'shared/formValidator';
import rQueryClient from 'client/scripts/utility/rQueryClient';
import tooltipManager from 'client/scripts/utility/tooltip';

// ----------------- ENUM/CONSTANTS -----------------------------

var ORDER_ID_TEXTFIELD = 'orderID',
	CUSTOMER_NAME_TEXTFIELD = 'customerName',
	EMAIL_TEXTFIELD = 'customerEmail',
	ADDRESS_TEXTFIELD = 'customerAddress',
	CITY_TEXTFIELD = 'customerCity',
	STATE_SELECT = 'customerState',
	MEMO_TEXTAREA = 'memoDescription',
	SUBTOTAL_DISPLAY = 'customInvoiceSubtotalDisplay',
	STATE_TAX_DISPLAY = 'stateTaxDisplay',
	TOTAL_DISPLAY = 'customInvoiceTotalDisplay',
	CUSTOM_INVOICE_SUBMIT_BUTTON = 'customInvoiceSubmit',

	VALIDATE_VIEW_MODEL_LISTENER = 'validateCustomInvoiceVM',

	ERROR =
	{
		ORDER_ID_INVALID: 'Please enter only numbers here.',
		EMAIL_INVALID: 'Please enter a valid e-mail address here.',

		NO_ORDER_FOUND: 'No order was found that matched the ID you put in. Either change the order ID or leave the' +
		' field empty.'
	},

	SUBMISSION_INSTRUCTIONS =
	{
		CANNOT_SUBMIT: 'We cannot quite go forward here. Keep in mind that you need to give a name, a valid' +
		' e-mail address, a memo, and a description / price for each item on the invoice. Then we can' +
		' go forth.'
	};

// ----------------- PRIVATE VARIABLES -----------------------------

var _validationSet = new Set(),

	// Elements
	_orderIdField = document.getElementById(ORDER_ID_TEXTFIELD),
	_nameField = document.getElementById(CUSTOMER_NAME_TEXTFIELD),
	_emailField = document.getElementById(EMAIL_TEXTFIELD),
	_addressField = document.getElementById(ADDRESS_TEXTFIELD),
	_cityField = document.getElementById(CITY_TEXTFIELD),
	_stateField = document.getElementById(STATE_SELECT),
	_memoField = document.getElementById(MEMO_TEXTAREA),

	_subtotalDisplay = document.getElementById(SUBTOTAL_DISPLAY),
	_taxDisplay = document.getElementById(STATE_TAX_DISPLAY),
	_totalDisplay = document.getElementById(TOTAL_DISPLAY),

	_submitButton = document.getElementById(CUSTOM_INVOICE_SUBMIT_BUTTON);

// ----------------- PRIVATE FUNCTIONS -----------------------------

/**
 * Generic function for invoking the logic that briefly validates this view model
 *
 * @author kinsho
 */
function _validate()
{
	// First, run through generic validation
	if (rQueryClient.validateModel(viewModel, _validationSet))
	{
		// Then check to see if there's at least one item
		if (viewModel.items.length)
		{
			// Now run through each item on the invoice to assure that it has been properly defined
			for (let i = 0; i < viewModel.items.length; i++)
			{
				if (!(viewModel.items[i].validItem))
				{
					viewModel.isFormSubmissible = false;
					return;
				}
			}

			viewModel.isFormSubmissible = true;
			return;
		}
	}

	viewModel.isFormSubmissible = false;
	return;
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
		// Ensure that the value does not simply consist of spaces
		value = (value ? window.parseInt((value + '').trim(), 10) : '');
		viewModel.__orderId = value;

		rQueryClient.setField(_orderIdField, value, _validationSet);
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
		value = (value ? value.trim() : '');
		viewModel.__name = value;

		rQueryClient.setField(_nameField, value, _validationSet);
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
	}
});

// Customer's address
Object.defineProperty(viewModel, 'address',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__address;
	},

	set: (value) =>
	{
		// Ensure that the value does not simply consist of spaces
		value = (value.trim() ? value : '');
		viewModel.__address = value;

		rQueryClient.setField(_addressField, value, _validationSet);
	}
});

// Customer's city
Object.defineProperty(viewModel, 'city',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__city;
	},

	set: (value) =>
	{
		// Ensure that the value does not simply consist of spaces
		value = (value.trim() ? value : '');
		viewModel.__city = value;

		rQueryClient.setField(_cityField, value, _validationSet);
	}
});

// Customer's e-mail address
Object.defineProperty(viewModel, 'state',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__state;
	},

	set: (value) =>
	{
		// Ensure that the value does not simply consist of spaces
		value = (value.trim() ? value : '');
		viewModel.__state = value;

		rQueryClient.setField(_stateField, value, _validationSet);
	}
});

// Invoice memo
Object.defineProperty(viewModel, 'memo',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__memo;
	},

	set: (value) =>
	{
		// Ensure that the value does not simply consist of spaces
		value = (value.trim() ? value : '');
		viewModel.__memo = value;

		rQueryClient.setField(_memoField, value);
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
	enumerable: true,

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
	enumerable: true,

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
	enumerable: true,

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
			tooltipManager.setTooltip(_submitButton, SUBMISSION_INSTRUCTIONS.CANNOT_SUBMIT, true);
		}
		else
		{
			tooltipManager.closeTooltip(_submitButton, true);
		}
	}
});

// ----------------- LISTENERS -----------------------------

// Set up a listener that would allow us to trigger validation logic from within the item models
document.addEventListener(VALIDATE_VIEW_MODEL_LISTENER, _validate);

// ----------------- EXPORT -----------------------------

export default viewModel;