// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createInvoice/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var POST_DESIGN_SELECT = 'orderPost',
	POST_END_SELECT = 'orderPostEnd',
	POST_CAP_SELECT = 'orderPostCap',
	CENTER_DESIGN_SELECT = 'orderCenterDesign',
	ORDER_COLOR_SELECT = 'orderColor',

	OTHER_POST_DESIGN_TEXTFIELD = 'otherPost',
	OTHER_POST_END_TEXTFIELD = 'otherPostEnd',
	OTHER_POST_CAP_TEXTFIELD = 'otherPostCap',
	OTHER_CENTER_DESIGN_TEXTFIELD = 'otherCenterDesign',
	OTHER_COLOR_TEXTFIELD = 'otherColor',

	ORDER_LENGTH_TEXTFIELD = 'orderLength',
	PRICE_PER_FOOT_TEXTFIELD = 'pricePerFoot',
	ADDITIONAL_FEATURES_TEXTAREA = 'additionalFeatures',
	ADDITIONAL_PRICE_TEXTFIELD = 'additionalPrice',
	NOTES_TEXTAREA = 'notes',

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
	_orderPostEndField = document.getElementById(POST_END_SELECT),
	_orderPostCapField = document.getElementById(POST_CAP_SELECT),
	_orderCenterDesignField = document.getElementById(CENTER_DESIGN_SELECT),
	_orderColorField = document.getElementById(ORDER_COLOR_SELECT),

	_otherPostDesignField = document.getElementById(OTHER_POST_DESIGN_TEXTFIELD),
	_otherPostEndField = document.getElementById(OTHER_POST_END_TEXTFIELD),
	_otherPostCapField = document.getElementById(OTHER_POST_CAP_TEXTFIELD),
	_otherCenterDesignField = document.getElementById(OTHER_CENTER_DESIGN_TEXTFIELD),
	_otherColorField = document.getElementById(OTHER_COLOR_TEXTFIELD),

	_orderLengthField = document.getElementById(ORDER_LENGTH_TEXTFIELD),
	_pricePerFootField = document.getElementById(PRICE_PER_FOOT_TEXTFIELD),
	_additionalFeaturesField = document.getElementById(ADDITIONAL_FEATURES_TEXTAREA),
	_additionalPriceField = document.getElementById(ADDITIONAL_PRICE_TEXTFIELD),
	_orderNotesField = document.getElementById(NOTES_TEXTAREA);

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

	if (element.value === OTHER_SELECTION)
	{
		otherField.classList.add(SHOW_CLASS);
		otherField.value = '';
	}
	else
	{
		otherField.classList.remove(SHOW_CLASS);
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

	vm.design.post = (isOtherSelected ? '' : element.value);
	vm.validate();

	_resetDesignDropdowns();

	// Only consider toggling the visibility of the companion 'Other' textfield if we are dealing with the select
	// dropdown here
	if ( !(element.classList.contains(OTHER_VALUE_FIELD_CLASS)) )
	{
		_toggleOtherFieldVisibility(_orderPostDesignField);
	}

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
 * Listener responsible for setting the post end design into the view model
 *
 * @author kinsho
 */
function setPostEnd(event)
{
	var element = event.currentTarget,
		isOtherSelected = (element.value === OTHER_SELECTION);

	vm.design.postEnd = (isOtherSelected ? '' : element.value);
	vm.validate();

	// Only consider toggling the visibility of the companion 'Other' textfield if we are dealing with the select
	// dropdown here
	if (!(element.classList.contains(OTHER_VALUE_FIELD_CLASS)))
	{
		_toggleOtherFieldVisibility(_orderPostEndField);
	}
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

	vm.design.postEnd = (isOtherSelected ? '' : element.value);
	vm.validate();

	// Only consider toggling the visibility of the companion 'Other' textfield if we are dealing with the select
	// dropdown here
	if (!(element.classList.contains(OTHER_VALUE_FIELD_CLASS)))
	{
		_toggleOtherFieldVisibility(_orderPostCapField);
	}
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

	vm.design.center = (isOtherSelected ? '' : element.value);
	vm.validate();

	// Only consider toggling the visibility of the companion 'Other' textfield if we are dealing with the select
	// dropdown here
	if (!(element.classList.contains(OTHER_VALUE_FIELD_CLASS)))
	{
		_toggleOtherFieldVisibility(_orderCenterDesignField);
	}
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

	vm.design.color = (isOtherSelected ? '' : element.value);
	vm.validate();

	// Only consider toggling the visibility of the companion 'Other' textfield if we are dealing with the select
	// dropdown here
	if (!(element.classList.contains(OTHER_VALUE_FIELD_CLASS)))
	{
		_toggleOtherFieldVisibility(_orderColorField);
	}
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

// ----------------- LISTENER INITIALIZATION -----------------------------

_orderPostDesignField.addEventListener('change', setPostDesign);
_orderPostEndField.addEventListener('change', setPostEnd);
_orderPostCapField.addEventListener('change', setPostCap);
_orderCenterDesignField.addEventListener('change', setCenterDesign);
_orderColorField.addEventListener('change', setColor);

_otherPostDesignField.addEventListener('change', setPostDesign);
_otherPostEndField.addEventListener('change', setPostEnd);
_otherPostCapField.addEventListener('change', setPostCap);
_otherCenterDesignField.addEventListener('change', setCenterDesign);
_otherColorField.addEventListener('change', setColor);

_orderLengthField.addEventListener('change', setLength);
_pricePerFootField.addEventListener('change', setPricePerFoot);
_additionalFeaturesField.addEventListener('change', setAdditionalFeatures);
_additionalPriceField.addEventListener('change', setAdditionalPrice);
_orderNotesField.addEventListener('change', setOrderNotes);

// ----------------- DATA INITIALIZATION -----------------------------

vm.design = {};
vm.notes = {};

setPostDesign({ currentTarget: _orderPostDesignField });
setPostEnd({ currentTarget: _orderPostEndField });
setPostCap({ currentTarget: _orderPostCapField });
setCenterDesign({ currentTarget: _orderCenterDesignField });
setColor({ currentTarget: _orderColorField });

setLength();
setPricePerFoot();
setAdditionalFeatures();
setAdditionalPrice();
setOrderNotes();