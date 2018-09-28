// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createQuote/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var APPLY_TAXES_BUTTONSET = 'applyTaxesButtonSet',
	APPLY_TARIFFS_BUTTONSET = 'applyTariffButtonSet';

// ----------------- PRIVATE VARIABLES ---------------------------

var _taxButtons = document.getElementById(APPLY_TAXES_BUTTONSET).getElementsByTagName('input'),
	_tariffButtons = document.getElementById(APPLY_TARIFFS_BUTTONSET).getElementsByTagName('input');

// ----------------- LISTENERS ---------------------------

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

// ----------------- DATA INITIALIZATION -----------------------------

setTaxFlag({ currentTarget: { value: true } });
setTariffFlag({ currentTarget: { value: true } });