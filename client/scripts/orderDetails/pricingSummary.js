// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderDetails/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var REST_BY_CHECK_BUTTONS = 'restByCheck',
	TOTAL_PRICE_MODIFICATIONS_FIELD = 'priceModifications';

// ----------------- PRIVATE VARIABLES ---------------------------

var _restByCheckButtons = document.getElementsByName(REST_BY_CHECK_BUTTONS),
	_priceModificationsField = document.getElementById(TOTAL_PRICE_MODIFICATIONS_FIELD);

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting mixed payment flag
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

_priceModificationsField.addEventListener('change', setModifiedPrice);

if (_restByCheckButtons.length)
{
	for (var j = 0; j < 2; j++)
	{
		_restByCheckButtons[j].addEventListener('change', setMixedPaymentFlag);
	}
}