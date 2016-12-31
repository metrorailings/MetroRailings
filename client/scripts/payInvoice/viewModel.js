/**
 * The view model for the invoice page and payment processor
 */

// ----------------- EXTERNAL MODULES --------------------------

import formValidator from 'utility/formValidator';
import axios from 'client/scripts/utility/axios';
import ccAllowed from 'shared/ccAllowed';
import rQueryClient from 'client/scripts/utility/rQueryClient';

// ----------------- ENUM/CONSTANTS -----------------------------

var CUSTOMER_AREA_CODE_FIELD = 'customerPhoneAreaCode',
	CUSTOMER_PHONE_NUMBER_ONE_FIELD = 'customerPhoneNumber1',
	CUSTOMER_PHONE_NUMBER_TWO_FIELD = 'customerPhoneNumber2',
	CUSTOMER_EMAIL_FIELD = 'customerEmail',
	CUSTOMER_NAME_FIELD = 'customerName',

	CUSTOMER_ADDRESS_FIELD = 'streetAddress',
	CUSTOMER_APT_SUITE_NUMBER_FIELD = 'aptSuiteNumber',
	CUSTOMER_CITY_FIELD = 'city',
	CUSTOMER_STATE_FIELD = 'state',
	CUSTOMER_ZIP_CODE_FIELD = 'addressZipCode',

	CREDIT_CARD_TEXTFIELD = 'creditCardNumber',
	SECURITY_CODE_TEXTFIELD = 'securityCode',
	EXPIRATION_MONTH_DROPDOWN = 'expirationDateMonth',
	EXPIRATION_YEAR_DROPDOWN = 'expirationDateYear',
	CREDIT_CARD_ICON_ROW = 'ccMerchantsAccepted',
	CREDIT_CARD_HINT = 'ccNumberHint',

	SUBMISSION_BUTTON = 'orderSubmissionButton',
	SUBMISSION_BUTTON_CONTAINER = 'orderSubmissionButtonContainer',

	SHADE_CLASS = 'shade',

	CC_VALIDATION_URL = 'payInvoice/validateCreditCard',

	SUBMISSION_INSTRUCTIONS = 'In order to submit this order, please make sure you filled out all the required fields ' +
		'above and please fill in your credit card information as well.',

	ERROR =
	{
		NAME_INVALID: 'Please enter your name here. We only tolerate alphabetical characters, spaces, dashes, and apostrophes here.',
		EMAIL_ADDRESS_INVALID: 'Please enter a valid e-mail address here.',
		AREA_CODE_INVALID: 'Please enter a valid three-digit area code here.',
		PHONE_ONE_INVALID: 'Please enter exactly three digits here.',
		PHONE_TWO_INVALID: 'Please enter exactly four digits here.',

		ADDRESS_INVALID: 'Please enter a valid address here. We only tolerate alphabetical characters, numbers, spaces, and periods here.',
		APT_SUITE_INVALID: 'Please enter a valid suite or apartment number here. We can only handle alphabetical characters, numbers, spaces, periods, and dashes here.',
		CITY_INVALID: 'Please enter a valid city name here. We only tolerate alphabetical characters, spaces, dashes, and periods here.',
		ZIP_CODE_INVALID: 'Please enter a five-digit zip code here.',

		CC_NUMBER_INVALID: 'Please enter a valid credit card number. Keep in mind that we only accept Visa, Mastercard, and Discover cards.'
	};

// ----------------- PRIVATE VARIABLES -----------------------------

