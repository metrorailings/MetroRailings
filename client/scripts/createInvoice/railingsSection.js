// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createInvoice/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var POST_DESIGN_SELECT = 'orderPost',
	HANDRAILING_SELECT = 'orderHandrailing',
	PICKET_SELECT = 'orderPicketSize',
	POST_END_SELECT = 'orderPostEnd',
	POST_CAP_SELECT = 'orderPostCap',
	CENTER_DESIGN_SELECT = 'orderCenterDesign',
	ORDER_COLOR_SELECT = 'orderColor',

	COVER_PLATES_RADIO_BUTTONS = 'coverPlates',
	PLATFORM_TYPE_SELECT = 'orderPlatformType',

	OTHER_POST_DESIGN_TEXTFIELD = 'otherPost',
	OTHER_HANDRAILING_TEXTFIELD = 'otherHandrailing',
	OTHER_POST_END_TEXTFIELD = 'otherPostEnd',
	OTHER_POST_CAP_TEXTFIELD = 'otherPostCap',
	OTHER_CENTER_DESIGN_TEXTFIELD = 'otherCenterDesign',
	OTHER_COLOR_TEXTFIELD = 'otherColor',

	FINISHED_HEIGHT_TEXTFIELD = 'finishedHeight',
	ORDER_LENGTH_TEXTFIELD = 'orderLength',
	PRICE_PER_FOOT_TEXTFIELD = 'pricePerFoot',
	ADDITIONAL_FEATURES_TEXTAREA = 'additionalFeatures',
	ADDITIONAL_PRICE_TEXTFIELD = 'additionalPrice',
	NOTES_TEXTAREA = 'notes',
	DEDUCTIONS_TEXTFIELD = 'deductions',

	OTHER_VALUE_FIELD_CLASS = 'otherTextfield',
	HIDE_CLASS = 'hide',
	SHOW_CLASS = 'show',

	OTHER_SELECTION = 'OTHER',

	POST_DESIGNS =
	{
		COLONIAL_BIG_POST: 'P-BPC',
		STANDARD_SMALL_POST: 'P-SP'
	};

// ----------------- PRIVATE VARIABLES ---------------------------

var _orderPostDesignField = document.getElementById(POST_DESIGN_SELECT),
	_orderHandrailingField = document.getElementById(HANDRAILING_SELECT),
	_orderPicketField = document.getElementById(PICKET_SELECT),
	_orderPostEndField = document.getElementById(POST_END_SELECT),
	_orderPostCapField = document.getElementById(POST_CAP_SELECT),
	_orderCenterDesignField = document.getElementById(CENTER_DESIGN_SELECT),
	_orderColorField = document.getElementById(ORDER_COLOR_SELECT),

	_otherPostDesignField = document.getElementById(OTHER_POST_DESIGN_TEXTFIELD),
	_otherHandrailingField = document.getElementById(OTHER_HANDRAILING_TEXTFIELD),
	_otherPostEndField = document.getElementById(OTHER_POST_END_TEXTFIELD),
	_otherPostCapField = document.getElementById(OTHER_POST_CAP_TEXTFIELD),
	_otherCenterDesignField = document.getElementById(OTHER_CENTER_DESIGN_TEXTFIELD),
	_otherColorField = document.getElementById(OTHER_COLOR_TEXTFIELD),

	_coverPlateButtons = document.getElementsByName(COVER_PLATES_RADIO_BUTTONS),
	_orderPlatformTypeField = document.getElementById(PLATFORM_TYPE_SELECT),

	_orderLengthField = document.getElementById(ORDER_LENGTH_TEXTFIELD),
	_finishedHeightField = document.getElementById(FINISHED_HEIGHT_TEXTFIELD),
	_pricePerFootField = document.getElementById(PRICE_PER_FOOT_TEXTFIELD),
	_additionalFeaturesField = document.getElementById(ADDITIONAL_FEATURES_TEXTAREA),
	_additionalPriceField = document.getElementById(ADDITIONAL_PRICE_TEXTFIELD),
	_orderNotesField = document.getElementById(NOTES_TEXTAREA),
	_deductionsField = document.getElementById(DEDUCTIONS_TEXTFIELD);

// ----------------- PRIVATE METHODS ---------------------------

/**
 * Function meant to reset and/or disable certain design dropdowns depending on the selections
 * made in other design-related dropdowns
 *
 * @author kinsho
 */
