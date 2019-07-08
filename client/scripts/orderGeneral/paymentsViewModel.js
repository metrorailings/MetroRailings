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

	CHECK_PAYMENT_AMOUNT = 'newPaymentCheckAmount',
	CHECK_SUBMIT_BUTTON = 'checkSaveButton',

	CASH_PAYMENT_AMOUNT = 'newPaymentCashAmount',
	CASH_SUBMIT_BUTTON = 'cashSaveButton',

	NEW_KEYWORD = 'new',

	EXISTING_CC_VALIDATION_FIELDS =
	[
		CC_PAYMENT_AMOUNT
	],
	NEW_CC_VALIDATION_FIELDS =
	[
		CC_PAYMENT_AMOUNT,
		NEW_CARD_NUMBER,
		NEW_CARD_CVC_NUMBER
	],
	NEW_CHECK_VALIDATION_FIELDS =
	[
		CHECK_PAYMENT_AMOUNT
	],

	NEW_CASH_VALIDATION_FIELDS =
	[
		CASH_PAYMENT_AMOUNT
	],

	ERROR_MESSAGES =
	{
		DOLLAR_AMOUNT_INVALID : 'Please enter a valid dollar amount here. Make sure that dollar amount does not' +
			' exceed the balance remaining on this order.',

		CC_NUMBER_INVALID: 'Please enter only digits here in the credit card number field.',
		CC_NUMBER_UNACCEPTABLE: 'Please enter a valid credit card number. Keep in mind that we accept Visa, Mastercard, Discover, and Amex cards.',
		CC_SECURITY_CODE_INVALID: 'Please put in a 3 or 4 digit code here.'
	},

	SUBMISSION_INSTRUCTIONS =
	{
		CC: 'At least one of the key fields above has an erroneous value or missing value. Please address' +
			' whatever the problem is prior to submissing this form.',
		CHECK: 'The check amount field has an erroneous or missing value. Please put an eligible value in that' +
			' field. Also make sure an image of the check has been uploaded.',
		CASH: 'The cash amount field has an erroneous or missing value. Please put an eligible value in that' +
			' field. Also make sure an image of the cash or money order deposit has been uploaded.'
	};

// ----------------- PRIVATE VARIABLES -----------------------------

let _validationSet = new Set(),

	// Elements
	_ccPaymentAmount = document.getElementById(CC_PAYMENT_AMOUNT),

	_ccNumber = document.getElementById(NEW_CARD_NUMBER),
	_ccExpMonth = document.getElementById(NEW_CARD_EXP_MONTH),
	_ccExpYear = document.getElementById(NEW_CARD_EXP_YEAR),
	_ccCVCNumber = document.getElementById(NEW_CARD_CVC_NUMBER),

	_checkPaymentAmount = document.getElementById(CHECK_PAYMENT_AMOUNT),

	_cashPaymentAmount = document.getElementById(CASH_PAYMENT_AMOUNT),

	_ccSaveButton = document.getElementById(CC_SAVE_BUTTON),
	_checkSaveButton = document.getElementById(CHECK_SUBMIT_BUTTON),
	_cashSaveButton = document.getElementById(CASH_SUBMIT_BUTTON);

// ----------------- PRIVATE FUNCTIONS -----------------------------

/**
 * Validation test designed to test whether a given set of fields contain an erroneous value
 *
 * @param {Array<String>} fields - a collection of field IDs representing fields that need to be checked
 *
 * @returns {Boolean} - a boolean flag indicating whether at least one field in the passed set contains an error
 *
 * @private
 */
function _validationTest(fields)
{
	for (let i = 0; i < fields.length; i += 1)
	{
		if (_validationSet.has(fields[i]))
		{
			return true;
		}
	}

	return false;
}

/**
 * Slightly specialized function for invoking the logic that validates a new potential credit card payment
 *
 * @author kinsho
 */
function _validateCC()
{
	// Ensure all the credit card information has been put into place
	viewModel.isCCFormSubmissible = (viewModel.ccAmount &&
		((viewModel.token && viewModel.token !== NEW_KEYWORD) || (viewModel.ccNumber && viewModel.ccExpMonth && viewModel.ccExpYear && viewModel.ccSecurityCode) ));

	// Make sure none of the relevant credit card fields are currently hosting an erroneous value
	if (viewModel.token !== NEW_KEYWORD)
	{
		viewModel.isCCFormSubmissible = viewModel.isCCFormSubmissible && !(_validationTest(EXISTING_CC_VALIDATION_FIELDS));
	}
	else
	{
		viewModel.isCCFormSubmissible = viewModel.isCCFormSubmissible && !(_validationTest(NEW_CC_VALIDATION_FIELDS));
	}
}

/**
 * Slightly specialized function for invoking the logic that validates a new potential check payment
 *
 * @author kinsho
 */
function _validateCheck()
{
	// Ensure all the check information has been put into place
	viewModel.isCheckFormSubmissible = (viewModel.checkAmount && viewModel.isCheckImageProvided);

	// Make sure none of the check fields are currently hosting an erroneous value
	viewModel.isCheckFormSubmissible = viewModel.isCheckFormSubmissible && !(_validationTest(NEW_CHECK_VALIDATION_FIELDS));
}

