/**
 * The view model for the third step of the estimate process flow
 */

// ----------------- EXTERNAL MODULES --------------------------

import rQueryClient from 'client/scripts/utility/rQueryClient';
import tooltipManager from 'client/scripts/utility/tooltip';

import formValidator from 'shared/formValidator';

// ----------------- ENUM/CONSTANTS -----------------------------

var FROM_FOOTAGE_TEXT_AREA = 'fromFootage',
	TO_FOOTAGE_TEXT_AREA = 'toFootage',
	SUBMIT_BUTTON = 'submissionButton',

	LENGTH_VALUE_INVALID = 'Please put a whole number in here.',
	SUBMISSION_INSTRUCTIONS = 'Please put in a valid length range above prior to moving to the last step of this' +
		' process.';

// ----------------- PRIVATE VARIABLES -----------------------------

var _validationSet = new Set(),

	// Elements
	_fromFootageField = document.getElementById(FROM_FOOTAGE_TEXT_AREA),
	_toFootageField = document.getElementById(TO_FOOTAGE_TEXT_AREA),
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
	viewModel.isFormSubmissible = rQueryClient.validateModel(viewModel, _validationSet);
}

// ----------------- VIEW MODEL DEFINITION -----------------------------

var viewModel = {};

// Beginning of Length Range
Object.defineProperty(viewModel, 'fromFeet',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__fromFeet;
	},

	set: (value) =>
	{
		viewModel.__fromFeet = value;

		// Test whether the value qualifies as a valid whole number
		var isInvalid = (value && !(formValidator.isNumeric(value, '', true)));

		rQueryClient.updateValidationOnField(isInvalid, _fromFootageField, LENGTH_VALUE_INVALID, _validationSet);
		rQueryClient.setField(_fromFootageField, value, _validationSet);

		_validate();
	}
});

// End of Length Range
Object.defineProperty(viewModel, 'toFeet',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__toFeet;
	},

	set: (value) =>
	{
		viewModel.__toFeet = value;

		// Test whether the value qualifies as a valid whole number
		var isInvalid = (value && !(formValidator.isNumeric(value, '', true)));

		rQueryClient.updateValidationOnField(isInvalid, _toFootageField, LENGTH_VALUE_INVALID, _validationSet);
		rQueryClient.setField(_toFootageField, value, _validationSet);

		_validate();
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