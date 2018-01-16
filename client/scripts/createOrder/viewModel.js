/**
 * The view model for the first step of the order creation process flow
 */

// ----------------- EXTERNAL MODULES --------------------------

import rQueryClient from 'client/scripts/utility/rQueryClient';
import tooltipManager from 'client/scripts/utility/tooltip';

// ----------------- ENUM/CONSTANTS -----------------------------

var DESIGN_METHODOLOGY_CUSTOM = 'designMethodologyCustom',
	DESIGN_METHODOLOGY_PRESET = 'designMethodologyPreset',
	SUBMIT_BUTTON = 'submissionButton',

	SUBMISSION_INSTRUCTIONS = 'Please answer the question above prior to continuing.';

// ----------------- PRIVATE VARIABLES -----------------------------

var _validationSet = new Set(),

	// Elements
	_designMethodologyCustom = document.getElementById(DESIGN_METHODOLOGY_CUSTOM),
	_designMethodologyPreset = document.getElementById(DESIGN_METHODOLOGY_PRESET),
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

Object.defineProperty(viewModel, 'designMethodology',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__designMethodology;
	},

	set: (value) =>
	{
		viewModel.__designMethodology = value;

		_validate();

		if (!(value))
		{
			_designMethodologyCustom.checked = false;
			_designMethodologyPreset.checked = false;
		}
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