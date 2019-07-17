// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderGeneral/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

const DEPOSIT_PRICE_FIELD = 'depositPrice';

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
let depositModalModule =
{
	initializeDepositModalListeners: function()
	{
		document.getElementById(DEPOSIT_PRICE_FIELD).addEventListener('change', setDeposit);

		// Initialize the view model with whatever value has been set inside the modal
		setDeposit();
	}
};

// ----------------- DATA INITIALIZATION -----------------------------

export default depositModalModule;