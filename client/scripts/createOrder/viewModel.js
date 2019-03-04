/**
 * The view model for the first step of the order creation process flow
 */

// ----------------- EXTERNAL MODULES --------------------------

import rQueryClient from 'client/scripts/utility/rQueryClient';
import tooltipManager from 'client/scripts/utility/tooltip';

// ----------------- ENUM/CONSTANTS -----------------------------

let CURVES_YES_RADIO = 'curvesYes',
	CURVES_NO_RADIO = 'curvesNo',
	BALCONY_YES_RADIO = 'balconyYes',
	BALCONY_NO_RADIO = 'balconyNo',
	DESIGN_METHODOLOGY_PREMIUM = 'designMethodologyPremium',
	DESIGN_METHODOLOGY_BASIC = 'designMethodologyBasic',
	SUBMIT_BUTTON = 'submissionButton',

	SUBMISSION_INSTRUCTIONS = 'Please answer all the questions above prior to designing your railings.';

// ----------------- PRIVATE VARIABLES -----------------------------

let _validationSet = new Set(),

	// Elements
	_curvesYesRadio = document.getElementById(CURVES_YES_RADIO),
	_curvesNoRadio = document.getElementById(CURVES_NO_RADIO),
	_balconyYesRadio = document.getElementById(BALCONY_YES_RADIO),
	_balconyNoRadio = document.getElementById(BALCONY_NO_RADIO),
	_designMethodologyPremium = document.getElementById(DESIGN_METHODOLOGY_PREMIUM),
	_designMethodologyBasic = document.getElementById(DESIGN_METHODOLOGY_BASIC),
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

let viewModel = {};

// Curves Flag
Object.defineProperty(viewModel, 'curvesNecessary',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__curvesNecessary;
	},

	set: (value) =>
	{
		viewModel.__curvesNecessary = value;

		_validate();

		if (!(value))
		{
			_curvesYesRadio.checked = false;
			_curvesNoRadio.checked = false;
		}
	}
});

// Big Order Flag
Object.defineProperty(viewModel, 'balconyOrder',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__balconyOrder;
	},

	set: (value) =>
	{
		viewModel.__balconyOrder = value;

		_validate();

		if (!(value))
		{
			_balconyYesRadio.checked = false;
			_balconyNoRadio.checked = false;
		}
	}
});

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
			_designMethodologyPremium.checked = false;
			_designMethodologyBasic.checked = false;
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