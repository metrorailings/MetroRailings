// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderGeneral/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var DEPOSIT_PRICE_FIELD = 'depositPrice';

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the deposit amount into the view model
 *
 * @author kinsho
 */
function setDeposit()
{
	vm.depositAmount = document.getElementById(DEPOSIT_PRICE_FIELD).value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

// Set listener initialization logic inside an exportable module so that we can call upon the logic whenever we need to
var depositModalModule =
{
	initializeDepositModalListeners: function()
	{
		document.getElementById(DEPOSIT_PRICE_FIELD).addEventListener('change', setDeposit);

		// Initialize the view model with one-half of the order total
		document.getElementById(DEPOSIT_PRICE_FIELD).value = (vm.orderTotal / 2).toFixed(2);
		setDeposit();
	}
};

export default depositModalModule;