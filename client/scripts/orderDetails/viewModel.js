/**
 * The view model for the order details page
 */

// ----------------- EXTERNAL MODULES --------------------------

import rQueryClient from 'client/scripts/utility/rQueryClient';
import tooltipManager from 'client/scripts/utility/tooltip';

import formValidator from 'shared/formValidator';

// ----------------- ENUM/CONSTANTS -----------------------------

var STATUS_RADIO_SUFFIX = 'Status',
	ORDER_NOTES_TEXT_AREA = 'orderNotes',
	STATUS_BUTTON_SET_GROUPING = 'statusButtonSet',
	RUSH_ORDER_BUTTON_SET = 'rushOrderButtonSet',

	CUSTOMER_EMAIL_TEXTFIELD = 'customerEmail',
	AREA_CODE_TEXTFIELD = 'areaCode',
	PHONE_ONE_TEXTFIELD = 'phoneOne',
	PHONE_TWO_TEXTFIELD = 'phoneTwo',

	ADDRESS_TEXTFIELD = 'address',
	APT_SUITE_NO_TEXTFIELD = 'aptSuiteNo',
	CITY_TEXTFIELD = 'city',
	STATE_SELECT = 'state',
	ZIP_CODE_TEXTFIELD = 'zipCode',

	ORDER_POST_DESIGN_SELECT = 'orderPost',
	OTHER_POST_DESIGN_TEXTFIELD = 'otherPost',
	ORDER_HANDRAILING_SELECT = 'orderHandrailing',
	OTHER_HANDRAILING_TEXTFIELD = 'otherHandrailing',
	ORDER_PICKET_SELECT = 'orderPickets',
	ORDER_POST_END_SELECT = 'orderPostEnd',
	OTHER_POST_END_TEXTFIELD = 'otherPostEnd',
	ORDER_POST_CAP_SELECT = 'orderPostCap',
	OTHER_POST_CAP_TEXTFIELD = 'otherPostCap',
	ORDER_CENTER_DESIGN_SELECT = 'orderCenterDesign',
	OTHER_CENTER_DESIGN_TEXTFIELD = 'otherCenterDesign',
	ORDER_COLOR_SELECT = 'orderColor',
	OTHER_COLOR_TEXTFIELD = 'otherColor',

	COVER_PLATES_BUTTONS = 'coverPlatesButtonSet',
	PLATFORM_TYPE_SELECT = 'orderPlatformType',

	LENGTH_TEXTFIELD = 'orderLength',
	HEIGHT_TEXTFIELD = 'orderFinishedHeight',
	PRICE_PER_FOOT_TEXTFIELD = 'pricePerFoot',
	ADDITIONAL_FEATURES_TEXT_AREA = 'additionalFeatures',
	ADDITIONAL_PRICE_TEXTFIELD = 'additionalPrice',
	DEDUCTIONS_TEXTFIELD = 'deductions',
	REST_BY_CHECK_BUTTON_SET = 'restByCheckButtonSet',
	PRICING_MODIFICATIONS_TEXTFIELD = 'priceModifications',

	DESCRIPTION_TEXT_AREA = 'orderDescription',
	AGREEMENT_TEXT_AREA = 'agreement',

	SAVE_CHANGES_BUTTON = 'saveChangesButton',

	REVEAL_CLASS = 'reveal',
	DATA_GROUPING_CLASS = 'dataGrouping',
	FA_TAG_CLASS = 'fa-tag',

	OTHER_SELECTION = 'OTHER',

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

		WHOLE_NUMBER_INVALID: 'Please enter only whole numbers here.',
		TOTAL_INVALID: 'Please enter a valid dollar amount here.'
	};

// ----------------- PRIVATE VARIABLES -----------------------------

