/**
 * The view model for the order details page
 */

// ----------------- EXTERNAL MODULES --------------------------

import rQueryClient from 'client/scripts/utility/rQueryClient';
import tooltipManager from 'client/scripts/utility/tooltip';

import formValidator from 'shared/formValidator';

// ----------------- ENUM/CONSTANTS -----------------------------

var CUSTOMER_NAME_TEXTFIELD = 'customerName',
	CUSTOMER_EMAIL_TEXTFIELD = 'customerEmail',
	AREA_CODE_TEXTFIELD = 'areaCode',
	PHONE_ONE_TEXTFIELD = 'phoneOne',
	PHONE_TWO_TEXTFIELD = 'phoneTwo',

	ADDRESS_TEXTFIELD = 'address',
	APT_SUITE_NO_TEXTFIELD = 'aptSuiteNo',
	CITY_TEXTFIELD = 'city',
	STATE_SELECT = 'state',
	ZIP_CODE_TEXTFIELD = 'zipCode',

	COVER_PLATES_BUTTONS = 'coverPlates',

	ORDER_LENGTH_TEXTFIELD = 'orderLength',
	FINISHED_HEIGHT_TEXTFIELD = 'finishedHeight',
	PRICE_PER_FOOT_TEXTFIELD = 'pricePerFoot',
	ADDITIONAL_FEATURES_TEXTAREA = 'additionalFeatures',
	ADDITIONAL_PRICE_TEXTFIELD = 'additionalPrice',
	DEDUCTIONS_TEXTFIELD = 'deductions',

	SAVE_AND_CONTINUE_BUTTON = 'saveAndContinue',
	SAVE_AND_EXIT_BUTTON = 'saveAndExit',

	SUBMISSION_INSTRUCTIONS =
	{
		ERROR: 'At least one of the fields above has an erroneous value. Please fix the errors first.',
		BLANK_FIELD: 'At least one of the fields above has been left empty. Every field that is not ' +
			'tinted blue has to be populated.'
	},

	ERROR =
	{
		NAME_INVALID: 'Please enter a a valid name consisting only of alphabetical characters, apostrophes, spaces, and dashes.',
		EMAIL_ADDRESS_INVALID: 'Please enter a valid e-mail address here.',
		AREA_CODE_INVALID: 'Please enter a valid three-digit area code here.',
		PHONE_ONE_INVALID: 'Please enter exactly three digits here.',
		PHONE_TWO_INVALID: 'Please enter exactly four digits here.',

		ZIP_CODE_INVALID: 'Please enter a five-digit zip code here.',

		LENGTH_INVALID: 'Please enter a non-zero length here.',
		TOTAL_INVALID: 'Please enter a valid dollar amount here.'
	};

// ----------------- PRIVATE VARIABLES -----------------------------

var _validationSet = new Set(),

	// Elements
	_nameField = document.getElementById(CUSTOMER_NAME_TEXTFIELD),
	_emailField = document.getElementById(CUSTOMER_EMAIL_TEXTFIELD),
	_areaCodeField = document.getElementById(AREA_CODE_TEXTFIELD),
	_phoneOneField = document.getElementById(PHONE_ONE_TEXTFIELD),
	_phoneTwoField = document.getElementById(PHONE_TWO_TEXTFIELD),

	_addressField = document.getElementById(ADDRESS_TEXTFIELD),
	_aptSuiteNoField = document.getElementById(APT_SUITE_NO_TEXTFIELD),
	_cityField = document.getElementById(CITY_TEXTFIELD),
	_stateField = document.getElementById(STATE_SELECT),
	_zipCodeField = document.getElementById(ZIP_CODE_TEXTFIELD),

	_coverPlateButtons = document.getElementsByName(COVER_PLATES_BUTTONS),

	_orderLengthField = document.getElementById(ORDER_LENGTH_TEXTFIELD),
	_finishedHeightField = document.getElementById(FINISHED_HEIGHT_TEXTFIELD),
	_additionalFeaturesField = document.getElementById(ADDITIONAL_FEATURES_TEXTAREA),
	_pricePerFootField = document.getElementById(PRICE_PER_FOOT_TEXTFIELD),
	_additionalPriceField = document.getElementById(ADDITIONAL_PRICE_TEXTFIELD),
	_deductionsField = document.getElementById(DEDUCTIONS_TEXTFIELD),

	_saveAndContinueButton = document.getElementById(SAVE_AND_CONTINUE_BUTTON),
	_saveAndExitButton = document.getElementById(SAVE_AND_EXIT_BUTTON);

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
	viewModel.isFormValid = (rQueryClient.validateModel(viewModel, _validationSet)) && _isProperDesign();
}

