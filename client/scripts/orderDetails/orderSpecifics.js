// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderDetails/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var ORDER_TYPE_SELECT = 'orderType',
	POST_DESIGN_SELECT = 'orderPost',
	POST_END_SELECT = 'orderPostEnd',
	POST_CAP_SELECT = 'orderPostCap',
	CENTER_DESIGN_SELECT = 'orderCenterDesign',
	ORDER_COLOR_SELECT = 'orderColor',
	ORDER_LENGTH_TEXTFIELD = 'orderLength',
	TOTAL_PRICE_TEXTFIELD = 'totalPrice';

// ----------------- PRIVATE VARIABLES ---------------------------

var _orderTypeField = document.getElementById(ORDER_TYPE_SELECT),
	_orderPostDesignField = document.getElementById(POST_DESIGN_SELECT),
	_orderPostEndField = document.getElementById(POST_END_SELECT),
	_orderPostCapField = document.getElementById(POST_CAP_SELECT),
	_orderCenterDesignField = document.getElementById(CENTER_DESIGN_SELECT),
	_orderColorField = document.getElementById(ORDER_COLOR_SELECT),
	_orderLengthField = document.getElementById(ORDER_LENGTH_TEXTFIELD),
	_totalPriceField = document.getElementById(TOTAL_PRICE_TEXTFIELD);

// ----------------- PRIVATE FUNCTIONS ---------------------------

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the order type into the view model
 *
 * @author kinsho
 */
function setType()
{
	vm.type = _orderTypeField.value;
}

/**
 * Listener responsible for setting the post design into the view model
 *
 * @author kinsho
 */
function setPostDesign()
{
	vm.postDesign = _orderPostDesignField.value;
}

/**
 * Listener responsible for setting the post end design into the view model
 *
 * @author kinsho
 */
function setPostEnd()
{
	vm.postEnd = _orderPostEndField.value;
}

/**
 * Listener responsible for setting the post cap design into the view model
 *
 * @author kinsho
 */
function setPostCap()
{
	vm.postCap = _orderPostCapField.value;
}

/**
 * Listener responsible for setting the center design into the view model
 *
 * @author kinsho
 */
function setCenterDesign()
{
	vm.centerDesign = _orderCenterDesignField.value;
}

/**
 * Listener responsible for setting the order color into the view model
 *
 * @author kinsho
 */
function setColor()
{
	vm.color = _orderColorField.value;
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
 * Listener responsible for setting the total price of an order into the view model
 *
 * @author kinsho
 */
function setTotalPrice()
{
	vm.orderTotal = _totalPriceField.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_orderTypeField.addEventListener('change', setType);
_orderPostDesignField.addEventListener('change', setPostDesign);
_orderPostEndField.addEventListener('change', setPostEnd);
_orderPostCapField.addEventListener('change', setPostCap);
_orderCenterDesignField.addEventListener('change', setCenterDesign);
_orderColorField.addEventListener('change', setColor);
_orderLengthField.addEventListener('change', setLength);
_totalPriceField.addEventListener('change', setTotalPrice);