var _validationSet = new Set(),

	// Elements
	_notesField = document.getElementById(ORDER_NOTES_TEXT_AREA),
	_statusButtonSet = document.getElementById(STATUS_BUTTON_SET_GROUPING),
	_rushOrderButtonSet = document.getElementById(RUSH_ORDER_BUTTON_SET),

	_emailField = document.getElementById(CUSTOMER_EMAIL_TEXTFIELD),
	_areaCodeField = document.getElementById(AREA_CODE_TEXTFIELD),
	_phoneOneField = document.getElementById(PHONE_ONE_TEXTFIELD),
	_phoneTwoField = document.getElementById(PHONE_TWO_TEXTFIELD),

	_addressField = document.getElementById(ADDRESS_TEXTFIELD),
	_aptSuiteNoField = document.getElementById(APT_SUITE_NO_TEXTFIELD),
	_cityField = document.getElementById(CITY_TEXTFIELD),
	_stateField = document.getElementById(STATE_SELECT),
	_zipCodeField = document.getElementById(ZIP_CODE_TEXTFIELD),

	_orderPostDesignField = document.getElementById(ORDER_POST_DESIGN_SELECT),
	_otherPostDesignField = document.getElementById(OTHER_POST_DESIGN_TEXTFIELD),
	_orderHandrailingField = document.getElementById(ORDER_HANDRAILING_SELECT),
	_otherHandrailingField = document.getElementById(OTHER_HANDRAILING_TEXTFIELD),
	_orderPicketsField = document.getElementById(ORDER_PICKET_SELECT),
	_orderPostEndField = document.getElementById(ORDER_POST_END_SELECT),
	_otherPostEndField = document.getElementById(OTHER_POST_END_TEXTFIELD),
	_orderPostCapField = document.getElementById(ORDER_POST_CAP_SELECT),
	_otherPostCapField = document.getElementById(OTHER_POST_CAP_TEXTFIELD),
	_orderCenterDesignField = document.getElementById(ORDER_CENTER_DESIGN_SELECT),
	_otherCenterDesignField = document.getElementById(OTHER_CENTER_DESIGN_TEXTFIELD),
	_orderColorField = document.getElementById(ORDER_COLOR_SELECT),
	_otherColorField = document.getElementById(OTHER_COLOR_TEXTFIELD),

	_coverPlatesButtonSet = document.getElementById(COVER_PLATES_BUTTONS),
	_platformTypeField = document.getElementById(PLATFORM_TYPE_SELECT),

	_lengthField = document.getElementById(LENGTH_TEXTFIELD),
	_heightField = document.getElementById(HEIGHT_TEXTFIELD),
	_pricePerFootField = document.getElementById(PRICE_PER_FOOT_TEXTFIELD),
	_additionalFeaturesField = document.getElementById(ADDITIONAL_FEATURES_TEXT_AREA),
	_additionalPriceField = document.getElementById(ADDITIONAL_PRICE_TEXTFIELD),
	_deductionsField = document.getElementById(DEDUCTIONS_TEXTFIELD),
	_restByCheckButtonSet = document.getElementById(REST_BY_CHECK_BUTTON_SET),
	_pricingModificationsField = document.getElementById(PRICING_MODIFICATIONS_TEXTFIELD),

	_descriptionField = document.getElementById(DESCRIPTION_TEXT_AREA),
	_agreementField = document.getElementById(AGREEMENT_TEXT_AREA),

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
		return viewModel.__originalOrder;
	},

	set: (value) =>
	{
		viewModel.__originalOrder = value;

		// Copy over the values from the original order into the view model
		viewModel._id = value._id;
		viewModel.__status = value.status;
		viewModel.__notes = value.notes.internal;
		viewModel.__rushOrder = value.rushOrder;
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

		viewModel.__postDesign = value.design.post;
		viewModel.__handrailing = value.design.handrailing;
		viewModel.__picket = value.design.picket;
		viewModel.__postEnd = value.design.postEnd;
		viewModel.__postCap = value.design.postCap;
		viewModel.__centerDesign = value.design.center;
		viewModel.__color = value.design.color;

		viewModel.__coverPlates = value.installation.coverPlates;
		viewModel.__platformType = value.installation.platformType;

		viewModel.__length = value.length;
		viewModel.__finishedHeight = value.finishedHeight;
		viewModel.__pricePerFoot = value.pricing.pricePerFoot;
		viewModel.__additionalFeatures = value.additionalFeatures;
		viewModel.__additionalPrice = value.pricing.additionalPrice;
		viewModel.__deductions = value.pricing.deductions;
		viewModel.__restByCheck = !!(value.pricing.restByCheck);
		viewModel.__pricingModifications = value.pricing.modification;

		viewModel.__orderDescription = value.notes.order;
		viewModel.__agreement = value.agreement;
	}
});