/**
 * Function meant to check to see if the design selections have been legitimately made
 *
 * @returns {boolean} - indicating whether the design selections are valid
 *
 * @author kinsho
 */
function _isProperDesign()
{
	return (viewModel.design.post &&
			viewModel.design.handrailing &&
			viewModel.design.picket &&
			viewModel.design.color);
}

// ----------------- VIEW MODEL DEFINITION -----------------------------

var viewModel = {};

// Customer Name
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
		viewModel.__name = value;

		// Test whether the value qualifies as a valid name
		var isInvalid = (value.length && !(formValidator.isAlphabetical(value, ' \'-')) );

		rQueryClient.updateValidationOnField(isInvalid, _nameField, ERROR.NAME_INVALID, _validationSet);
		rQueryClient.setField(_nameField, value, _validationSet);

		_validate();
	}
});


// Customer Email
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
		viewModel.__email = value;

		// Test whether the value qualifies as an e-mail address
		var isInvalid = (value.length && !(formValidator.isEmail(value)) );

		rQueryClient.updateValidationOnField(isInvalid, _emailField, ERROR.EMAIL_ADDRESS_INVALID, _validationSet);
		rQueryClient.setField(_emailField, value, _validationSet);

		_validate();
	}
});

// Customer's area code
Object.defineProperty(viewModel, 'areaCode',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__areaCode;
	},

	set: (value) =>
	{
		viewModel.__areaCode = value;

		// Test whether we have a valid area code here
		var isInvalid = ((value.length && value.length !== 3)) ||
			!(formValidator.isNumeric(value));

		rQueryClient.updateValidationOnField(isInvalid, _areaCodeField, ERROR.AREA_CODE_INVALID, _validationSet);
		rQueryClient.setField(_areaCodeField, value, _validationSet);

		_validate();
	}
});

// Customer's phone number (first three digits)
Object.defineProperty(viewModel, 'phoneOne',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__phoneOne;
	},

	set: (value) =>
	{
		viewModel.__phoneOne = value;

		// Test whether we have a valid area code here
		var isInvalid = ((value.length && value.length !== 3)) ||
			!(formValidator.isNumeric(value));

		rQueryClient.updateValidationOnField(isInvalid, _phoneOneField, ERROR.PHONE_ONE_INVALID, _validationSet);
		rQueryClient.setField(_phoneOneField, value, _validationSet);

		_validate();
	}
});

// Customer's phone number (last four digits)
Object.defineProperty(viewModel, 'phoneTwo',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__phoneTwo;
	},

	set: (value) =>
	{
		viewModel.__phoneTwo = value;

		// Test whether we have a valid area code here
		var isInvalid = ((value.length && value.length !== 4)) ||
			!(formValidator.isNumeric(value));

		rQueryClient.updateValidationOnField(isInvalid, _phoneTwoField, ERROR.PHONE_TWO_INVALID, _validationSet);
		rQueryClient.setField(_phoneTwoField, value, _validationSet);

		_validate();
	}
});

// Address
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

		rQueryClient.setField(_addressField, value);

		_validate();
	}
});

// Apartment Number / Suite Number
Object.defineProperty(viewModel, 'aptSuiteNo',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__aptSuiteNo;
	},

	set: (value) =>
	{
		viewModel.__aptSuiteNo = value;

		rQueryClient.setField(_aptSuiteNoField, value);

		_validate();
	}
});

// City
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

		rQueryClient.setField(_cityField, value);

		_validate();
	}
});

// State
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

			rQueryClient.setField(_stateField, value);
		}
	});

// Zip Code
Object.defineProperty(viewModel, 'zipCode',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__zipCode;
	},

	set: (value) =>
	{
		viewModel.__zipCode = value;

		// Test whether the value qualifies as a valid zip code
		var isInvalid = ((value.length && value.length !== 5)) ||
			!(formValidator.isNumeric(value));

		rQueryClient.updateValidationOnField(isInvalid, _zipCodeField, ERROR.ZIP_CODE_INVALID, _validationSet);
		rQueryClient.setField(_zipCodeField, value, _validationSet);

		_validate();
	}
});

// Railings Design
Object.defineProperty(viewModel, 'design',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__design;
	},

	set: (value) =>
	{
		viewModel.__design = value;
	}
});

// Flag indicating whether cover plates are needed
Object.defineProperty(viewModel, 'coverPlates',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__coverPlates;
	},

	set: (value) =>
	{
		viewModel.__coverPlates = !!(value);

		if (value)
		{
			_coverPlateButtons[0].checked = true;
		}
		else
		{
			_coverPlateButtons[1].checked = true;
		}
	}
});

