// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderDetails/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var LENGTH_FIELD = 'orderLength',
	HEIGHT_FIELD = 'orderFinishedHeight',
	PRICE_PER_FOOT_FIELD = 'pricePerFoot',
	ADDITIONAL_FEATURES_TEXTAREA = 'additionalFeatures',
	ADDITIONAL_PRICE_FIELD = 'additionalPrice',
	DEDUCTIONS_FIELD = 'deductions',
	REST_BY_CHECK_BUTTONS = 'restByCheck',
	TOTAL_PRICE_MODIFICATIONS_FIELD = 'priceModifications';

// ----------------- PRIVATE VARIABLES ---------------------------

var _lengthField = document.getElementById(LENGTH_FIELD),
	_heightField = document.getElementById(HEIGHT_FIELD),
	_pricePerFootField = document.getElementById(PRICE_PER_FOOT_FIELD) || { value: '', addEventListener: () => {} },
	_additionalFeaturesField = document.getElementById(ADDITIONAL_FEATURES_TEXTAREA) || { value: '', addEventListener: () => {} },
	_additionalPriceField = document.getElementById(ADDITIONAL_PRICE_FIELD) || { value: '', addEventListener: () => {} },
	_deductionsField = document.getElementById(DEDUCTIONS_FIELD) || { value: '', addEventListener: () => {} },
	_restByCheckButtons = document.getElementsByName(REST_BY_CHECK_BUTTONS),
	_priceModificationsField = document.getElementById(TOTAL_PRICE_MODIFICATIONS_FIELD) || { value: '', addEventListener: () => {} };

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
 * Listener responsible for setting the price per foot of this order into the view model
 *
 * @author kinsho
 */
function setPricePerFoot()
{
	vm.pricePerFoot = _pricePerFootField.value;
}

/**
 * Listener responsible for setting any text relating to additional features into the view model
 *
 * @author kinsho
 */
function setAdditionalFeatures()
{
	vm.additionalFeatures = _additionalFeaturesField.value;
}

/**
 * Listener responsible for setting any additional pricing on this order into the view model
 *
 * @author kinsho
 */
function setAdditionalPrice()
{
	vm.additionalPrice = _additionalPriceField.value;
}

/**
 * Listener responsible for setting any deductions to the order total into the view model
 *
 * @author kinsho
 */
function setDeductions()
{
	vm.deductions = _deductionsField.value;
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
_pricePerFootField.addEventListener('change', setPricePerFoot);
_additionalFeaturesField.addEventListener('change', setAdditionalFeatures);
_additionalPriceField.addEventListener('change', setAdditionalPrice);
_deductionsField.addEventListener('change', setDeductions);
_priceModificationsField.addEventListener('change', setModifiedPrice);

if (_restByCheckButtons.length)
{
	_restByCheckButtons[0].addEventListener('change', setMixedPaymentFlag);
	_restByCheckButtons[1].addEventListener('change', setMixedPaymentFlag);
}