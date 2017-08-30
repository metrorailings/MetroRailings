/**
 * The view model for the prospect details page
 */

// ----------------- EXTERNAL MODULES --------------------------

import rQueryClient from 'client/scripts/utility/rQueryClient';
import tooltipManager from 'client/scripts/utility/tooltip';

import formValidator from 'shared/formValidator';

// ----------------- ENUM/CONSTANTS -----------------------------

var PROSPECT_NOTES_TEXT_AREA = 'prospectNotes',

	CUSTOMER_EMAIL_TEXTFIELD = 'customerEmail',
	AREA_CODE_TEXTFIELD = 'areaCode',
	PHONE_ONE_TEXTFIELD = 'phoneOne',
	PHONE_TWO_TEXTFIELD = 'phoneTwo',

	ADDRESS_TEXTFIELD = 'address',
	APT_SUITE_NO_TEXTFIELD = 'aptSuiteNo',
	CITY_TEXTFIELD = 'city',
	STATE_SELECT = 'state',
	ZIP_CODE_TEXTFIELD = 'zipCode',

	SAVE_CHANGES_BUTTON = 'saveChangesButton',

	REVEAL_CLASS = 'reveal',
	DATA_GROUPING_CLASS = 'dataGrouping',
	FA_TAG_CLASS = 'fa-tag',


	SUBMISSION_INSTRUCTIONS =
	{
		ERROR: 'At least one of the fields above has an erroneous value. Please fix the errors first.',
		BLANK_FIELD: 'At least one of the fields above has been left empty. Every field that is not ' +
		'tinted blue has to be populated.'
	},

	ERROR =
	{
		EMAIL_ADDRESS_INVALID: 'Please enter a valid e-mail address here.',
		AREA_CODE_INVALID: 'Please enter a valid three-digit area code here.',
		PHONE_ONE_INVALID: 'Please enter exactly three digits here.',
		PHONE_TWO_INVALID: 'Please enter exactly four digits here.',

		ZIP_CODE_INVALID: 'Please enter a five-digit zip code here.'
	};

// ----------------- PRIVATE VARIABLES -----------------------------

var _validationSet = new Set(),

	// Elements
	_notesField = document.getElementById(PROSPECT_NOTES_TEXT_AREA),

	_emailField = document.getElementById(CUSTOMER_EMAIL_TEXTFIELD),
	_areaCodeField = document.getElementById(AREA_CODE_TEXTFIELD),
	_phoneOneField = document.getElementById(PHONE_ONE_TEXTFIELD),
	_phoneTwoField = document.getElementById(PHONE_TWO_TEXTFIELD),

	_addressField = document.getElementById(ADDRESS_TEXTFIELD),
	_aptSuiteNoField = document.getElementById(APT_SUITE_NO_TEXTFIELD),
	_cityField = document.getElementById(CITY_TEXTFIELD),
	_stateField = document.getElementById(STATE_SELECT),
	_zipCodeField = document.getElementById(ZIP_CODE_TEXTFIELD),

	_saveButton = document.getElementById(SAVE_CHANGES_BUTTON);

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
	viewModel.isFormValid = rQueryClient.validateModel(viewModel, _validationSet);
}

/**
 * Generic function responsible for visually marking a field as modified or unmodified and
 * updating a ledger responsible for tracking modifications
 *
 * @param {boolean} isNotModified - a flag indicating whether the field in context has been modified
 * @param {DOMElement} inputContainer - the input or input container representing the field in context
 *
 * @author kinsho
 */
function _markAsModified(isNotModified, inputContainer)
{
	var groupingParent = rQueryClient.closestElementByClass(inputContainer, DATA_GROUPING_CLASS),
		tagIcon = groupingParent.getElementsByClassName(FA_TAG_CLASS)[0];

	if (isNotModified)
	{
		tagIcon.classList.remove(REVEAL_CLASS);
	}
	else
	{
		tagIcon.classList.add(REVEAL_CLASS);
	}
}

/**
 * Higher-level function that determines whether the phone number was modified
 *
 * @author kinsho
 */
function _wasPhoneNumberNotModified()
{
	return ((viewModel.areaCode === viewModel.originalProspect.customer.areaCode) &&
	(viewModel.phoneOne === viewModel.originalProspect.customer.phoneOne) &&
	(viewModel.phoneTwo === viewModel.originalProspect.customer.phoneTwo));
}

// ----------------- VIEW MODEL DEFINITION -----------------------------

var viewModel = {};

// Original Prospect
// This property will be used in order to mark fields that have been modified
Object.defineProperty(viewModel, 'originalProspect',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__originalProspect;
	},

	set: (value) =>
	{
		viewModel.__originalProspect = value;

		// Copy over the values from the original prospect into the view model
		viewModel._id = value._id;
		viewModel.__notes = value.notes.internal;
		viewModel.__pictures = value.pictures || [];

		viewModel.__email = value.customer.email;
		viewModel.__areaCode = value.customer.areaCode;
		viewModel.__phoneOne = value.customer.phoneOne;
		viewModel.__phoneTwo = value.customer.phoneTwo;
		viewModel.__address = value.customer.address;
		viewModel.__aptSuiteNo = value.customer.aptSuiteNo;
		viewModel.__city = value.customer.city;
		viewModel.__state = value.customer.state;
		viewModel.__zipCode = value.customer.zipCode;
	}
});

// Prospect Notes
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

		rQueryClient.setField(_notesField, value);
		_markAsModified((value === viewModel.originalProspect.notes.internal), _notesField);
	}
});

// Prospect Pictures
Object.defineProperty(viewModel, 'pictures',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__pictures;
	},

	set: (value) =>
	{
		viewModel.__pictures = value;
	}
});

// Customer Email
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
		viewModel.__email = value;

		// Test whether the value qualifies as an e-mail address
		var isInvalid = (value.length && !(formValidator.isEmail(value)) );

		rQueryClient.updateValidationOnField(isInvalid, _emailField, ERROR.EMAIL_ADDRESS_INVALID, _validationSet);
		rQueryClient.setField(_emailField, value, _validationSet);
		_markAsModified((value === viewModel.originalProspect.customer.email), _emailField);

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
		_markAsModified(_wasPhoneNumberNotModified(), _areaCodeField);

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
		_markAsModified(_wasPhoneNumberNotModified(), _phoneOneField);

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
		_markAsModified(_wasPhoneNumberNotModified(), _phoneTwoField);

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
		_markAsModified((value === viewModel.originalProspect.customer.address), _addressField);

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
		_markAsModified((value === viewModel.originalProspect.customer.aptSuiteNo), _aptSuiteNoField);

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
		_markAsModified((value === viewModel.originalProspect.customer.city), _cityField);

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
		_markAsModified((value === viewModel.originalProspect.customer.state), _stateField);
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
		_markAsModified((value === viewModel.originalProspect.customer.zipCode), _zipCodeField);

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
			// Set up a tooltip indicating why the button is disabled
			tooltipManager.setTooltip(_saveButton, _validationSet.size ? SUBMISSION_INSTRUCTIONS.ERROR : SUBMISSION_INSTRUCTIONS.BLANK_FIELD);
		}
		else
		{
			tooltipManager.closeTooltip(_saveButton, true);
		}
	}
});

// ----------------- DATA INITIALIZATION -----------------------------

// Load a copy of the original prospect into the view model
viewModel.originalProspect = window.MetroRailings.prospect;

// ----------------- EXPORT -----------------------------

export default viewModel;