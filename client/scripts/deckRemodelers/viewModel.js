/**
 * The view model for Deck Remodelers' new customer page
 */

// ----------------- EXTERNAL MODULES --------------------------

import rQueryClient from 'client/scripts/utility/rQueryClient';
import tooltipManager from 'client/scripts/utility/tooltip';

// ----------------- ENUMS/CONSTANTS ---------------------------

let CUSTOMER_NAME = 'customerName',
	STREET_ADDRESS = 'customerAddress',
	CITY = 'customerCity',
	STATE = 'customerState',

	SUBMIT_BUTTON = 'submitButton',

	SUBMISSION_INSTRUCTIONS = 'Please make sure you have the complete address filled out before submitting this form.';

// ----------------- PRIVATE MEMBERS ---------------------------

// Elements
let _validationSet = new Set(),

	_nameField = document.getElementById(CUSTOMER_NAME),
	_addressField = document.getElementById(STREET_ADDRESS),
	_cityField = document.getElementById(CITY),
	_stateField = document.getElementById(STATE),

	_submitButton = document.getElementById(SUBMIT_BUTTON);

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
	viewModel.isFormValid = rQueryClient.validateModel(viewModel, _validationSet);
}

// ----------------- VIEW MODEL DEFINITION -----------------------------

let viewModel = {};

// Customer Name
Object.defineProperty(viewModel, 'name',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__name;
	},

	set: (value) =>
	{
		viewModel.__name = value;

		rQueryClient.setField(_nameField, value);

		_validate();
	}
});

// Customer Address
Object.defineProperty(viewModel, 'address',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__address;
	},

	set: (value) =>
	{
		viewModel.__address = value;

		rQueryClient.setField(_addressField, value, _validationSet);

		_validate();
	}
});

// Customer City
Object.defineProperty(viewModel, 'city',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__city;
	},

	set: (value) =>
	{
		viewModel.__city = value;

		rQueryClient.setField(_cityField, value, _validationSet);

		_validate();
	}
});

// Customer State
Object.defineProperty(viewModel, 'state',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__state;
	},

	set: (value) =>
	{
		viewModel.__state = value;

		rQueryClient.setField(_stateField, value, _validationSet);

		_validate();
	}
});

// Form Validation Flag
Object.defineProperty(viewModel, 'isFormValid',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__isFormValid;
	},

	set: (value) =>
	{
		viewModel.__isFormValid = value;

		if (!(value))
		{
			// Set up a tooltip indicating why the button is disabled
			tooltipManager.setTooltip(_submitButton, SUBMISSION_INSTRUCTIONS);
		}
		else
		{
			tooltipManager.closeTooltip(_submitButton, true);
		}
	}
});