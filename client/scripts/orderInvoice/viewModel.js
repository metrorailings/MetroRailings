/**
 * The view model for the custom order invoice page and payment processor
 */

// ----------------- EXTERNAL MODULES --------------------------

import ccAllowed from 'shared/ccAllowed';
import formValidator from 'shared/formValidator';

import rQueryClient from 'client/scripts/utility/rQueryClient';
import tooltipManager from 'client/scripts/utility/tooltip';

// ----------------- ENUM/CONSTANTS -----------------------------

const CUSTOMER_AREA_CODE_FIELD = 'customerPhoneAreaCode',
	CUSTOMER_PHONE_NUMBER_ONE_FIELD = 'customerPhoneNumber1',
	CUSTOMER_PHONE_NUMBER_TWO_FIELD = 'customerPhoneNumber2',
	CUSTOMER_EMAIL_FIELD = 'emailMultitext',
	COMPANY_NAME_FIELD = 'companyName',
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

	SUBMISSION_BUTTON = 'orderSubmissionButton',

	SHADE_CLASS = 'shade',

	SUBMISSION_INSTRUCTIONS =
	{
		ERROR: 'At least one of the fields above has an erroneous value. Please fix these errors prior to submitting this order.',
		BLANK_FIELD: 'In order to submit this order, please make sure you filled out all the required fields ' +
			'above and please fill in your credit card information as well.'
	},

	ERROR =
	{
		EMAIL_ADDRESS_INVALID: 'Please make sure the e-mail address(es) here is valid.',
		AREA_CODE_INVALID: 'Please enter a valid three-digit area code here.',
		PHONE_ONE_INVALID: 'Please enter exactly three digits here.',
		PHONE_TWO_INVALID: 'Please enter exactly four digits here.',

		ZIP_CODE_INVALID: 'Please enter a five-digit zip code here.',

		CC_NUMBER_INVALID: 'Please enter only digits here in the credit card number field.',
		CC_NUMBER_UNACCEPTABLE: 'Please enter a valid credit card number. Keep in mind that we accept Visa, Mastercard, Discover, and Amex cards.',
		CC_SECURITY_CODE_INVALID: 'Please put in a 3 or 4 digit code here.'
	};

// ----------------- PRIVATE VARIABLES -----------------------------

let _validationSet = new Set(),

	// Elements
	_nameField = document.getElementById(CUSTOMER_NAME_FIELD),
	_companyField = document.getElementById(COMPANY_NAME_FIELD),
	_areaCodeField = document.getElementById(CUSTOMER_AREA_CODE_FIELD),
	_phoneOneField = document.getElementById(CUSTOMER_PHONE_NUMBER_ONE_FIELD),
	_phoneTwoField = document.getElementById(CUSTOMER_PHONE_NUMBER_TWO_FIELD),
	_emailField = document.getElementById(CUSTOMER_EMAIL_FIELD),

	_streetAddressField = document.getElementById(CUSTOMER_ADDRESS_FIELD),
	_aptSuiteNumberField = document.getElementById(CUSTOMER_APT_SUITE_NUMBER_FIELD),
	_cityField = document.getElementById(CUSTOMER_CITY_FIELD),
	_stateField = document.getElementById(CUSTOMER_STATE_FIELD),
	_addressZipCodeField = document.getElementById(CUSTOMER_ZIP_CODE_FIELD),

	// Defensive logic should the payment section not be extant on the page
	_creditCardIcons = document.getElementById(CREDIT_CARD_ICON_ROW) ? document.getElementById(CREDIT_CARD_ICON_ROW).children : null,
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
	for (let i = 0; i < _creditCardIcons.length; i++)
	{
		// In the event that a brand is not passed into this function, simply make all the icons fully visible
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
 * @author kinsho
 */
function _validate()
{
	let validated = rQueryClient.validateModel(viewModel, _validationSet);

	// Break out of this validation logic should there be no submission button present on the page
	if ( !(_submissionButton) )
	{
		return null;
	}

	// Ensure all the credit card information has been put into place
	viewModel.isFormSubmissible = (validated && viewModel.ccNumber && viewModel.ccExpMonth && viewModel.ccExpYear && viewModel.ccSecurityCode);
}

// ----------------- VIEW MODEL DEFINITION -----------------------------

let viewModel = {};

// Remember that for form elements with validation logic, the tooltip to relay errors to the user is attached
// to the span element that follows these input elements

// Customer's name
Object.defineProperty(viewModel, 'name',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__customerName;
	},

	set: (value) =>
	{
		// Ensure that the value does not simply consist of spaces
		value = value.trim();
		viewModel.__customerName = value;

		rQueryClient.setField(_nameField, value, _validationSet);
		_validate();
	}
});