function _resetDesignDropdowns()
{
	// Figure out whether to show post ends or post caps depending on the post design currently selected
	if (vm.design.post === POST_DESIGNS.COLONIAL_BIG_POST)
	{
		_orderPostEndField.parentNode.classList.add(HIDE_CLASS);
		_orderPostCapField.parentNode.classList.remove(HIDE_CLASS);

		_orderPostEndField.value = '';
	}
	else if (vm.design.post === POST_DESIGNS.STANDARD_SMALL_POST)
	{
		_orderPostEndField.parentNode.classList.remove(HIDE_CLASS);
		_orderPostCapField.parentNode.classList.add(HIDE_CLASS);

		_orderPostCapField.value = '';
	}
	else
	{
		_orderPostEndField.parentNode.classList.remove(HIDE_CLASS);
		_orderPostCapField.parentNode.classList.remove(HIDE_CLASS);

		_orderPostEndField.value = '';
		_orderPostCapField.value = '';
	}
}

/**
 * Function meant to show the 'Other' field to allow the user to put in unlisted values for any design option
 *
 * @param {DOMElement} element - the element which to examine to determine if its companion 'Other' textfield should
 * 		be shown or hidden
 *
 * @author kinsho
 */
function _toggleOtherFieldVisibility(element)
{
	var otherField = element.nextSibling;

	// Only consider toggling the visibility of the companion 'Other' textfield if we are dealing with the select
	// dropdown here
	if ( !(element.classList.contains(OTHER_VALUE_FIELD_CLASS)) )
	{
		if (element.value === OTHER_SELECTION)
		{
			otherField.classList.add(SHOW_CLASS);
		}
		else
		{
			otherField.classList.remove(SHOW_CLASS);
		}
	}
}

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the post design into the view model
 *
 * @author kinsho
 */
function setPostDesign(event)
{
	var element = event.currentTarget,
		isOtherSelected = (element.value === OTHER_SELECTION);

	vm.design.post = (isOtherSelected ? _otherPostDesignField.value : element.value);

	vm.validate();
	_resetDesignDropdowns();
	_toggleOtherFieldVisibility(_orderPostDesignField);

	// Clear away certain design selections that may have been made prior to this field changing value
	if (vm.design.post === POST_DESIGNS.COLONIAL_BIG_POST)
	{
		vm.design.postEnd = '';
	}
	else if (vm.design.post === POST_DESIGNS.STANDARD_SMALL_POST)
	{
		vm.design.postCap = '';
	}
}

/**
 * Listener responsible for setting the handrailing type into the view model
 *
 * @author kinsho
 */
function setHandrailing(event)
{
	var element = event.currentTarget,
		isOtherSelected = (element.value === OTHER_SELECTION);

	vm.design.handrailing = (isOtherSelected ? _otherHandrailingField.value : element.value);

	vm.validate();
	_toggleOtherFieldVisibility(_orderHandrailingField);
}

/**
 * Listener responsible for setting the picket size into the view model
 *
 * @author kinsho
 */
function setPicketSize()
{
	vm.design.picket = _orderPicketField.value;

	vm.validate();
}

/**
 * Listener responsible for setting the post end design into the view model
 *
 * @author kinsho
 */
function setPostEnd(event)
{
	var element = event.currentTarget,
		isOtherSelected = (element.value === OTHER_SELECTION);

	vm.design.postEnd = (isOtherSelected ? _otherPostEndField.value : element.value);

	vm.validate();
	_toggleOtherFieldVisibility(_orderPostEndField);
}

/**
 * Listener responsible for setting the post cap design into the view model
 *
 * @author kinsho
 */
function setPostCap(event)
{
	var element = event.currentTarget,
		isOtherSelected = (element.value === OTHER_SELECTION);

	vm.design.postCap = (isOtherSelected ? _otherPostCapField.value : element.value);

	vm.validate();
	_toggleOtherFieldVisibility(_orderPostCapField);
}

/**
 * Listener responsible for setting the center design into the view model
 *
 * @author kinsho
 */
function setCenterDesign(event)
{
	var element = event.currentTarget,
		isOtherSelected = (element.value === OTHER_SELECTION);

	vm.design.center = (isOtherSelected ? _otherCenterDesignField.value : element.value);

	vm.validate();
	_toggleOtherFieldVisibility(_orderCenterDesignField);
}

/**
 * Listener responsible for setting the order color into the view model
 *
 * @author kinsho
 */
