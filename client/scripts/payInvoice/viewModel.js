/**
 * The view model for the invoice page and payment processor
 */

// ----------------- EXTERNAL MODULES --------------------------

import ccAllowed from 'shared/ccAllowed';

import formValidator from 'utility/formValidator';
import rQueryClient from 'client/scripts/utility/rQueryClient';
import scrollDown from 'client/scripts/utility/scrollDown';
import tooltipManager from 'client/scripts/utility/tooltip';

// ----------------- ENUM/CONSTANTS -----------------------------

var ORDER_FORM = 'orderForm',
	AGREED_RADIO = 'agreedToTerms',

	CUSTOMER_AREA_CODE_FIELD = 'customerPhoneAreaCode',
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

	SHADE_CLASS = 'shade',
	REVEAL_CLASS = 'reveal',

	SUBMISSION_INSTRUCTIONS =
	{
		ERROR: 'At least one of the fields above has an erroneous value. Please fix these errors prior to submitting this order.',
		BLANK_FIELD: 'In order to submit this order, please make sure you filled out all the required fields ' +
			'above and please fill in your credit card information as well.'
	},

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

		CC_NUMBER_INVALID: 'Please enter only digits here in the credit card number field.',
		CC_NUMBER_UNACCEPTABLE: 'Please enter a valid credit card number. Keep in mind that we only accept Visa, Mastercard, and Discover cards.',
		CC_SECURITY_CODE_INVALID: 'Please put in a 3 or 4 digit code here.'
	};

// ----------------- PRIVATE VARIABLES -----------------------------

var _validationSet = new Set(),

	// Elements
	_orderForm = document.getElementById(ORDER_FORM),
	_agreedRadio = document.getElementById(AGREED_RADIO),

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

	_submissionButton = document.getElementById(SUBMISSION_BUTTON);

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
		if ( !(brand) || (_creditCardIcons[i].id.toLowerCase().indexOf(brand) > -1) )
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

// Agreed to agreement flag
Object.defineProperty(viewModel, 'agreedToTerms',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return this.__agreedToTerms;
	},

	set: (value) =>
	{
		this.__agreedToTerms = value;

		_agreedRadio.checked = value;

		// Once the user has agreed to the terms, show the rest of the order form
		if (value)
		{
			_orderForm.classList.add(REVEAL_CLASS);

			window.setTimeout(() =>
			{
				scrollDown.showAlert(_areaCodeField);
			}, 250);
		}
	}
});

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
		// Ensure that the value does not simply consist of spaces
		value = (value.trim() ? value : '');
		this.__customerName = value;

		rQueryClient.updateValidationOnField(!(formValidator.isAlphabetical(value, " '-")), _nameField, ERROR.NAME_INVALID, _validationSet);
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
		rQueryClient.updateValidationOnField(!(formValidator.isEmail(value)), _emailField, ERROR.EMAIL_ADDRESS_INVALID, _validationSet);
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
		return this.__customerAptSuiteNumber;
	},

	set: (value) =>
	{
		this.__customerAptSuiteNumber = value;

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
		return this.__customerCity;
	},

	set: (value) =>
	{
		this.__customerCity = value;

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

		// Test whether the value contains any non-numeric character
		var isInvalid = !(formValidator.isNumeric(value));
		rQueryClient.updateValidationOnField(isInvalid, _ccNumberField, ERROR.CC_NUMBER_INVALID, _validationSet, _ccNumberHint);

		// If valid, test whether the credit card number belongs to that of an acceptable brand
		if (!(isInvalid))
		{
			if (value.length >= 6)
			{
				var acceptedBrand = ccAllowed.checkCCNumber(value);

				_toggleCCIconOpacity(acceptedBrand);
				rQueryClient.updateValidationOnField( !(acceptedBrand), _ccNumberField, ERROR.CC_NUMBER_UNACCEPTABLE, _validationSet, _ccNumberHint);
			}
			else
			{
				_toggleCCIconOpacity('');
				rQueryClient.updateValidationOnField(false, _ccNumberField, ERROR.CC_NUMBER_UNACCEPTABLE, _validationSet, _ccNumberHint);
			}
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

		// Test whether the value qualifies as a valid security code
		var isInvalid = (value.length && (value.length < 3 || value.length > 4)) ||
			!(formValidator.isNumeric(value));

		rQueryClient.updateValidationOnField(isInvalid, _ccSecurityCodeField, ERROR.CC_SECURITY_CODE_INVALID, _validationSet);
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

// Form validation flag
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

		// Set the look of the button depending on whether there are any errors on the form
		_submissionButton.disabled = !(value);

		if (!(value))
		{
			tooltipManager.changeTextInTooltip(_submissionButton, _validationSet.size ? SUBMISSION_INSTRUCTIONS.ERROR : SUBMISSION_INSTRUCTIONS.BLANK_FIELD);
		}
		else
		{
			tooltipManager.closeTooltip(_submissionButton, true);
		}
	}
});

// ----------------- EXPORT -----------------------------

export default viewModel;