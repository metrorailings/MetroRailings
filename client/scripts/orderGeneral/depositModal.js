// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderGeneral/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var DEPOSIT_PRICE_FIELD = 'depositPrice';

// ----------------- PRIVATE VARIABLES ---------------------------

var _depositPrice = document.getElementById(DEPOSIT_PRICE_FIELD);

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the deposit amount into the view model
 *
 * @author kinsho
 */
function setDeposit()
{
	vm.depositAmount = _depositPrice.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

// Set listeners on all the radio buttons regarding whether we should charge taxes and/or tariffs
_depositPrice.addEventListener('change', setDeposit);