function setColor(event)
{
	var element = event.currentTarget,
		isOtherSelected = (element.value === OTHER_SELECTION);

	vm.design.color = (isOtherSelected ? _otherColorField.value : element.value);

	vm.validate();
	_toggleOtherFieldVisibility(_orderColorField);
}

/**
 * Listener responsible for setting a flag into the view model indicating whether cover plates are necessary
 *
 * @param {Event} event - the event object associated with the firing of this listener
 *
 * @author kinsho
 */
function setCoverPlates(event)
{
	vm.coverPlates = event.currentTarget.value;

	vm.validate();
}

/**
 * Listener responsible for setting the platform type into the view model
 *
 * @author kinsho
 */
function setPlatformType()
{
	vm.platformType = _orderPlatformTypeField.value;

	vm.validate();
}

/**
 * Listener responsible for setting the order length into the view model
 *
 * @author kinsho
 */
function setLength()
{
	vm.length = _orderLengthField.value;
}

/**
 * Listener responsible for setting the finish height into the view model
 *
 * @author kinsho
 */
function setFinishedHeight()
{
	vm.finishedHeight = _finishedHeightField.value;
}

/**
 * Listener responsible for setting the price per footage of a custom order into the view model
 *
 * @author kinsho
 */
function setPricePerFoot()
{
	vm.pricePerFoot = _pricePerFootField.value;
}

/**
 * Listener responsible for setting the text for custom features into the view model
 *
 * @author kinsho
 */
function setAdditionalFeatures()
{
	vm.additionalFeatures = _additionalFeaturesField.value;
}

/**
 * Listener responsible for setting the additional price of custom features into the view model
 *
 * @author kinsho
 */
function setAdditionalPrice()
{
	vm.additionalPrice = _additionalPriceField.value;
}

/**
 * Listener responsible for setting order-specific notes into the view model
 *
 * @author kinsho
 */
function setOrderNotes()
{
	vm.notes.order = _orderNotesField.value;
}

/**
 * Listener responsible for setting any discounts on this order into the view model
 *
 * @author kinsho
 */
function setDeductions()
{
	vm.deductions = _deductionsField.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_orderPostDesignField.addEventListener('change', setPostDesign);
_orderHandrailingField.addEventListener('change', setHandrailing);
_orderPicketField.addEventListener('change', setPicketSize);
_orderPostEndField.addEventListener('change', setPostEnd);
_orderPostCapField.addEventListener('change', setPostCap);
_orderCenterDesignField.addEventListener('change', setCenterDesign);
_orderColorField.addEventListener('change', setColor);

_otherPostDesignField.addEventListener('change', setPostDesign);
_otherHandrailingField.addEventListener('change', setHandrailing);
_otherPostEndField.addEventListener('change', setPostEnd);
_otherPostCapField.addEventListener('change', setPostCap);
_otherCenterDesignField.addEventListener('change', setCenterDesign);
_otherColorField.addEventListener('change', setColor);

_coverPlateButtons[0].addEventListener('change', setCoverPlates);
_coverPlateButtons[1].addEventListener('change', setCoverPlates);
_orderPlatformTypeField.addEventListener('change', setPlatformType);

_orderLengthField.addEventListener('change', setLength);
_finishedHeightField.addEventListener('change', setFinishedHeight);
_pricePerFootField.addEventListener('change', setPricePerFoot);
_additionalFeaturesField.addEventListener('change', setAdditionalFeatures);
_additionalPriceField.addEventListener('change', setAdditionalPrice);
_orderNotesField.addEventListener('change', setOrderNotes);
_deductionsField.addEventListener('change', setDeductions);

// ----------------- DATA INITIALIZATION -----------------------------

vm.design = {};
vm.installation = {};
vm.notes = {};

setPostDesign({ currentTarget: _orderPostDesignField });
setHandrailing({ currentTarget: _orderHandrailingField });
setPicketSize({ currentTarget: _orderPicketField });
setPostEnd({ currentTarget: _orderPostEndField });
setPostCap({ currentTarget: _orderPostCapField });
setCenterDesign({ currentTarget: _orderCenterDesignField });
setColor({ currentTarget: _orderColorField });

setCoverPlates({ currentTarget: _coverPlateButtons[0] });
setPlatformType({ currentTarget: _orderPlatformTypeField });

setLength();
setFinishedHeight();
setPricePerFoot();
setAdditionalFeatures();
setAdditionalPrice();
setOrderNotes();
setDeductions();