var _validationSet = new Set(),

	// Elements
	_nameField = document.getElementById(CUSTOMER_NAME_FIELD),
	_areaCodeField = document.getElementById(CUSTOMER_AREA_CODE_FIELD),
	_phoneOneField = document.getElementById(CUSTOMER_PHONE_NUMBER_ONE_FIELD),
	_phoneTwoField = document.getElementById(CUSTOMER_PHONE_NUMBER_TWO_FIELD),
	_emailField = document.getElementById(CUSTOMER_EMAIL_FIELD),

	_streetAddressField = document.getElementById(CUSTOMER_ADDRESS_FIELD),
	_aptSuiteNumberField = document.getElementById(CUSTOMER_APT_SUITE_NUMBER_FIELD),
	_cityField = document.getElementById(CUSTOMER_CITY_FIELD),
	_stateField = document.getElementById(CUSTOMER_STATE_FIELD),
	_addressZipCodeField = document.getElementById(CUSTOMER_ZIP_CODE_FIELD),

	_creditCardIcons = document.getElementById(CREDIT_CARD_ICON_ROW).children,
	_ccNumberHint = document.getElementById(CREDIT_CARD_HINT),
	_ccNumberField = document.getElementById(CREDIT_CARD_TEXTFIELD),
	_ccSecurityCodeField = document.getElementById(SECURITY_CODE_TEXTFIELD),
	_expirationMonthField = document.getElementById(EXPIRATION_MONTH_DROPDOWN),
	_expirationYearField = document.getElementById(EXPIRATION_YEAR_DROPDOWN),

	_submissionButton = document.getElementById(SUBMISSION_BUTTON),
	_submissionButtonContainer = document.getElementById(SUBMISSION_BUTTON_CONTAINER);

// ----------------- PRIVATE FUNCTIONS -----------------------------

/**
 * Function that toggles the opacity of the credit card brand icons depending on the passed value
 *
 * @param {String} [brand] - the brand of the credit card to highlight
 *
 * @author kinsho
 */
function _toggleCCIconOpacity(brand)
{
	for (var i = 0; i < _creditCardIcons.length; i++)
	{
		// In the event that a brand is not passed into this function, simply remove the opacity
		// class from all the icons
		if ( !(brand) || (_creditCardIcons[i].id.toUpperCase().indexOf(brand) > -1))
		{
			_creditCardIcons[i].classList.remove(SHADE_CLASS);
		}
		else
		{
			_creditCardIcons[i].classList.add(SHADE_CLASS);
		}
	}
}

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

// Remember that for form elements that have validation logic, the tooltip to relay errors to the user is attached
// to the span element that follows these input elements

// Customer's name
Object.defineProperty(viewModel, 'customerName',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return this.__customerName;
	},

	set: (value) =>
	{
		value = (value ? value.trim() : '');
		this.__customerName = value;

		var isInvalid = (value.length && !(formValidator.isAlphabetical(value, " '-")));

		rQueryClient.updateValidationOnField(isInvalid, _nameField, ERROR.NAME_INVALID, _validationSet);
		rQueryClient.setField(_nameField, value, _validationSet);
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
		return this.__areaCode;
	},

	set: (value) =>
	{
		this.__areaCode = value;

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
		return this.__phoneOne;
	},

	set: (value) =>
	{
		this.__phoneOne = value;

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
		return this.__phoneTwo;
	},

	set: (value) =>
	{
		this.__phoneTwo = value;

		// Test whether we have a valid area code here
		var isInvalid = ((value.length && value.length !== 4)) ||
			!(formValidator.isNumeric(value));

		rQueryClient.updateValidationOnField(isInvalid, _phoneTwoField, ERROR.PHONE_TWO_INVALID, _validationSet);
		rQueryClient.setField(_phoneTwoField, value, _validationSet);
		_validate();
	}
});

// Customer's e-mail address
Object.defineProperty(viewModel, 'customerEmail',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return this.__customerEmail;
	},

	set: (value) =>
	{
		this.__customerEmail = value;

		// Test whether the value qualifies as an e-mail address
		var isInvalid = (value.length && !(formValidator.isEmail(value)) );

		rQueryClient.updateValidationOnField(isInvalid, _emailField, ERROR.EMAIL_ADDRESS_INVALID, _validationSet);
		rQueryClient.setField(_emailField, value, _validationSet);
		_validate();
	}
});

