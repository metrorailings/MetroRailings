// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderGeneral/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var PRICE_PER_FOOT_TEXTFIELD = 'pricePerFoot',
	ADDITIONAL_PRICE_TEXTFIELD = 'additionalPrice',

	APPLY_TAXES_BUTTONSET = 'applyTaxesButtonSet',
	APPLY_TARIFFS_BUTTONSET = 'applyTariffButtonSet';

// ----------------- PRIVATE VARIABLES ---------------------------

var _pricePerFootField = document.getElementById(PRICE_PER_FOOT_TEXTFIELD),
	_additionalPriceField = document.getElementById(ADDITIONAL_PRICE_TEXTFIELD),

	_taxButtons = document.getElementById(APPLY_TAXES_BUTTONSET).getElementsByTagName('input'),
	_tariffButtons = document.getElementById(APPLY_TARIFFS_BUTTONSET).getElementsByTagName('input');

// ----------------- LISTENERS ---------------------------

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
function setAdditionalPrice()
{
	vm.additionalPrice = _additionalPriceField.value;
}

/**
 * Listener responsible for setting a flag indicating whether tax should be levied on the order
 *
 * @param {Event} event - the event associated with the firing of this event
 *
 * @author kinsho
 */
function setTaxFlag(event)
{
	vm.applyTaxes = !!(event.currentTarget.value);
}

/**
 * Listener responsible for setting a flag indicating whether a tariff charge should be levied on the order
 *
 * @param {Event} event - the event associated with the firing of this event
 *
 * @author kinsho
 */
function setTariffFlag(event)
{
	vm.applyTariffs = !!(event.currentTarget.value);
}

// ----------------- LISTENER INITIALIZATION -----------------------------

// Set listeners on all the radio buttons regarding whether we should charge taxes and/or tariffs
_taxButtons[0].addEventListener('click', setTaxFlag);
_taxButtons[1].addEventListener('click', setTaxFlag);
_tariffButtons[0].addEventListener('click', setTariffFlag);
_tariffButtons[1].addEventListener('click', setTariffFlag);

_pricePerFootField.addEventListener('change', setPricePerFoot);
_additionalPriceField.addEventListener('change', setAdditionalPrice);

// ----------------- DATA INITIALIZATION -----------------------------

setPricePerFoot();
setAdditionalPrice();

// For the tax and tariff flags, see if a value has been set when the page was rendered
if (_taxButtons[1].checked)
{
	setTaxFlag({ currentTarget: { value: false } });
}
else
{
	// The 'Yes' option is checked by default
	setTaxFlag({ currentTarget: { value: true } });
}

if (_tariffButtons[1].checked)
{
	setTariffFlag({ currentTarget: { value: false } });
}
else
{
	// The 'Yes' option is checked by default
	setTariffFlag({ currentTarget: { value: true } });
}