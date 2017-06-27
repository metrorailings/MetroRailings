/**
 * The view model for the page where the user types in his address in order to schedule his estimate
 */

// ----------------- EXTERNAL MODULES --------------------------

import formValidator from 'shared/formValidator';

import rQueryClient from 'client/scripts/utility/rQueryClient';
import tooltipManager from 'client/scripts/utility/tooltip';

// ----------------- ENUM/CONSTANTS -----------------------------

var CUSTOMER_ADDRESS_FIELD = 'streetAddress',
	CUSTOMER_APT_SUITE_NUMBER_FIELD = 'aptSuiteNumber',
	CUSTOMER_CITY_FIELD = 'city',
	CUSTOMER_STATE_FIELD = 'state',
	CUSTOMER_ZIP_CODE_FIELD = 'addressZipCode',

	SUBMISSION_BUTTON = 'estimateSubmissionButton',

	SUBMISSION_INSTRUCTIONS =
	{
		ERROR: 'At least one of the fields above has an erroneous value. Please fix these errors prior to submitting this order.',
		BLANK_FIELD: 'In order to submit this order, please make sure you filled out all the required fields ' +
		'above and please fill in your credit card information as well.'
	},

	ERROR =
	{
		ADDRESS_INVALID: 'Please enter a valid address here. We only tolerate alphabetical characters, numbers, spaces, and periods here.',
		APT_SUITE_INVALID: 'Please enter a valid suite or apartment number here. We can only handle alphabetical characters, numbers, spaces, periods, and dashes here.',
		CITY_INVALID: 'Please enter a valid city name here. We only tolerate alphabetical characters, spaces, dashes, and periods here.',
		ZIP_CODE_INVALID: 'Please enter a five-digit zip code here.'
	};

// ----------------- PRIVATE VARIABLES -----------------------------

var _validationSet = new Set(),

	// Elements
	_streetAddressField = document.getElementById(CUSTOMER_ADDRESS_FIELD),
	_aptSuiteNumberField = document.getElementById(CUSTOMER_APT_SUITE_NUMBER_FIELD),
	_cityField = document.getElementById(CUSTOMER_CITY_FIELD),
	_stateField = document.getElementById(CUSTOMER_STATE_FIELD),
	_addressZipCodeField = document.getElementById(CUSTOMER_ZIP_CODE_FIELD),

	_submissionButton = document.getElementById(SUBMISSION_BUTTON);

// ----------------- PRIVATE FUNCTIONS -----------------------------

/**
 * Generic function for invoking the logic that briefly validates this view model
 *
 * @author kinsho
 */
function _validate()
{
	viewModel.isFormSubmissible = rQueryClient.validateModel(viewModel, _validationSet);
}

// ----------------- VIEW MODEL DEFINITION -----------------------------

var viewModel = {};

// Remember that for form elements that have validation logic, the tooltip to relay errors to the user is attached
// to the span element that follows these input elements

// Customer's address
Object.defineProperty(viewModel, 'customerAddress',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__customerAddress;
	},

	set: (value) =>
	{
		viewModel.__customerAddress = value;

		// Test whether the value is a proper address
		rQueryClient.updateValidationOnField(!(formValidator.isAlphaNumeric(value, ' .')), _streetAddressField, ERROR.ADDRESS_INVALID, _validationSet);
		rQueryClient.setField(_streetAddressField, value, _validationSet);
		_validate();
	}
});

// Customer's apartment/suite number
Object.defineProperty(viewModel, 'customerAptSuiteNumber',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__customerAptSuiteNumber;
	},

	set: (value) =>
	{
		viewModel.__customerAptSuiteNumber = value;

		// Test whether the value is a proper apartment or suite number
		rQueryClient.updateValidationOnField(!(formValidator.isAlphaNumeric(value, ' .-')), _aptSuiteNumberField, ERROR.APT_SUITE_INVALID, _validationSet);
		rQueryClient.setField(_aptSuiteNumberField, value, _validationSet);
		_validate();
	}
});

// Customer's city
Object.defineProperty(viewModel, 'customerCity',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__customerCity;
	},

	set: (value) =>
	{
		viewModel.__customerCity = value;

		// Test whether the value qualifies as a proper city name
		rQueryClient.updateValidationOnField(!(formValidator.isAlphabetical(value, ' .-')) , _cityField, ERROR.CITY_INVALID, _validationSet);
		rQueryClient.setField(_cityField, value, _validationSet);
		_validate();
	}
});

// Customer's state
Object.defineProperty(viewModel, 'customerState',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__customerState;
	},

	set: (value) =>
	{
		viewModel.__customerState = value;

		rQueryClient.setField(_stateField, value, _validationSet);
		_validate();
	}
});

// Customer's zip code
Object.defineProperty(viewModel, 'customerZipCode',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__customerZipCode;
	},

	set: (value) =>
	{
		viewModel.__customerZipCode = value;

		// Test whether the value qualifies as a valid zip code
		var isInvalid = ((value.length && value.length !== 5)) ||
			!(formValidator.isNumeric(value));

		rQueryClient.updateValidationOnField(isInvalid, _addressZipCodeField, ERROR.ZIP_CODE_INVALID, _validationSet);
		rQueryClient.setField(_addressZipCodeField, value, _validationSet);
		_validate();
	}
});

// Form validation flag
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
			tooltipManager.setTooltip(_submissionButton, _validationSet.size ? SUBMISSION_INSTRUCTIONS.ERROR : SUBMISSION_INSTRUCTIONS.BLANK_FIELD);
		}
		else
		{
			tooltipManager.closeTooltip(_submissionButton, true);
		}
	}
});

// ----------------- EXPORT -----------------------------

export default viewModel;