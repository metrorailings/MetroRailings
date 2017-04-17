/**
 * The view model for the order details page
 */

// ----------------- EXTERNAL MODULES --------------------------

import rQueryClient from 'client/scripts/utility/rQueryClient';
import formValidator from 'utility/formValidator';
import tooltipManager from 'client/scripts/utility/tooltip';

// ----------------- ENUM/CONSTANTS -----------------------------

var STATUS_RADIO_SUFFIX = 'Status',
	ORDER_NOTES_TEXT_AREA = 'orderNotes',
	STATUS_BUTTON_SET_GROUPING = 'statusButtonSet',

	CUSTOMER_EMAIL_TEXTFIELD = 'customerEmail',
	AREA_CODE_TEXTFIELD = 'areaCode',
	PHONE_ONE_TEXTFIELD = 'phoneOne',
	PHONE_TWO_TEXTFIELD = 'phoneTwo',

	ADDRESS_TEXTFIELD = 'address',
	APT_SUITE_NO_TEXTFIELD = 'aptSuiteNo',
	CITY_TEXTFIELD = 'city',
	STATE_SELECT = 'state',
	ZIP_CODE_TEXTFIELD = 'zipCode',

	ORDER_TYPE_SELECT = 'orderType',
	ORDER_POST_DESIGN_SELECT = 'orderPost',
	ORDER_POST_END_SELECT = 'orderPostEnd',
	ORDER_POST_CAP_SELECT = 'orderPostCap',
	ORDER_CENTER_DESIGN_SELECT = 'orderCenterDesign',
	ORDER_COLOR_SELECT = 'orderColor',
	ORDER_LENGTH_TEXTFIELD = 'orderLength',
	TOTAL_PRICE_TEXTFIELD = 'totalPrice',

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

		ZIP_CODE_INVALID: 'Please enter a five-digit zip code here.',

		LENGTH_INVALID: 'Please enter a non-zero length here.',
		TOTAL_INVALID: 'Please enter a valid dollar amount here.'
	};

// ----------------- PRIVATE VARIABLES -----------------------------

var _validationSet = new Set(),

	// Elements
	_notesField = document.getElementById(ORDER_NOTES_TEXT_AREA),
	_statusButtonSet = document.getElementById(STATUS_BUTTON_SET_GROUPING),

	_emailField = document.getElementById(CUSTOMER_EMAIL_TEXTFIELD),
	_areaCodeField = document.getElementById(AREA_CODE_TEXTFIELD),
	_phoneOneField = document.getElementById(PHONE_ONE_TEXTFIELD),
	_phoneTwoField = document.getElementById(PHONE_TWO_TEXTFIELD),

	_addressField = document.getElementById(ADDRESS_TEXTFIELD),
	_aptSuiteNoField = document.getElementById(APT_SUITE_NO_TEXTFIELD),
	_cityField = document.getElementById(CITY_TEXTFIELD),
	_stateField = document.getElementById(STATE_SELECT),
	_zipCodeField = document.getElementById(ZIP_CODE_TEXTFIELD),

	_orderTypeField = document.getElementById(ORDER_TYPE_SELECT),
	_orderPostDesignField = document.getElementById(ORDER_POST_DESIGN_SELECT),
	_orderPostEndField = document.getElementById(ORDER_POST_END_SELECT),
	_orderPostCapField = document.getElementById(ORDER_POST_CAP_SELECT),
	_orderCenterDesignField = document.getElementById(ORDER_CENTER_DESIGN_SELECT),
	_orderColorField = document.getElementById(ORDER_COLOR_SELECT),
	_orderLengthField = document.getElementById(ORDER_LENGTH_TEXTFIELD),
	_totalPriceField = document.getElementById(TOTAL_PRICE_TEXTFIELD),

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
	return ((viewModel.areaCode === viewModel.originalOrder.customer.areaCode) &&
			(viewModel.phoneOne === viewModel.originalOrder.customer.phoneOne) &&
			(viewModel.phoneTwo === viewModel.originalOrder.customer.phoneTwo));
}