// Platform Type
Object.defineProperty(viewModel, 'platformType',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__platformType;
	},

	set: (value) =>
	{
		viewModel.__platformType = value;
	}
});

// Order Length
Object.defineProperty(viewModel, 'length',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__length;
	},

	set: (value) =>
	{
		viewModel.__length = value;

		// Make sure a valid length is being set here
		var isInvalid = !(formValidator.isNumeric(value)) ||
			(value.length && !(window.parseInt(value, 10)));

		rQueryClient.updateValidationOnField(isInvalid, _orderLengthField, ERROR.LENGTH_INVALID, _validationSet);
		rQueryClient.setField(_orderLengthField, value);

		_validate();
	}
});

// The height of the railings
Object.defineProperty(viewModel, 'finishedHeight',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__finishedHeight;
	},

	set: (value) =>
	{
		viewModel.__finishedHeight = value;

		// Make sure a valid length is being set here
		var isInvalid = !(formValidator.isNumeric(value)) ||
			(value.length && !(window.parseInt(value, 10)));

		rQueryClient.updateValidationOnField(isInvalid, _finishedHeightField, ERROR.LENGTH_INVALID, _validationSet);
		rQueryClient.setField(_finishedHeightField, value);

		_validate();
	}
});

// Price Per Foot
Object.defineProperty(viewModel, 'pricePerFoot',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__orderTotal;
	},

	set: (value) =>
	{
		viewModel.__orderTotal = value;

		// Make sure a valid total price is being set here
		var isInvalid = !(formValidator.isNumeric(value, '.')) ||
			(value.length && !(window.parseFloat(value, 10)) ) ||
			(value.length && value.split('.').length > 2);

		rQueryClient.updateValidationOnField(isInvalid, _pricePerFootField, ERROR.TOTAL_INVALID, _validationSet);
		rQueryClient.setField(_pricePerFootField, value);

		_validate();
	}
});

// Custom Features
Object.defineProperty(viewModel, 'additionalFeatures',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__additionalFeatures;
	},

	set: (value) =>
	{
		viewModel.__additionalFeatures = value;

		rQueryClient.setField(_additionalFeaturesField, value);

		_validate();
	}
});

// Price for Custom Features
Object.defineProperty(viewModel, 'additionalPrice',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__additionalPrice;
	},

	set: (value) =>
	{
		viewModel.__additionalPrice = value;

		// Make sure a valid total price is being set here
		var isInvalid = !(formValidator.isNumeric(value, '.')) ||
			(value.length && !(window.parseFloat(value, 10)) ) ||
			(value.length && value.split('.').length > 2);

		rQueryClient.updateValidationOnField(isInvalid, _additionalPriceField, ERROR.TOTAL_INVALID, _validationSet);
		rQueryClient.setField(_additionalPriceField, value);

		_validate();
	}
});

// Order-specific notes
Object.defineProperty(viewModel, 'notes',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__notes;
	},

	set: (value) =>
	{
		viewModel.__notes = value;
	}
});

// Deductions
Object.defineProperty(viewModel, 'deductions',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__deductions;
	},

	set: (value) =>
	{
		viewModel.__deductions = value;

		// Make sure a valid total price is being set here
		var isInvalid = !(formValidator.isNumeric(value, '.')) ||
			(value.length && !(window.parseFloat(value, 10)) ) ||
			(value.length && value.split('.').length > 2);

		rQueryClient.updateValidationOnField(isInvalid, _deductionsField, ERROR.TOTAL_INVALID, _validationSet);
		rQueryClient.setField(_deductionsField, value);

		_validate();
	}
});

// Agreement Text
Object.defineProperty(viewModel, 'agreement',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__agreement;
	},

	set: (value) =>
	{
		viewModel.__agreement = value;

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
			// Set up a tooltip indicating why the buttons are disabled
			tooltipManager.setTooltip(_saveAndContinueButton, _validationSet.size ? SUBMISSION_INSTRUCTIONS.ERROR : SUBMISSION_INSTRUCTIONS.BLANK_FIELD);
			tooltipManager.setTooltip(_saveAndExitButton, _validationSet.size ? SUBMISSION_INSTRUCTIONS.ERROR : SUBMISSION_INSTRUCTIONS.BLANK_FIELD);
		}
		else
		{
			tooltipManager.closeTooltip(_saveAndContinueButton, true);
			tooltipManager.closeTooltip(_saveAndExitButton, true);
		}
	}
});

// Publicly expose the validate method
viewModel.validate = _validate;

// ----------------- EXPORT -----------------------------

export default viewModel;