// Order State
Object.defineProperty(viewModel, 'status',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__status;
	},

	set: (value) =>
	{
		viewModel.__status = value;

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
		return viewModel.__notes;
	},

	set: (value) =>
	{
		viewModel.__notes = value;

		rQueryClient.setField(_notesField, value);
		_markAsModified((value === viewModel.originalOrder.notes.internal), _notesField);
	}
});

// Rush Order
Object.defineProperty(viewModel, 'rushOrder',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__rushOrder;
	},

	set: (value) =>
	{
		viewModel.__rushOrder = !!(value);

		rQueryClient.setToggleField(_rushOrderButtonSet.getElementsByTagName('input'), value);
		_markAsModified( (!!(value) === !!(viewModel.originalOrder.rushOrder)), _rushOrderButtonSet);
	}
});

// Order Pictures
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
		return viewModel.__aptSuiteNo;
	},

	set: (value) =>
	{
		viewModel.__aptSuiteNo = value;

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
		return viewModel.__city;
	},

	set: (value) =>
	{
		viewModel.__city = value;

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
		return viewModel.__state;
	},

	set: (value) =>
	{
		viewModel.__state = value;

		rQueryClient.setField(_stateField, value);
		_markAsModified((value === viewModel.originalOrder.customer.state), _stateField);
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
		_markAsModified((value === viewModel.originalOrder.customer.zipCode), _zipCodeField);

		_validate();
	}
});

// Order Post Design
Object.defineProperty(viewModel, 'postDesign',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__postDesign;
	},

	set: (value) =>
	{
		viewModel.__postDesign = value;

		// If the selection is specified as a custom design, let's do some work here to allow the entry of custom
		// design selections
		if (_orderPostDesignField.value === OTHER_SELECTION)
		{
			_otherPostDesignField.classList.add(REVEAL_CLASS);
			viewModel.__postDesign = _otherPostDesignField.value;
		}
		else
		{
			_otherPostDesignField.classList.remove(REVEAL_CLASS);
			rQueryClient.setField(_orderPostDesignField, value);
		}

		_markAsModified((viewModel.__postDesign === viewModel.originalOrder.design.post), _orderPostDesignField);
	}
});

// Handrailing
Object.defineProperty(viewModel, 'handrailing',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__handrailing;
	},

	set: (value) =>
	{
		viewModel.__handrailing = value;

		// If the selection is specified as a custom design, let's do some work here to allow the entry of custom
		// design selections
		if (_orderHandrailingField.value === OTHER_SELECTION)
		{
			_otherHandrailingField.classList.add(REVEAL_CLASS);
			viewModel.__postDesign = _otherHandrailingField.value;
		}
		else
		{
			_otherHandrailingField.classList.remove(REVEAL_CLASS);
			rQueryClient.setField(_orderHandrailingField, value);
		}

		_markAsModified((viewModel.__handrailing === viewModel.originalOrder.design.handrailing), _orderHandrailingField);
	}
});

// Picket
Object.defineProperty(viewModel, 'picket',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__picket;
	},

	set: (value) =>
	{
		viewModel.__picket = value;

		_markAsModified((viewModel.__picket === viewModel.originalOrder.design.picket), _orderPicketsField);
	}
});

