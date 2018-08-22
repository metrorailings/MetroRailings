// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createQuote/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var COVER_PLATES_RADIO_BUTTONS = 'coverPlates',
	PLATFORM_TYPE_SELECT = 'orderPlatformType',
	FINISHED_HEIGHT_TEXTFIELD = 'finishedHeight',
	ORDER_LENGTH_TEXTFIELD = 'orderLength',
	PRICE_PER_FOOT_TEXTFIELD = 'pricePerFoot',
	ADDITIONAL_FEATURES_TEXTAREA = 'additionalFeatures',
	ADDITIONAL_PRICE_TEXTFIELD = 'additionalPrice',
	DESCRIPTION_TEXTAREA = 'description',
	DEDUCTIONS_TEXTFIELD = 'deductions';

// ----------------- PRIVATE VARIABLES ---------------------------

var _coverPlateButtons = document.getElementsByName(COVER_PLATES_RADIO_BUTTONS),
	_orderPlatformTypeField = document.getElementById(PLATFORM_TYPE_SELECT),

	_orderLengthField = document.getElementById(ORDER_LENGTH_TEXTFIELD),
	_finishedHeightField = document.getElementById(FINISHED_HEIGHT_TEXTFIELD),
	_pricePerFootField = document.getElementById(PRICE_PER_FOOT_TEXTFIELD),
	_additionalFeaturesField = document.getElementById(ADDITIONAL_FEATURES_TEXTAREA),
	_additionalPriceField = document.getElementById(ADDITIONAL_PRICE_TEXTFIELD),
	_orderDescriptionField = document.getElementById(DESCRIPTION_TEXTAREA),
	_deductionsField = document.getElementById(DEDUCTIONS_TEXTFIELD);

// ----------------- LISTENERS ---------------------------

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
}

/**
 * Listener responsible for setting the platform type into the view model
 *
 * @author kinsho
 */
function setPlatformType()
{
	vm.platformType = _orderPlatformTypeField.value;
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
function setOrderDescription()
{
	vm.notes.order = _orderDescriptionField.value;
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

_coverPlateButtons[0].addEventListener('change', setCoverPlates);
_coverPlateButtons[1].addEventListener('change', setCoverPlates);
_orderPlatformTypeField.addEventListener('change', setPlatformType);

_orderLengthField.addEventListener('change', setLength);
_finishedHeightField.addEventListener('change', setFinishedHeight);
_pricePerFootField.addEventListener('change', setPricePerFoot);
_additionalFeaturesField.addEventListener('change', setAdditionalFeatures);
_additionalPriceField.addEventListener('change', setAdditionalPrice);
_orderDescriptionField.addEventListener('change', setOrderDescription);
_deductionsField.addEventListener('change', setDeductions);

// ----------------- DATA INITIALIZATION -----------------------------

setCoverPlates({ currentTarget: _coverPlateButtons[0] });
setPlatformType({ currentTarget: _orderPlatformTypeField });

setLength();
setFinishedHeight();
setPricePerFoot();
setAdditionalFeatures();
setAdditionalPrice();
setOrderDescription();
setDeductions();