/**
 * The view model for the invoice creation page
 */

// ----------------- EXTERNAL MODULES --------------------------

import rQueryClient from 'client/scripts/utility/rQueryClient';
import tooltipManager from 'client/scripts/utility/tooltip';

import formValidator from 'shared/formValidator';
import ccAllowed from 'shared/ccAllowed';

// ----------------- ENUM/CONSTANTS -----------------------------

const CC_PAYMENT_AMOUNT = 'newPaymentCCAmount',
	NEW_CARD_NUMBER = 'newCCNumber',
	NEW_CARD_EXP_MONTH = 'ccExpDateMonth',
	NEW_CARD_EXP_YEAR = 'ccExpDateYear',
	NEW_CARD_CVC_NUMBER = 'newCVCNumber',
	CC_SAVE_BUTTON = 'ccSaveButton',

	ERROR_MESSAGES =
	{
		DOLLAR_AMOUNT_INVALID : 'Please enter a valid dollar amount here.',

		CC_NUMBER_INVALID: 'Please enter only digits here in the credit card number field.',
		CC_NUMBER_UNACCEPTABLE: 'Please enter a valid credit card number. Keep in mind that we accept Visa, Mastercard, Discover, and Amex cards.',
		CC_SECURITY_CODE_INVALID: 'Please put in a 3 or 4 digit code here.'
	},

	SUBMISSION_INSTRUCTIONS =
	{
		ERROR: 'At least one of the fields above has an erroneous value. Please fix these errors prior to submitting this order.',
		BLANK_FIELD: 'In order to submit this order, please make sure you filled out all the fields.'
	};

// ----------------- PRIVATE VARIABLES -----------------------------

let _validationSet = new Set(),

	// Elements
	_ccPaymentAmount = document.getElementById(CC_PAYMENT_AMOUNT),

	_ccNumber = document.getElementById(NEW_CARD_NUMBER),
	_ccExpMonth = document.getElementById(NEW_CARD_EXP_MONTH),
	_ccExpYear = document.getElementById(NEW_CARD_EXP_YEAR),
	_ccCVCNumber = document.getElementById(NEW_CARD_CVC_NUMBER),

	_ccSaveButton = document.getElementById(CC_SAVE_BUTTON);

// ----------------- PRIVATE FUNCTIONS -----------------------------

/**
 * Slightly specialized function for invoking the logic that validates a new potential credit card payment
 *
 * @author kinsho
 */
function _validateCC()
{
	// Ensure all the credit card information has been put into place
	viewModel.isCCFormSubmissible = (viewModel.ccAmount && !(_validationSet.ccAmount));
}

// ----------------- VIEW MODEL DEFINITION -----------------------------

let viewModel = {};

// Amount left to collect on the order
Object.defineProperty(viewModel, 'balanceRemaining',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__balanceRemaining;
	},

	set: (value) =>
	{
		// No need to validate the balance remaining, as this is not a value set by the user, but by the system
		viewModel.__balanceRemaining = value;
	}	
});

// Amount to charge on credit card
Object.defineProperty(viewModel, 'ccAmount',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__ccAmount;
	},

	set: (value) =>
	{
		viewModel.__ccAmount = value;

		// Make sure a valid amount is set here
		let isInvalid = !(formValidator.isDollarAmount(value)) ||
			(value.length && !(window.parseFloat(value) >= 0) );

		// If the deposit amount is less than zero or greater than the remaining balance, we have an invalid amount
		// Notice the use of conditional logic here to ensure that we're dealing with a number
		isInvalid = isInvalid || window.parseFloat(value) < 0 || window.parseFloat(value) > viewModel.balanceRemaining;

		rQueryClient.updateValidationOnField(isInvalid, _ccPaymentAmount, ERROR_MESSAGES.DOLLAR_AMOUNT_INVALID, _validationSet);
		rQueryClient.setField(_ccPaymentAmount, value);
		_validateCC();
	}
});

// The new credit card to charge
Object.defineProperty(viewModel, 'ccNumber',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__ccNumber;
	},

	set: (value) =>
	{
		viewModel.__ccNumber = value;

		// Make sure only numbers are inserted into the field here
		let isInvalid = !(formValidator.isNumeric(value));
		rQueryClient.updateValidationOnField(isInvalid, _ccNumber, ERROR_MESSAGES.CC_NUMBER_INVALID, _validationSet);

		// If valid, test whether the credit card number belongs to that of an acceptable brand
		if (!(isInvalid))
		{
			if (value.length >= 6)
			{
				let acceptedBrand = ccAllowed.checkCCNumber(value);

				rQueryClient.updateValidationOnField( !(acceptedBrand), _ccNumber, ERROR_MESSAGES.CC_NUMBER_UNACCEPTABLE, _validationSet);
			}
			else
			{
				rQueryClient.updateValidationOnField(false, _ccNumber, ERROR_MESSAGES.CC_NUMBER_UNACCEPTABLE, _validationSet);
			}
		}

		rQueryClient.setField(_ccNumber, value, _validationSet);
		_validateCC();
	}
});

// Credit card expiration month
Object.defineProperty(viewModel, 'ccExpMonth',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__ccExpMonth;
	},

	set: (value) =>
	{
		viewModel.__ccExpMonth = value;

		rQueryClient.setField(_ccExpMonth, value, _validationSet);
		_validateCC();
	}
});

// Credit card expiration year
Object.defineProperty(viewModel, 'ccExpYear',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__ccExpYear;
	},

	set: (value) =>
	{
		viewModel.__ccExpYear = value;

		rQueryClient.setField(_ccExpYear, value, _validationSet);
		_validateCC();
	}
});


// Credit card validation code
Object.defineProperty(viewModel, 'ccSecurityCode',
{
	configurable: false,
	enumerable: false,

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

		rQueryClient.updateValidationOnField(isInvalid, _ccCVCNumber, ERROR_MESSAGES.CC_SECURITY_CODE_INVALID, _validationSet);
		rQueryClient.setField(_ccCVCNumber, value, _validationSet);
		_validateCC();
	}
});

// Credit card form validation flag
Object.defineProperty(viewModel, 'isCCFormSubmissible',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__isCCFormSubmissible;
	},

	set: (value) =>
	{
		viewModel.__isCCFormSubmissible = value;

		if (!(value))
		{
			// Set up a tooltip indicating why the button is disabled
			tooltipManager.setTooltip(_ccSaveButton, _validationSet.size ? SUBMISSION_INSTRUCTIONS.ERROR : SUBMISSION_INSTRUCTIONS.BLANK_FIELD);
		}
		else
		{
			tooltipManager.closeTooltip(_ccSaveButton, true);
		}
	}
});