// Order Post End
Object.defineProperty(viewModel, 'postEnd',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__postEnd;
	},

	set: (value) =>
	{
		viewModel.__postEnd = value;

		// If the selection is specified as a custom design, let's do some work here to allow the entry of custom
		// design selections
		if (_orderPostEndField.value === OTHER_SELECTION)
		{
			_otherPostEndField.classList.add(REVEAL_CLASS);
			viewModel.__postEnd = _otherPostEndField.value;
		}
		else
		{
			_otherPostEndField.classList.remove(REVEAL_CLASS);
			rQueryClient.setField(_orderPostEndField, value);
		}

		_markAsModified((viewModel.__postEnd === viewModel.originalOrder.design.postEnd), _orderPostEndField);
	}
});

// Order Post Cap
Object.defineProperty(viewModel, 'postCap',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__postCap;
	},

	set: (value) =>
	{
		viewModel.__postCap = value;

		// If the selection is specified as a custom design, let's do some work here to allow the entry of custom
		// design selections
		if (_orderPostCapField.value === OTHER_SELECTION)
		{
			_otherPostCapField.classList.add(REVEAL_CLASS);
			viewModel.__postCap = _otherPostCapField.value;
		}
		else
		{
			_otherPostCapField.classList.remove(REVEAL_CLASS);
			rQueryClient.setField(_orderPostCapField, value);
		}

		_markAsModified((viewModel.__postCap === viewModel.originalOrder.design.postCap), _orderPostCapField);
	}
});

// Order Center Design
Object.defineProperty(viewModel, 'centerDesign',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__centerDesign;
	},

	set: (value) =>
	{
		viewModel.__centerDesign = value;

		// If the selection is specified as a custom design, let's do some work here to allow the entry of custom
		// design selections
		if (_orderCenterDesignField.value === OTHER_SELECTION)
		{
			_otherCenterDesignField.classList.add(REVEAL_CLASS);
			viewModel.__centerDesign = _otherCenterDesignField.value;
		}
		else
		{
			_otherCenterDesignField.classList.remove(REVEAL_CLASS);
			rQueryClient.setField(_orderCenterDesignField, value);
		}

		_markAsModified((viewModel.__centerDesign === viewModel.originalOrder.design.center), _orderCenterDesignField);
	}
});

// Order Color
Object.defineProperty(viewModel, 'color',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__color;
	},

	set: (value) =>
	{
		viewModel.__color = value;

		// If the selection is specified as a custom design, let's do some work here to allow the entry of custom
		// design selections
		if (_orderColorField.value === OTHER_SELECTION)
		{
			_otherColorField.classList.add(REVEAL_CLASS);
			viewModel.__color = _otherColorField.value;
		}
		else
		{
			_otherColorField.classList.remove(REVEAL_CLASS);
			rQueryClient.setField(_orderColorField, value);
		}

		_markAsModified((viewModel.__color === viewModel.originalOrder.design.color), _orderColorField);
	}
});

// Cover Plates
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

		rQueryClient.setToggleField(_coverPlatesButtonSet.getElementsByTagName('input'), value);
		_markAsModified((viewModel.__coverPlates === !!(viewModel.originalOrder.installation.coverPlates)), _coverPlatesButtonSet);
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

		rQueryClient.setField(_platformTypeField, value);
		_markAsModified( (value === viewModel.originalOrder.installation.platformType), _platformTypeField);
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
		viewModel.__length = window.parseInt(value, 10);

		// Test whether the value qualifies as a valid price amount
		var isInvalid = (value && !(formValidator.isNumeric(value)));

		rQueryClient.updateValidationOnField(isInvalid, _lengthField, ERROR.WHOLE_NUMBER_INVALID, _validationSet);

		rQueryClient.setField(_lengthField, value, _validationSet);
		_markAsModified( (viewModel.__length === viewModel.originalOrder.length), _lengthField);

		_validate();
	}
});