// Company name
Object.defineProperty(viewModel, 'company',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__companyName;
	},

	set: (value) =>
	{
		// Ensure that the value does not simply consist of spaces
		value = value.trim();
		viewModel.__companyName = value;

		rQueryClient.setField(_companyField, value);
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

		let isInvalid = ((value.length && value.length !== 3)) ||
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

		let isInvalid = ((value.length && value.length !== 3)) ||
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

		let isInvalid = ((value.length && value.length !== 4)) ||
			!(formValidator.isNumeric(value));

		rQueryClient.updateValidationOnField(isInvalid, _phoneTwoField, ERROR.PHONE_TWO_INVALID, _validationSet);
		rQueryClient.setField(_phoneTwoField, value, _validationSet);
		_validate();
	}
});

// Customer's e-mail address
Object.defineProperty(viewModel, 'email',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__customerEmail;
	},

	set: (value) =>
	{
		// Keep in mind that there may be multiple e-mail addresses inside, split by commas
		let emailAddresses = (value ? value.split(',') : []),
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

		// If no e-mail addresses are present in the field, remove any error signatures associated with the text field
		if ( !(emailAddresses.length) )
		{
			rQueryClient.updateValidationOnField(false, _emailField, ERROR.EMAIL_ADDRESS_INVALID, _validationSet);
		}

		// Recompose the values now that extraneous spaces have been trimmed
		value = emailAddresses.join(',');

		viewModel.__customerEmail = value;

		_validate();
	}
});

// Customer's address
Object.defineProperty(viewModel, 'address',
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
		rQueryClient.setField(_streetAddressField, value, _validationSet);
		_validate();
	}
});

// Customer's apartment/suite number
Object.defineProperty(viewModel, 'aptSuiteNumber',
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
		rQueryClient.setField(_aptSuiteNumberField, value, _validationSet);
		_validate();
	}
});

// Customer's city
Object.defineProperty(viewModel, 'city',
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
		rQueryClient.setField(_cityField, value, _validationSet);
		_validate();
	}
});

// Customer's state
Object.defineProperty(viewModel, 'state',
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
Object.defineProperty(viewModel, 'zipCode',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__customerZipCode;
	},

	set: (value) =>
	{
		viewModel.__customerZipCode = value;

		// Test whether the value qualifies as a valid zip code
		let isInvalid = ((value.length && value.length !== 5)) ||
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
		return viewModel.__ccNumber;
	},

	set: (value) =>
	{
		viewModel.__ccNumber = value;

		// Test whether the value contains any non-numeric character
		let isInvalid = !(formValidator.isNumeric(value));
		rQueryClient.updateValidationOnField(isInvalid, _ccNumberField, ERROR.CC_NUMBER_INVALID, _validationSet);

		// If valid, test whether the credit card number belongs to that of an acceptable brand
		if (!(isInvalid))
		{
			if (value.length >= 6)
			{
				let acceptedBrand = ccAllowed.checkCCNumber(value);

				_toggleCCIconOpacity(acceptedBrand);
				rQueryClient.updateValidationOnField( !(acceptedBrand), _ccNumberField, ERROR.CC_NUMBER_UNACCEPTABLE, _validationSet);
			}
			else
			{
				_toggleCCIconOpacity('');
				rQueryClient.updateValidationOnField(false, _ccNumberField, ERROR.CC_NUMBER_UNACCEPTABLE, _validationSet);
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
		return viewModel.__ccSecurityCode;
	},

	set: (value) =>
	{
		viewModel.__ccSecurityCode = value;

		// Test whether the value qualifies as a valid security code
		let isInvalid = (value.length && (value.length < 3 || value.length > 4)) ||
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
		return viewModel.__ccExpMonth;
	},

	set: (value) =>
	{
		viewModel.__ccExpMonth = value;

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
		return viewModel.__ccExpYear;
	},

	set: (value) =>
	{
		viewModel.__ccExpYear = value;

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