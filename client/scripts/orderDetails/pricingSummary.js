// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderDetails/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var LENGTH_FIELD = 'orderLength',
	HEIGHT_FIELD = 'orderFinishedHeight',
	REST_BY_CHECK_BUTTONS = 'restByCheck',
	TOTAL_PRICE_MODIFICATIONS_FIELD = 'priceModifications';

// ----------------- PRIVATE VARIABLES ---------------------------

var _lengthField = document.getElementById(LENGTH_FIELD),
	_heightField = document.getElementById(HEIGHT_FIELD),
	_restByCheckButtons = document.getElementsByName(REST_BY_CHECK_BUTTONS),
	_priceModificationsField = document.getElementById(TOTAL_PRICE_MODIFICATIONS_FIELD);

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the length of the railing for the order into the view model
 *
 * @author kinsho
 */
function setLength()
{
	vm.length = _lengthField.value;
}

/**
 * Listener responsible for setting the height of the railing for the order into the view model
 *
 * @author kinsho
 */
function setHeight()
{
	vm.finishedHeight = _heightField.value;
}

/**
 * Listener responsible for setting the mixed payment flag into the view model
 *
 * @param {Event} event - the event associated with the firing of this listener
 *
 * @author kinsho
 */
function setMixedPaymentFlag(event)
{
	vm.restByCheck = !!(event.currentTarget.value);
}

/**
 * Listener responsible for setting the total price modification into the view model
 *
 * @author kinsho
 */
function setModifiedPrice()
{
	vm.pricingModifications = _priceModificationsField.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_lengthField.addEventListener('change', setLength);
_heightField.addEventListener('change', setHeight);
_priceModificationsField.addEventListener('change', setModifiedPrice);

if (_restByCheckButtons.length)
{
	_restByCheckButtons[0].addEventListener('change', setMixedPaymentFlag);
	_restByCheckButtons[1].addEventListener('change', setMixedPaymentFlag);
}