/**
 * The view model for the contact us page
 */

// ----------------- EXTERNAL MODULES --------------------------

import formValidator from 'utility/formValidator';
import rQueryClient from 'client/scripts/utility/rQueryClient';
import tooltipManager from 'client/scripts/utility/tooltip';

// ----------------- ENUM/CONSTANTS -----------------------------

var NAME_TEXTFIELD = 'customerName',
	ORDER_ID_TEXTFIELD = 'orderId',
	AREA_CODE_TEXTFIELD = 'customerPhoneAreaCode',
	PHONE_ONE_TEXTFIELD = 'customerPhoneNumber1',
	PHONE_TWO_TEXTFIELD = 'customerPhoneNumber2',
	EMAIL_TEXTFIELD = 'customerEmail',
	COMMENTS_TEXTAREA = 'comments',
	SUBMISSION_BUTTON = 'contactUsSubmissionButton',

	ERROR =
	{
		NAME_INVALID: 'Please enter your name here. We only tolerate alphabetical characters, spaces, dashes, and apostrophes here.',
		ORDER_ID_INVALID: 'Please enter only numbers here.',
		EMAIL_INVALID: 'Please enter a valid e-mail address here.',
		AREA_CODE_INVALID: 'Please enter a valid three-digit area code here.',
		PHONE_ONE_INVALID: 'Please enter exactly three digits here.',
		PHONE_TWO_INVALID: 'Please enter exactly four digits here.',
	},

	SUBMISSION_INSTRUCTIONS =
	{
		EMPTY_FIELDS: "At least one of the required fields above is empty. At minimum, please give us your name, leave some comments, and " +
			"put down an e-mail address or phone number so that we can reach you if need be. Then you can submit this form.",
		INVALID_FIELDS: 'At least one of the fields above has an improper value. Please fix all erroneous values in order to submit this form.'
	};

// ----------------- PRIVATE VARIABLES -----------------------------

var _validationSet = new Set(),

	// Elements
	_nameField = document.getElementById(NAME_TEXTFIELD),
	_orderIdField = document.getElementById(ORDER_ID_TEXTFIELD),
	_areaCodeField = document.getElementById(AREA_CODE_TEXTFIELD),
	_phoneOneField = document.getElementById(PHONE_ONE_TEXTFIELD),
	_phoneTwoField = document.getElementById(PHONE_TWO_TEXTFIELD),
	_emailField = document.getElementById(EMAIL_TEXTFIELD),
	_commentsArea = document.getElementById(COMMENTS_TEXTAREA),
	_submitButton = document.getElementById(SUBMISSION_BUTTON);

// ----------------- PRIVATE FUNCTIONS -----------------------------

/**
 * Generic function meant to check whether a value is defined in the traditional sense
 *
 * @oaram {String} value - the value to test
 *
 * @returns {boolean} - a boolean indicating that the value is defined
 *
 * @author kinsho
 */
function _isDefined(value)
{
	return value && value.trim();
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
	var contactInfoProvided = false;

	// Check the validation model for any invalid values
	if (_validationSet.size)
	{
		return false;
	}

	// Ensure that at least one piece of contact information is provided
	if (_isDefined(viewModel.email))
	{
		contactInfoProvided = true;
	}
	else if (_isDefined(viewModel.areaCode) && _isDefined(viewModel.phoneOne) && _isDefined(viewModel.phoneTwo))
	{
		contactInfoProvided = true;
	}

	return contactInfoProvided &&
		_isDefined(viewModel.name) &&
		_isDefined(viewModel.comments);
}

// ----------------- VIEW MODEL DEFINITION -----------------------------

var viewModel = {};

// Customer's name
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
		// Ensure that the value does not simply consist of spaces
		value = (value.trim() ? value : '');
		viewModel.__name = value;

		rQueryClient.updateValidationOnField(!(formValidator.isAlphabetical(value, " '-")), _nameField, ERROR.NAME_INVALID, _validationSet);
		rQueryClient.setField(_nameField, value, _validationSet);
		viewModel.isFormSubmissible = _validate();
	}
});

// Order ID
Object.defineProperty(viewModel, 'orderId',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__orderId;
	},

	set: (value) =>
	{
		viewModel.__orderId = value;

		rQueryClient.updateValidationOnField(!(formValidator.isNumeric(value)), _orderIdField, ERROR.ORDER_ID_INVALID, _validationSet);
		rQueryClient.setField(_orderIdField, value, _validationSet);
		viewModel.isFormSubmissible = _validate();
	}
});

// Customer's e-mail address
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
		rQueryClient.updateValidationOnField(!(formValidator.isEmail(value)), _emailField, ERROR.EMAIL_INVALID, _validationSet);
		rQueryClient.setField(_emailField, value, _validationSet);
		viewModel.isFormSubmissible = _validate();
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

		var isInvalid = ((value.length && value.length !== 3)) ||
			!(formValidator.isNumeric(value));

		rQueryClient.updateValidationOnField(isInvalid, _areaCodeField, ERROR.AREA_CODE_INVALID, _validationSet);
		rQueryClient.setField(_areaCodeField, value, _validationSet);
		viewModel.isFormSubmissible = _validate();
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

		var isInvalid = ((value.length && value.length !== 3)) ||
			!(formValidator.isNumeric(value));

		rQueryClient.updateValidationOnField(isInvalid, _phoneOneField, ERROR.PHONE_ONE_INVALID, _validationSet);
		rQueryClient.setField(_phoneOneField, value, _validationSet);
		viewModel.isFormSubmissible = _validate();
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

		var isInvalid = ((value.length && value.length !== 4)) ||
			!(formValidator.isNumeric(value));

		rQueryClient.updateValidationOnField(isInvalid, _phoneTwoField, ERROR.PHONE_TWO_INVALID, _validationSet);
		rQueryClient.setField(_phoneTwoField, value, _validationSet);
		viewModel.isFormSubmissible = _validate();
	}
});

// Comments
Object.defineProperty(viewModel, 'comments',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__comments;
	},

	set: (value) =>
	{
		viewModel.__comments = value;

		rQueryClient.setField(_commentsArea, value, _validationSet);
		viewModel.isFormSubmissible = _validate();
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
			tooltipManager.setTooltip(_submitButton, _validationSet.size ? SUBMISSION_INSTRUCTIONS.INVALID_FIELDS : SUBMISSION_INSTRUCTIONS.EMPTY_FIELDS);
		}
		else
		{
			tooltipManager.closeTooltip(_submitButton, true);
		}
	}
});

// ----------------- EXPORT -----------------------------

export default viewModel;