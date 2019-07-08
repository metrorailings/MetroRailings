// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderGeneral/viewModel';
import depositModal from 'client/scripts/orderGeneral/depositModal';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';
import rQuery from 'client/scripts/utility/rQueryClient';
import actionModal from 'client/scripts/utility/actionModal';

import designValidation from 'shared/designs/designValidation';

// ----------------- ENUMS/CONSTANTS ---------------------------

const SAVE_BUTTON = 'saveButton',
	SAVE_AS_PROSPECT_BUTTON = 'tempButton',
	DESIGN_ERRORS_CONTAINER = 'designErrorsContainer',
	DESIGN_ERRORS_TEMPLATE = 'designErrorsTemplate',
	DEPOSIT_MODAL_TEMPLATE = 'depositModalTemplate',

	PROSPECT_STATUS = 'prospect',
	PENDING_STATUS = 'pending',

	SUCCESS_MESSAGE =
	{
		SAVE_ORDER: 'Success! A new order has been registered into the system.',
		SAVE_ORDER_AND_FINISH_LATER: 'Success! Whatever details you put in here have been saved...',
		SAVE_CHANGES_TO_ORDER: 'Success! Updates have been successfully saved to this order.'
	},

	ORDERS_PAGE_URL = '/orders',
	SAVE_ORDER_URL = 'orderGeneral/saveNewOrder',
	SAVE_ORDER_AND_FINISH_LATER_URL = 'orderGeneral/saveProgressOnOrder',
	SAVE_CHANGES_TO_ORDER_URL = 'orderGeneral/saveChangesToOrder';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
let _saveButton = document.getElementById(SAVE_BUTTON),
	_tempButton = document.getElementById(SAVE_AS_PROSPECT_BUTTON) || {},
	_designErrorsContainer = document.getElementById(DESIGN_ERRORS_CONTAINER);

// ----------------- HANDLEBAR TEMPLATES ---------------------------

/**
 * The partial to render design-validation errors on page
 */
let designErrorsTemplate = Handlebars.compile(document.getElementById(DESIGN_ERRORS_TEMPLATE).innerHTML);

// ----------------- PRIVATE FUNCTIONS ---------------------------

/**
 * Function responsible for validating that the design selections are valid when combined together. If not,
 * measures will be taken to ensure that the user knows which designs are missing or unable to work together
 *
 * @returns {boolean} - a flag indicating whether the form is indeed valid
 *
 * @author kinsho
 */
function _validate()
{
	let designErrorMessages = [],
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
}

/**
 * Function responsible for finally turning over all the page data to the server
 *
 * @param {String} url - the server endpoint to reach out to with the data on the form
 * @param {String} successMessage - the message to display once the request returns from the server successfully
 *
 * @author kinsho
 */
async function _submitAllData(url, successMessage)
{
	let designObject = rQuery.copyObject(vm.design, true),
		designDescriptionObject = rQuery.copyObject(vm.designDescriptions, true),
		data =
		{
			_id: vm._id || '',

			dimensions:
			{
				length: window.parseInt(vm.length, 10) || '',
				finishedHeight: window.parseInt(vm.finishedHeight, 10) || ''
			},

			text:
			{
				agreement: vm.agreement || '',
				additionalDescription: vm.additionalDescription ?
					vm.additionalDescription.split('\n\n').join('<br' + ' /><br />') : ''
			},

			installation:
			{
				platformType: vm.platformType || '',
				coverPlates: vm.coverPlates || ''
			},

			pricing:
			{
				pricePerFoot: window.parseFloat(vm.pricePerFoot) || '',
				additionalPrice: window.parseFloat(vm.additionalPrice) || '',
				isTaxApplied: vm.applyTaxes || true,
				isTariffApplied: vm.applyTariffs || true,
				depositAmount: window.parseFloat(vm.depositAmount) || ''
			},

			customer:
			{
				name: vm.name,
				company: vm.company || '',
				email: vm.email || '',
				areaCode: vm.areaCode || '',
				phoneOne: vm.phoneOne || '',
				phoneTwo: vm.phoneTwo || '',
				address: vm.address || '',
				aptSuiteNo: vm.aptSuiteNo || '',
				city: vm.city || '',
				state: vm.state || '',
				zipCode: vm.zipCode || ''
			},

			design: rQuery.prunePrivateMembers(designObject),
			designDescription: rQuery.prunePrivateMembers(designDescriptionObject)
		};

	// Disable the button to ensure the request is not accidentally sent multiple times
	_saveButton.disabled = true;
	_tempButton.disabled = true;

	try
	{
		// Make the call to the server
		await axios.post(url, data, true);

		// In the main tab, show a message indicating success and navigate the user back to the main admin page
		notifier.showSuccessMessage(successMessage);

		window.setTimeout(function()
		{
			window.location.href = ORDERS_PAGE_URL;
		}, 2000);
	}
	catch(error)
	{
		notifier.showGenericServerError();

		_saveButton.disabled = false;
		_tempButton.disabled = false;
	}
}

// ----------------- LISTENERS ---------------------------

/**
 * Function responsible for submitting the form
 *
 * @author kinsho
 */
function submit()
{
	// Organize the data that will be sent over the wire as long as the entire form is valid
	if (vm.isFormValid && _validate())
	{
		let modalData = { orderTotal : vm.orderTotal, defaultDeposit : vm.orderTotal / 2 },
			url, successMessage;

		// Determine the proper URL and relay text to ring up when we are sending data to the back-end
		if ( !(vm._id) || (vm.status === PROSPECT_STATUS) )
		{
			url = SAVE_ORDER_URL;
			successMessage = SUCCESS_MESSAGE.SAVE_ORDER;
		}
		else
		{
			url = SAVE_CHANGES_TO_ORDER_URL;
			successMessage = SUCCESS_MESSAGE.SAVE_CHANGES_TO_ORDER;
		}

		// Only pop out the deposit modal for orders that have not been confirmed yet
		if ( !(vm.status) || (vm.status === PROSPECT_STATUS) || (vm.status === PENDING_STATUS) )
		{
			// Set up a modal to figure out what the deposit amount should be for this particular order
			actionModal.open(document.getElementById(DEPOSIT_MODAL_TEMPLATE).innerHTML, modalData, () => { _submitAllData(url, successMessage); }, depositModal.initializeDepositModalListeners);
		}
		else
		{
			_submitAllData(url, successMessage);
		}
	}
}

/**
 * Function responsible for saving any information saved into the form
 *
 * @author kinsho
 */
function saveAndFinishLater()
{
	if (vm.isSaveValid)
	{
		_submitAllData(SAVE_ORDER_AND_FINISH_LATER_URL, SUCCESS_MESSAGE.SAVE_ORDER_AND_FINISH_LATER);
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_saveButton.addEventListener('click', submit);
// Only if the 'Save and Finish Later' button is actually present do we set up the next event listener
if (_tempButton.addEventListener)
{
	_tempButton.addEventListener('click', saveAndFinishLater);
}