// Customer's address
Object.defineProperty(viewModel, 'customerAddress',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return this.__customerAddress;
	},

	set: (value) =>
	{
		this.__customerAddress = value;

		// Test whether the value is a proper address
		var isInvalid = (value.length && !(formValidator.isAlphaNumeric(value, ' .')) );

		rQueryClient.updateValidationOnField(isInvalid, _streetAddressField, ERROR.ADDRESS_INVALID, _validationSet);
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
		return this.__customerAptSuiteNumber;
	},

	set: (value) =>
	{
		this.__customerAptSuiteNumber = value;

		// Test whether the value is a proper apartment or suite number
		var isInvalid = (value.length && !(formValidator.isAlphaNumeric(value, ' .-')) );

		rQueryClient.updateValidationOnField(isInvalid, _aptSuiteNumberField, ERROR.APT_SUITE_INVALID, _validationSet);
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
		return this.__customerCity;
	},

	set: (value) =>
	{
		this.__customerCity = value;

		// Test whether the value qualifies as a proper city name
		var isInvalid = (value.length && !(formValidator.isAlphabetical(value, ' .-')) );

		rQueryClient.updateValidationOnField(isInvalid, _cityField, ERROR.CITY_INVALID, _validationSet);
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
		return this.__customerState;
	},

	set: (value) =>
	{
		this.__customerState = value;

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
		return this.__customerZipCode;
	},

	set: (value) =>
	{
		this.__customerZipCode = value;

		// Test whether the value qualifies as a valid zip code
		var isInvalid = ((value.length && value.length !== 5)) ||
						!(formValidator.isNumeric(value));

		rQueryClient.updateValidationOnField(isInvalid, _addressZipCodeField, ERROR.ZIP_CODE_INVALID, _validationSet);
		rQueryClient.setField(_addressZipCodeField, value, _validationSet);
		_validate();
	}
});

// Credit card number
Object.defineProperty(viewModel, 'ccNumber',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return this.__ccNumber;
	},

	set: (value) =>
	{
		this.__ccNumber = value;

		if (value.length >= 6)
		{
			// Validate the credit card number to see if it's acceptable
			axios.get(CC_VALIDATION_URL, { ccNumber : value }).then((data) =>
			{
				// Untangle the data
				data = JSON.parse(data);

				_toggleCCIconOpacity((data && ccAllowed[data.brand]) ? data.brand : '');
				rQueryClient.updateValidationOnField( !(data && ccAllowed[data.brand]), _ccNumberField, ERROR.CC_NUMBER_INVALID, _validationSet, _ccNumberHint);
			});
		}
		else
		{
			_toggleCCIconOpacity('');
			rQueryClient.updateValidationOnField(false, _ccNumberField, ERROR.CC_NUMBER_INVALID, _validationSet, _ccNumberHint);
		}

		rQueryClient.setField(_ccNumberField, value, _validationSet);
		_validate();
	}
});

// Credit card security code
Object.defineProperty(viewModel, 'ccSecurityCode',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return this.__ccSecurityCode;
	},

	set: (value) =>
	{
		this.__ccSecurityCode = value;

		rQueryClient.setField(_ccSecurityCodeField, value, _validationSet);
		_validate();
	}
});

// Credit card expiration month
Object.defineProperty(viewModel, 'ccExpMonth',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return this.__ccExpMonth;
	},

	set: (value) =>
	{
		this.__ccExpMonth = value;

		rQueryClient.setField(_expirationMonthField, value, _validationSet);
		_validate();
	}
});

// Credit card expiration year
Object.defineProperty(viewModel, 'ccExpYear',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return this.__ccExpYear;
	},

	set: (value) =>
	{
		this.__ccExpYear = value;

		rQueryClient.setField(_expirationYearField, value, _validationSet);
		_validate();
	}
});

// Form Validation Flag
Object.defineProperty(viewModel, 'isFormSubmissible',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return this.__isFormSubmissible;
	},

	set: (value) =>
	{
		this.__isFormSubmissible = value;

		_submissionButton.disabled = !value;
		_submissionButtonContainer.dataset.hint = ( !value ? SUBMISSION_INSTRUCTIONS : '' );
	}
});

// ----------------- EXPORT -----------------------------

export default viewModel;