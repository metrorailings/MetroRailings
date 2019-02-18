// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderGeneral/viewModel';

import rQuery from 'client/scripts/utility/rQueryClient';
import actionModal from 'client/scripts/utility/actionModal';
import depositModal from 'client/scripts/orderGeneral/depositModal';

import designValidation from 'shared/designs/designValidation';

// ----------------- ENUMS/CONSTANTS ---------------------------

var DESIGN_ERRORS_CONTAINER = 'designErrorsContainer',
	DESIGN_ERRORS_TEMPLATE = 'designErrorsTemplate',
	DEPOSIT_MODAL_TEMPLATE = 'depositModalTemplate',

	PENDING_KEYWORD = 'pending';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
var _designErrorsContainer = document.getElementById(DESIGN_ERRORS_CONTAINER);

// ----------------- HANDLEBAR TEMPLATES ---------------------------

/**
 * The partial to render design-validation errors on page
 */
var designErrorsTemplate = Handlebars.compile(document.getElementById(DESIGN_ERRORS_TEMPLATE).innerHTML);

// ----------------- MODULE ---------------------------

var submitUtility =
{
	/**
	 * Function responsible for validating that the design selections are valid when combined together. If not,
	 * measures will be taken to ensure that the user knows which designs are missing or unable to work together
	 *
	 * @returns {boolean} - a flag indicating whether the form is indeed valid
	 *
	 * @author kinsho
	 */
	validate: function()
	{
		var designErrorMessages = [],
			designObject = rQuery.copyObject(vm.design, true);

		// First check to see if the design selections made are valid
		designErrorMessages = designErrorMessages.concat(designValidation.testRequirements(designObject));
		designErrorMessages = designErrorMessages.concat(designValidation.testPrerequisites(designObject));
		designErrorMessages = designErrorMessages.concat(designValidation.testValues(designObject));

		// If the design selections are not valid, display all the reasons why the design choices is considered invalid
		_designErrorsContainer.innerHTML = designErrorsTemplate({ errors: designErrorMessages });
		if (designErrorMessages.length)
		{
			_designErrorsContainer.scrollIntoView({ behavior: 'smooth' });
		}

		return (designErrorMessages.length === 0);
	},

	/**
	 * Function responsible for determining whether a deposit amount needs to be specified. If so, it would trigger
	 * the modal logic that ultimately asks the user what to charge for the deposit
	 *
	 * @param {Function} submissionFunction - the function to execute after the action modal has been executed
	 *
	 * @author kinsho
	 */
	figureOutDeposit: function(submissionFunction)
	{
		var modalData = { orderTotal : vm.orderTotal, defaultDeposit : vm.orderTotal / 2 };

		// Only pop out the deposit modal for orders that have not been confirmed yet
		if ( !(vm.status) || (vm.status === PENDING_KEYWORD) )
		{
			actionModal.open(document.getElementById(DEPOSIT_MODAL_TEMPLATE).innerHTML, modalData, submissionFunction, depositModal.initializeDepositModalListeners);
		}
		else
		{
			submissionFunction();
		}
	}
};

// ------------- EXPORT ---------------------

export default submitUtility;