// ----------------- VIEW MODEL DEFINITION -----------------------------

var viewModel = {};

// Original Order
// This property will be used in order to mark fields that have been modified
Object.defineProperty(viewModel, 'originalOrder',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return this.__originalOrder;
	},

	set: (value) =>
	{
		this.__originalOrder = value;

		// Copy over the values from the original order into the view model
		viewModel._id = value._id;
		viewModel.status = value.status;
		viewModel.notes = value.notes;
		viewModel.pictures = value.pictures || [];

		viewModel.email = value.customer.email;
		viewModel.areaCode = value.customer.areaCode;
		viewModel.phoneOne = value.customer.phoneOne;
		viewModel.phoneTwo = value.customer.phoneTwo;
		viewModel.address = value.customer.address;
		viewModel.aptSuiteNo = value.customer.aptSuiteNo;
		viewModel.city = value.customer.city;
		viewModel.state = value.customer.state;
		viewModel.zipCode = value.customer.zipCode;

		viewModel.postDesign = value.design.postDesign;
		viewModel.postEnd = value.design.postEndDesign;
		viewModel.postCap = value.design.postCapDesign;
		viewModel.centerDesign = value.design.centerDesign;
		viewModel.color = value.design.color;

		viewModel.type = value.type;
		viewModel.length = value.length;
		viewModel.orderTotal = value.orderTotal;
	}
});

// Order State
Object.defineProperty(viewModel, 'status',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return this.__status;
	},

	set: (value) =>
	{
		this.__status = value;

		document.getElementById(value + STATUS_RADIO_SUFFIX).checked = true;
		_markAsModified((value === viewModel.originalOrder.status), _statusButtonSet);
	}
});

// Order Notes
Object.defineProperty(viewModel, 'notes',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return this.__notes;
	},

	set: (value) =>
	{
		this.__notes = value;

		rQueryClient.setField(_notesField, value);
		_markAsModified((value === viewModel.originalOrder.notes), _notesField);
	}
});

// Order Pictures
Object.defineProperty(viewModel, 'pictures',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return this.__pictures;
	},

	set: (value) =>
	{
		this.__pictures = value;
	}
});

// Customer Email
Object.defineProperty(viewModel, 'email',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return this.__email;
	},

	set: (value) =>
	{
		this.__email = value;

		// Test whether the value qualifies as an e-mail address
		var isInvalid = (value.length && !(formValidator.isEmail(value)) );

		rQueryClient.updateValidationOnField(isInvalid, _emailField, ERROR.EMAIL_ADDRESS_INVALID, _validationSet);
		rQueryClient.setField(_emailField, value, _validationSet);
		_markAsModified((value === viewModel.originalOrder.customer.email), _emailField);

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
		return this.__address;
	},

	set: (value) =>
	{
		this.__address = value;

		rQueryClient.setField(_addressField, value);
		_markAsModified((value === viewModel.originalOrder.customer.address), _addressField);

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
		return this.__aptSuiteNo;
	},

	set: (value) =>
	{
		this.__aptSuiteNo = value;

		rQueryClient.setField(_aptSuiteNoField, value);
		_markAsModified((value === viewModel.originalOrder.customer.aptSuiteNo), _aptSuiteNoField);

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
		return this.__city;
	},

	set: (value) =>
	{
		this.__city = value;

		rQueryClient.setField(_cityField, value);
		_markAsModified((value === viewModel.originalOrder.customer.city), _cityField);

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
		return this.__state;
	},

	set: (value) =>
	{
		this.__state = value;

		rQueryClient.setField(_stateField, value);
		_markAsModified((value === viewModel.originalOrder.customer.state), _stateField);
	}
});

