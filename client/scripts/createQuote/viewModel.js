/**
 * The view model for the invoice creation page
 */

// ----------------- EXTERNAL MODULES --------------------------

import rQueryClient from 'client/scripts/utility/rQueryClient';
import tooltipManager from 'client/scripts/utility/tooltip';

import formValidator from 'shared/formValidator';
import pricing from 'shared/pricing/pricingData';

import designModel from 'client/scripts/createQuote/designViewModel';

// ----------------- ENUM/CONSTANTS -----------------------------

var CUSTOMER_EMAIL_TEXTFIELD = 'customerEmail',
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

	ORDER_SUBTOTAL_DISPLAY = 'orderSubtotalDisplay',
	ORDER_TAX_DISPLAY = 'orderTaxDisplay',
	ORDER_TARIFF_DISPLAY = 'orderTariffDisplay',
	APPLY_TAXES_BUTTONSET = 'applyTaxesButtonSet',
	APPLY_TARIFF_BUTTONSET = 'applyTariffButtonSet',

	SAVE_BUTTON = 'saveButton',

	DISABLED_CLASS = 'disabled',

	STATE_NJ_VALUE = 'NJ',

	SUBMISSION_INSTRUCTIONS =
	{
		ERROR: 'At least one of the fields above has an erroneous value. Please fix the errors first.',
		BLANK_FIELD: 'At least one of the fields above has been left empty. Every field that is not ' +
			'tinted blue has to be populated.'
	},

	ERROR =
	{
		EMAIL_ADDRESS_INVALID: 'Please enter only valid e-mail addresses here.',
		AREA_CODE_INVALID: 'Please enter a valid three-digit area code here.',
		PHONE_ONE_INVALID: 'Please enter exactly three digits here.',
		PHONE_TWO_INVALID: 'Please enter exactly four digits here.',

		ZIP_CODE_INVALID: 'Please enter a five-digit zip code here.',

		WHOLE_NUMBER_INVALID: 'Please enter a non-zero number here.',
		TOTAL_INVALID: 'Please enter a valid dollar amount here.'
	};

// ----------------- PRIVATE VARIABLES -----------------------------

var _validationSet = new Set(),

	// Elements
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

	_subtotalDisplay = document.getElementById(ORDER_SUBTOTAL_DISPLAY),
	_taxDisplay = document.getElementById(ORDER_TAX_DISPLAY),
	_tariffDisplay = document.getElementById(ORDER_TARIFF_DISPLAY),
	_chargeTaxButtons = document.getElementById(APPLY_TAXES_BUTTONSET),
	_chargeTariffButtons = document.getElementById(APPLY_TARIFF_BUTTONSET),

	_saveButton = document.getElementById(SAVE_BUTTON);

// ----------------- PRIVATE FUNCTIONS -----------------------------

/**
 * Slightly specialized function for invoking the logic that validates this view model
 * Function is specialized in that it checks to see whether certain designs were specified as well
 *
 * @returns {boolean} - indicating whether this view model has been validated
 *
 * @author kinsho
 */
function _validate()
{
	var designsSelected = !!(viewModel.design && viewModel.design.post);

	viewModel.isFormValid = rQueryClient.validateModel(viewModel, _validationSet) && designsSelected;
}

/**
 * Function meant to calculate the subtotal of the order
 *
 * @author kinsho
 */
function _calculateSubTotal()
{
	var subTotal = 0;

	if (viewModel.length && viewModel.pricePerFoot)
	{
		subTotal = window.parseInt(viewModel.length, 10) * window.parseFloat(viewModel.pricePerFoot);
	}
	if (viewModel.additionalPrice)
	{
		subTotal += window.parseFloat(viewModel.additionalPrice);
	}
	if (viewModel.deductions)
	{
		subTotal -= window.parseFloat(viewModel.deductions);
	}

	viewModel.subtotal = formValidator.isNumeric(subTotal + '') ? subTotal : 0;
}

/**
 * Function meant to update the tariffs and taxes displayed on the order
 *
 * @author kinsho
 */
function _updateTariffAndTaxDisplays()
{
	if (viewModel.applyTaxes && viewModel.state === STATE_NJ_VALUE)
	{
		_taxDisplay.innerHTML = '$' + (viewModel.subtotal * pricing.NJ_SALES_TAX_RATE).toFixed(2);
	}
	else
	{
		_taxDisplay.innerHTML = '$0.00';
	}

	if (viewModel.applyTariffs)
	{
		_tariffDisplay.innerHTML = '$' + (viewModel.subtotal * pricing.TARIFF_RATE).toFixed(2);
	}
	else
	{
		_tariffDisplay.innerHTML = '$0.00';
	}
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

		_validate();
	}
});