// Order Finishing Height
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
		viewModel.__finishedHeight = window.parseInt(value, 10);

		// Test whether the value qualifies as a valid price amount
		var isInvalid = (value && !(formValidator.isNumeric(value)));

		rQueryClient.updateValidationOnField(isInvalid, _heightField, ERROR.WHOLE_NUMBER_INVALID, _validationSet);

		rQueryClient.setField(_heightField, value, _validationSet);
		_markAsModified( (viewModel.__finishedHeight === viewModel.originalOrder.finishedHeight), _heightField);

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
		return viewModel.__pricePerFoot;
	},

	set: (value) =>
	{
		viewModel.__pricePerFoot = value;

		// Test whether the value qualifies as a valid price amount
		var isInvalid = (value && !(formValidator.isFloat(value, '', true)));

		rQueryClient.updateValidationOnField(isInvalid, _pricePerFootField, ERROR.TOTAL_INVALID, _validationSet);

		rQueryClient.setField(_pricePerFootField, value, _validationSet);
		_markAsModified( (viewModel.__pricePerFoot === viewModel.originalOrder.pricing.pricePerFoot), _pricePerFootField);

		_validate();
	}
});

// Additional Features Text
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
		_markAsModified( (viewModel.__additionalFeatures === viewModel.originalOrder.additionalFeatures), _additionalFeaturesField);
	}
});

// Additional Price
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

		// Test whether the value qualifies as a valid price amount
		var isInvalid = (value && !(formValidator.isFloat(value, '', true)));

		rQueryClient.updateValidationOnField(isInvalid, _additionalPriceField, ERROR.TOTAL_INVALID, _validationSet);

		rQueryClient.setField(_additionalPriceField, value, _validationSet);
		_markAsModified( (viewModel.__additionalPrice === viewModel.originalOrder.pricing.additionalPrice), _additionalPriceField);

		_validate();
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

		// Test whether the value qualifies as a valid price amount
		var isInvalid = (value && !(formValidator.isFloat(value, '', true)));

		rQueryClient.updateValidationOnField(isInvalid, _deductionsField, ERROR.TOTAL_INVALID, _validationSet);

		rQueryClient.setField(_deductionsField, value, _validationSet);
		_markAsModified( (viewModel.__deductions === viewModel.originalOrder.pricing.deductions), _deductionsField);

		_validate();
	}
});

// Mixed Payment Flag
Object.defineProperty(viewModel, 'restByCheck',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__restByCheck;
	},

	set: (value) =>
	{
		viewModel.__restByCheck = !!(value);

		rQueryClient.setToggleField(_restByCheckButtonSet.getElementsByTagName('input'), value);
		_markAsModified(( !!(value) === !!(viewModel.originalOrder.pricing.restByCheck)), _restByCheckButtonSet);
	}
});

// Total Price Modification
Object.defineProperty(viewModel, 'pricingModifications',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__pricingModifications;
	},

	set: (value) =>
	{
		viewModel.__pricingModifications = value;

		// Test whether the value qualifies as a valid price amount
		var isInvalid = (value && !(formValidator.isFloat(value, '', true)));

		rQueryClient.updateValidationOnField(isInvalid, _pricingModificationsField, ERROR.TOTAL_INVALID, _validationSet);

		rQueryClient.setField(_pricingModificationsField, (value && value.toFixed ? value.toFixed(2) : value), _validationSet);
		_markAsModified((value === viewModel.originalOrder.pricing.modification), _pricingModificationsField);

		_validate();
	}
});

// Order Description
Object.defineProperty(viewModel, 'orderDescription',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__orderDescription;
	},

	set: (value) =>
	{
		viewModel.__orderDescription = value;

		rQueryClient.setField(_descriptionField, value);
		_markAsModified((value === viewModel.originalOrder.notes.order), _descriptionField);
	}
});

// Agreement
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

		rQueryClient.setField(_agreementField, value);
		_markAsModified((value === viewModel.originalOrder.agreement), _agreementField);
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

// Load a copy of the original order into the view model
viewModel.originalOrder = window.MetroRailings.order;

// ----------------- EXPORT -----------------------------

export default viewModel;