// Zip Code
Object.defineProperty(viewModel, 'zipCode',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return this.__zipCode;
	},

	set: (value) =>
	{
		this.__zipCode = value;

		// Test whether the value qualifies as a valid zip code
		var isInvalid = ((value.length && value.length !== 5)) ||
						!(formValidator.isNumeric(value));

		rQueryClient.updateValidationOnField(isInvalid, _zipCodeField, ERROR.ZIP_CODE_INVALID, _validationSet);
		rQueryClient.setField(_zipCodeField, value, _validationSet);
		_markAsModified((value === viewModel.originalOrder.customer.zipCode), _zipCodeField);

		_validate();
	}
});

// Order Type
Object.defineProperty(viewModel, 'type',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return this.__type;
	},

	set: (value) =>
	{
		this.__type = value;

		rQueryClient.setField(_orderTypeField, value);
		_markAsModified((value === viewModel.originalOrder.type), _orderTypeField);
	}
});

// Order Post Design
Object.defineProperty(viewModel, 'postDesign',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return this.__postDesign;
	},

	set: (value) =>
	{
		this.__postDesign = value;

		rQueryClient.setField(_orderPostDesignField, value);
		_markAsModified((value === viewModel.originalOrder.design.postDesign), _orderPostDesignField);
	}
});

// Order Post End
Object.defineProperty(viewModel, 'postEnd',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return this.__postEnd;
	},

	set: (value) =>
	{
		this.__postEnd = value;

		rQueryClient.setField(_orderPostEndField, value);
		_markAsModified((value === viewModel.originalOrder.design.postEndDesign), _orderPostEndField);
	}
});

// Order Post Cap
Object.defineProperty(viewModel, 'postCap',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return this.__postCap;
	},

	set: (value) =>
	{
		this.__postCap = value;

		rQueryClient.setField(_orderPostCapField, value);
		_markAsModified((value === viewModel.originalOrder.design.postCapDesign), _orderPostCapField);
	}
});

// Order Center Design
Object.defineProperty(viewModel, 'centerDesign',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return this.__centerDesign;
	},

	set: (value) =>
	{
		this.__centerDesign = value;

		rQueryClient.setField(_orderCenterDesignField, value);
		_markAsModified((value === viewModel.originalOrder.design.centerDesign), _orderCenterDesignField);
	}
});

// Order Color
Object.defineProperty(viewModel, 'color',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return this.__color;
	},

	set: (value) =>
	{
		this.__color = value;

		rQueryClient.setField(_orderColorField, value);
		_markAsModified((value === viewModel.originalOrder.design.color), _orderColorField);
	}
});

// Order Length
Object.defineProperty(viewModel, 'length',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return this.__length;
	},

	set: (value) =>
	{
		this.__length = value;

		// Make sure a valid length is being set here
		var isInvalid = !(formValidator.isNumeric(value)) ||
						(value.length && !(window.parseInt(value, 10)));

		rQueryClient.updateValidationOnField(isInvalid, _orderLengthField, ERROR.LENGTH_INVALID, _validationSet);
		rQueryClient.setField(_orderLengthField, value);
		_markAsModified((value === viewModel.originalOrder.length), _orderLengthField);

		_validate();
	}
});

// Total Price
Object.defineProperty(viewModel, 'orderTotal',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return this.__orderTotal;
	},

	set: (value) =>
	{
		this.__orderTotal = value;

		// Make sure a valid total price is being set here
		var isInvalid = !(formValidator.isNumeric(value, '.')) ||
						(value.length && !(window.parseFloat(value, 10)) ) ||
						(value.length && value.split('.').length > 2);

		rQueryClient.updateValidationOnField(isInvalid, _totalPriceField, ERROR.TOTAL_INVALID, _validationSet);
		rQueryClient.setField(_totalPriceField, value);
		_markAsModified((window.parseFloat(value) === viewModel.originalOrder.orderTotal), _totalPriceField);

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
		return this.__isFormValid;
	},

	set: (value) =>
	{
		this.__isFormValid = value;

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

// Load a copy of the original order into the view model
viewModel.originalOrder = window.MetroRailings.order;

// ----------------- EXPORT -----------------------------

export default viewModel;