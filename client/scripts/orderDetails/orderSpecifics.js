// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderDetails/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var ORDER_TYPE_SELECT = 'orderType',
	ORDER_STYLE_SELECT = 'orderStyle',
	ORDER_COLOR_SELECT = 'orderColor',
	ORDER_LENGTH_TEXTFIELD = 'orderLength',
	TOTAL_PRICE_TEXTFIELD = 'totalPrice';

// ----------------- PRIVATE VARIABLES ---------------------------

var _orderTypeField = document.getElementById(ORDER_TYPE_SELECT),
	_orderStyleField = document.getElementById(ORDER_STYLE_SELECT),
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
 * Listener responsible for setting the order style into the view model
 *
 * @author kinsho
 */
function setStyle()
{
	vm.style = _orderStyleField.value;
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
_orderStyleField.addEventListener('change', setStyle);
_orderColorField.addEventListener('change', setColor);
_orderLengthField.addEventListener('change', setLength);
_totalPriceField.addEventListener('change', setTotalPrice);