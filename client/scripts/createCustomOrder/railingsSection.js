// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createCustomOrder/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var ORDER_TYPE_SELECT = 'orderType',
	POST_DESIGN_SELECT = 'orderPost',
	POST_END_SELECT = 'orderPostEnd',
	POST_CAP_SELECT = 'orderPostCap',
	CENTER_DESIGN_SELECT = 'orderCenterDesign',
	ORDER_COLOR_SELECT = 'orderColor',
	ORDER_LENGTH_TEXTFIELD = 'orderLength',
	PRICE_PER_FOOT_TEXTFIELD = 'pricePerFoot',
	CUSTOM_FEATURES_TEXTAREA = 'customFeatures',
	CUSTOM_PRICE_TEXTFIELD = 'customPrice',

	ORDER_TYPES =
	{
		STAIRS: 'stairs',
		DECK: 'deck'
	},

	POST_DESIGNS =
	{
		COLONIAL_BIG_POST: 'P-BPC',
		STANDARD_SMALL_POST: 'P-SP'
	},

	HIDE_CLASS = 'hide';

// ----------------- PRIVATE VARIABLES ---------------------------

var _orderTypeField = document.getElementById(ORDER_TYPE_SELECT),
	_orderPostDesignField = document.getElementById(POST_DESIGN_SELECT),
	_orderPostEndField = document.getElementById(POST_END_SELECT),
	_orderPostCapField = document.getElementById(POST_CAP_SELECT),
	_orderCenterDesignField = document.getElementById(CENTER_DESIGN_SELECT),
	_orderColorField = document.getElementById(ORDER_COLOR_SELECT),
	_orderLengthField = document.getElementById(ORDER_LENGTH_TEXTFIELD),
	_pricePerFootField = document.getElementById(PRICE_PER_FOOT_TEXTFIELD),
	_customFeaturesField = document.getElementById(CUSTOM_FEATURES_TEXTAREA),
	_customPriceField = document.getElementById(CUSTOM_PRICE_TEXTFIELD);

// ----------------- PRIVATE METHODS ---------------------------

/**
 * Function meant to reset and/or disable certain design dropdowns depending on the selections
 * made in other design-related dropdowns
 *
 * @author kinsho
 */
function _resetDesignDropdowns()
{
	// Disable the post design box should we be building deck railings
	if (vm.type === ORDER_TYPES.DECK)
	{
		_orderPostDesignField.value = POST_DESIGNS.COLONIAL_BIG_POST;
		_orderPostDesignField.disabled = true;

		vm.design.post = POST_DESIGNS.COLONIAL_BIG_POST;
	}
	else
	{
		_orderPostDesignField.disabled = false;
	}

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
}

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the order type into the view model
 *
 * @author kinsho
 */
function setType()
{
	vm.type = _orderTypeField.value;

	_resetDesignDropdowns();
}

/**
 * Listener responsible for setting the post design into the view model
 *
 * @author kinsho
 */
function setPostDesign()
{
	vm.design.post = _orderPostDesignField.value;

	_resetDesignDropdowns();

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
function setPostEnd()
{
	vm.design.postEnd = _orderPostEndField.value;
}

/**
 * Listener responsible for setting the post cap design into the view model
 *
 * @author kinsho
 */
function setPostCap()
{
	vm.design.postCap = _orderPostCapField.value;
}

/**
 * Listener responsible for setting the center design into the view model
 *
 * @author kinsho
 */
function setCenterDesign()
{
	vm.design.center = _orderCenterDesignField.value;
}

/**
 * Listener responsible for setting the order color into the view model
 *
 * @author kinsho
 */
function setColor()
{
	vm.design.color = _orderColorField.value;
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
 * Listener responsible for setting the text for custom features into the view model
 *
 * @author kinsho
 */
function setCustomFeatures()
{
	vm.customFeatures = _customFeaturesField.value;
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
 * Listener responsible for setting the additional price of custom features into the view model
 *
 * @author kinsho
 */
function setCustomPrice()
{
	vm.customPrice = _customPriceField.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_orderTypeField.addEventListener('change', setType);
_orderPostDesignField.addEventListener('change', setPostDesign);
_orderPostEndField.addEventListener('change', setPostEnd);
_orderPostCapField.addEventListener('change', setPostCap);
_orderCenterDesignField.addEventListener('change', setCenterDesign);
_orderColorField.addEventListener('change', setColor);
_orderLengthField.addEventListener('change', setLength);
_pricePerFootField.addEventListener('change', setPricePerFoot);
_customFeaturesField.addEventListener('change', setCustomFeatures);
_customPriceField.addEventListener('change', setCustomPrice);

// ----------------- DATA INITIALIZATION -----------------------------

vm.design = {};

setType();
setPostDesign();
setPostEnd();
setPostCap();
setCenterDesign();
setColor();
setLength();
setPricePerFoot();
setCustomFeatures();
setCustomPrice();