/**
 * The view model for the create price chart page
 */

// ----------------- EXTERNAL MODULES --------------------------

import formValidator from 'shared/formValidator';
import rQueryClient from 'client/scripts/utility/rQueryClient';
import tooltipManager from 'client/scripts/utility/tooltip';

// ----------------- ENUM/CONSTANTS -----------------------------

var COMPANY_NAME_TEXTFIELD = 'companyName',
	CUSTOM_CHART_SUBMIT_BUTTON = 'priceChartSubmit',

	VALIDATE_OPTION_LISTENER = 'validateOptionVM',

	ERROR =
	{
		COMPANY_NAME_INVALID: 'Please enter the company\'s name here.'
	},

	SUBMISSION_INSTRUCTIONS =
	{
		CANNOT_SUBMIT: 'Please scroll back up and make sure you entered all the information that needs to be entered' +
			' to properly generate a chart.'
	};

// ----------------- PRIVATE VARIABLES -----------------------------

var _validationSet = new Set(),

	// Elements
	_companyNameField = document.getElementById(COMPANY_NAME_TEXTFIELD),

	_submitButton = document.getElementById(CUSTOM_CHART_SUBMIT_BUTTON);

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
		// Then check to see if there's at least one product option listed on the chart
		if (viewModel.options.length)
		{
			// Now run through each product option on the invoice to assure that it has been properly defined
			for (let i = 0; i < viewModel.options.length; i++)
			{
				if (!(viewModel.options[i].validItem))
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

// Recipient Name
Object.defineProperty(viewModel, 'companyName',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__companyName;
	},

	set: (value) =>
	{
		// Ensure that the value does not simply consist of spaces
		value = (value ? value.trim() : '');
		viewModel.__companyName = value;

		rQueryClient.updateValidationOnField(!!(value), _companyNameField, ERROR.COMPANY_NAME_INVALID, _validationSet);
		rQueryClient.setField(_companyNameField, value);
	}
});

// Product options on this price chart
Object.defineProperty(viewModel, 'options',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__options;
	},

	set: (value) =>
	{
		viewModel.__options = value;
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

// Set up a listener that would allow us to trigger validation logic from within the options models
document.addEventListener(VALIDATE_OPTION_LISTENER, _validate);

// ----------------- EXPORT -----------------------------

export default viewModel;