/**
 * Slightly specialized function for invoking the logic that validates a new potential cash or cash equivalent payment
 *
 * @author kinsho
 */
function _validateCash()
{
	// Ensure all the proper information has been put into place
	viewModel.isCashFormSubmissible = (viewModel.cashAmount && viewModel.isCashImageProvided);

	// Make sure none of the check fields are currently hosting an erroneous value
	viewModel.isCashFormSubmissible = viewModel.isCashFormSubmissible && !(_validationTest(NEW_CASH_VALIDATION_FIELDS));
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

// Credit Card Memorandum
Object.defineProperty(viewModel, 'ccMemo',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__ccMemo;
	},

	set: (value) =>
	{
		viewModel.__ccMemo = value;
	}
});

// The token to charge, if an existing credit card is meant to generate a new payment
Object.defineProperty(viewModel, 'token',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__token;
	},

	set: (value) =>
	{
		viewModel.__token = value;

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

// Amount that new check is worth
Object.defineProperty(viewModel, 'checkAmount',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__checkAmount;
	},

	set: (value) =>
	{
		viewModel.__checkAmount = value;

		// Make sure a valid amount is set here
		let isInvalid = !(formValidator.isDollarAmount(value)) ||
			(value.length && !(window.parseFloat(value) >= 0) );

		// If the deposit amount is less than zero or greater than the remaining balance, we have an invalid amount
		// Notice the use of conditional logic here to ensure that we're dealing with a number
		isInvalid = isInvalid || window.parseFloat(value) < 0 || window.parseFloat(value) > viewModel.balanceRemaining;

		rQueryClient.updateValidationOnField(isInvalid, _checkPaymentAmount, ERROR_MESSAGES.DOLLAR_AMOUNT_INVALID, _validationSet);
		rQueryClient.setField(_checkPaymentAmount, value);
		_validateCheck();
	}
});

// Amount that the cash or cash instrument totals up to
Object.defineProperty(viewModel, 'cashAmount',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__cashAmount;
	},

	set: (value) =>
	{
		viewModel.__cashAmount = value;

		// Make sure a valid amount is set here
		let isInvalid = !(formValidator.isDollarAmount(value)) ||
			(value.length && !(window.parseFloat(value) >= 0) );

		// If the deposit amount is less than zero or greater than the remaining balance, we have an invalid amount
		// Notice the use of conditional logic here to ensure that we're dealing with a number
		isInvalid = isInvalid || window.parseFloat(value) < 0 || window.parseFloat(value) > viewModel.balanceRemaining;

		rQueryClient.updateValidationOnField(isInvalid, _cashPaymentAmount, ERROR_MESSAGES.DOLLAR_AMOUNT_INVALID, _validationSet);
		rQueryClient.setField(_cashPaymentAmount, value);
		_validateCash();
	}
});

// Flag indicating whether a check image is ready to be uploaded
Object.defineProperty(viewModel, 'isCheckImageProvided',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__checkImage;
	},

	set: (value) =>
	{
		viewModel.__checkImage = value;

		_validateCheck();
	}
});

// Flag indicating whether an image of a cash instrument deposit slip has been provided
Object.defineProperty(viewModel, 'isCashImageProvided',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__cashImage;
	},

	set: (value) =>
	{
		viewModel.__cashImage = value;

		_validateCash();
	}
});

// Check Memorandum
Object.defineProperty(viewModel, 'checkMemo',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__checkMemo;
	},

	set: (value) =>
	{
		viewModel.__checkMemo = value;
	}
});

// Cash Memorandum
Object.defineProperty(viewModel, 'cashMemo',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__cashMemo;
	},

	set: (value) =>
	{
		viewModel.__cashMemo = value;
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

		// Disable the button depending on whether the form can be submitted
		if (!(value))
		{
			// Set up a tooltip indicating why the button is disabled
			tooltipManager.setTooltip(_ccSaveButton.parentNode, SUBMISSION_INSTRUCTIONS.CC);
		}
		else
		{
			tooltipManager.closeTooltip(_ccSaveButton.parentNode, true);
		}
	}
});

// Check form validation flag
Object.defineProperty(viewModel, 'isCheckFormSubmissible',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__isCheckFormSubmissible;
	},

	set: (value) =>
	{
		viewModel.__isCheckFormSubmissible = value;

		// Disable the button depending on whether the form can be submitted
		if (!(value))
		{
			// Set up a tooltip indicating why the button is disabled
			tooltipManager.setTooltip(_checkSaveButton.parentNode, SUBMISSION_INSTRUCTIONS.CHECK);
		}
		else
		{
			tooltipManager.closeTooltip(_checkSaveButton.parentNode, true);
		}
	}
});

// Cash form validation flag
Object.defineProperty(viewModel, 'isCashFormSubmissible',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__isCashFormSubmissible;
	},

	set: (value) =>
	{
		viewModel.__isCashFormSubmissible = value;

		// Disable the button depending on whether the form can be submitted
		if (!(value))
		{
			// Set up a tooltip indicating why the button is disabled
			tooltipManager.setTooltip(_cashSaveButton.parentNode, SUBMISSION_INSTRUCTIONS.CASH);
		}
		else
		{
			tooltipManager.closeTooltip(_cashSaveButton.parentNode, true);
		}
	}
});


// ----------------- EXPORT LOGIC -----------------------------

export default viewModel;