// Company Name
Object.defineProperty(viewModel, 'company',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__company;
	},

	set: (value) =>
	{
		viewModel.__company = value;
	}
});

// Customer Email(s)
Object.defineProperty(viewModel, 'email',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__email;
	},

	set: (value) =>
	{
		// Keep in mind that there may be multiple e-mail addresses inside, split by commas
		var emailAddresses = (value ? value.split(',') : []),
			isValid;

		for (let i = 0; i < emailAddresses.length; i++)
		{
			// Trim out any extraneous spaces around the e-mail address being tested
			emailAddresses[i] = emailAddresses[i].trim();

			// Test whether the e-mail address is valid
			isValid = formValidator.isEmail(emailAddresses[i]);

			// Toggle the field's appearance depending on whether we have an invalid e-mail address present
			rQueryClient.updateValidationOnField( !(isValid), _emailField, ERROR.EMAIL_ADDRESS_INVALID, _validationSet);

			// If an invalid value is present, just exit the processing logic
			if ( !(isValid) )
			{
				break;
			}
		}

		// Recompose the values now that extraneous spaces have been trimmed
		value = emailAddresses.join(',');

		rQueryClient.setField(_emailField, value, _validationSet);
		viewModel.__email = value;

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

		// For all orders outside the state, there is no need to charge tax
		if (value !== STATE_NJ_VALUE)
		{
			viewModel.applyTaxes = false;
		}
		else
		{
			// Set to true in case an idiot salesman forgets to reset taxes here
			viewModel.applyTaxes = true;
		}

		_updateTariffAndTaxDisplays();
	}
});

// Zip Code
Object.defineProperty(viewModel, 'zipCode',
{
	configurable: false,
	enumerable: false,

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

		rQueryClient.updateValidationOnField(isInvalid, _orderLengthField, ERROR.WHOLE_NUMBER_INVALID, _validationSet);
		rQueryClient.setField(_orderLengthField, value);

		_validate();
		_calculateSubTotal();
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

		rQueryClient.updateValidationOnField(isInvalid, _finishedHeightField, ERROR.WHOLE_NUMBER_INVALID, _validationSet);
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
		_calculateSubTotal();
	}
});

// Custom Features
Object.defineProperty(viewModel, 'additionalDescription',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__additionalDescription;
	},

	set: (value) =>
	{
		viewModel.__additionalDescription = value;

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
		_calculateSubTotal();
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

// Order Subtotal
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

		_subtotalDisplay.innerHTML = '$' + value.toFixed(2);

		_updateTariffAndTaxDisplays();
	}
});

// Taxes Flag
Object.defineProperty(viewModel, 'applyTaxes',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__applyTaxes;
	},

	set: (value) =>
	{
		viewModel.__applyTaxes = value;

		rQueryClient.setToggleField(_chargeTaxButtons.getElementsByTagName('input'), value);

		// Disable the inputs entirely if the project takes place outside of New Jersey
		if (viewModel.state !== STATE_NJ_VALUE)
		{
			rQueryClient.disableToggleField(_chargeTaxButtons.getElementsByTagName('input'));
			_chargeTaxButtons.classList.add(DISABLED_CLASS);
		}
		else
		{
			rQueryClient.enableToggleField(_chargeTaxButtons.getElementsByTagName('input'));
			_chargeTaxButtons.classList.remove(DISABLED_CLASS);
		}

		_updateTariffAndTaxDisplays();
	}
});

// Tariffs Flag
Object.defineProperty(viewModel, 'applyTariffs',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__applyTariffs;
	},

	set: (value) =>
	{
		viewModel.__applyTariffs = value;

		rQueryClient.setToggleField(_chargeTariffButtons.getElementsByTagName('input'), value);
		_updateTariffAndTaxDisplays();
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
			tooltipManager.setTooltip(_saveButton, _validationSet.size ? SUBMISSION_INSTRUCTIONS.ERROR : SUBMISSION_INSTRUCTIONS.BLANK_FIELD);
		}
		else
		{
			tooltipManager.closeTooltip(_saveButton, true);
		}
	}
});

// Initialize some of the values
viewModel.design = new designModel();
viewModel.designDescriptions = new designModel();
viewModel.installation = {};
viewModel.notes = {};

// ----------------- EXPORT -----------------------------

export default viewModel;