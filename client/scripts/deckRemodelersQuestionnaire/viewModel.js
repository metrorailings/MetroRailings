/**
 * The view model for Deck Remodelers' new customer page
 */

// ----------------- EXTERNAL MODULES --------------------------

import rQueryClient from 'client/scripts/utility/rQueryClient';
import tooltipManager from 'client/scripts/utility/tooltip';

// ----------------- ENUMS/CONSTANTS ---------------------------

let CUSTOMER_NAME = 'customerName',
	PROJECT_MANAGER = 'projectManager',
	STREET_ADDRESS = 'customerAddress',
	CITY = 'customerCity',
	STATE = 'customerState',

	SUBMIT_BUTTON = 'submitButton',

	SUBMISSION_INSTRUCTIONS = 'Please make sure the customer\'s name, a complete address, and a project manager have' +
		' been listed before submitting this form.';

// ----------------- PRIVATE MEMBERS ---------------------------

// Elements
let _validationSet = new Set(),

	_nameField = document.getElementById(CUSTOMER_NAME),
	_managerField = document.getElementById(PROJECT_MANAGER),
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
Object.defineProperty(viewModel, 'customerName',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__name;
	},

	set: (value) =>
	{
		viewModel.__name = value;

		rQueryClient.setField(_nameField, value);
	}
});

// Project Manager
Object.defineProperty(viewModel, 'projectManager',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__propertyManager;
	},

	set: (value) =>
	{
		viewModel.__propertyManager = value;

		rQueryClient.setField(_managerField, value, _validationSet);

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

// Design Details
Object.defineProperty(viewModel, 'design',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__design;
	},

	set: (value) =>
	{
		viewModel.__design = value;
	}
});

// Questions
Object.defineProperty(viewModel, 'questions',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__questions;
	},

	set: (value) =>
	{
		viewModel.__questions = value;
	}
});

// Due Date
Object.defineProperty(viewModel, 'dueDate',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__dueDate;
	},

	set: (value) =>
	{
		viewModel.__dueDate = value;
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

// ----------------- EXPORT -----------------------------

export default viewModel;