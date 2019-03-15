// ----------------- EXTERNAL MODULES --------------------------

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

import customerSection from 'client/scripts/deckRemodelersQuestionnaire/customerSection';
import railingsSection from 'client/scripts/deckRemodelersQuestionnaire/railingsSection';
import miscellaneousDetails from 'client/scripts/deckRemodelersQuestionnaire/miscellaneousDetails';
import vm from 'client/scripts/deckRemodelersQuestionnaire/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

const SUBMIT_BUTTON = 'submitButton',

	COMPANY_NAME = 'Deck Remodelers',
	SUCCESS_MESSAGE = 'Your order form has been submitted. Check your e-mail for confirmation that the request has' +
		' been received by us. Thank you!',

	SAVE_REQUEST_INFO = 'deckRemodelersQuestionnaire/saveNewForm';

// ----------------- PRIVATE MEMBERS ---------------------------

let _submitButton = document.getElementById(SUBMIT_BUTTON);

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for submitting the form
 *
 * @author kinsho
 */
function submit()
{
	let data = {};

	// Submit the form only if all required information has been filled out
	if (vm.isFormValid)
	{
		data =
		{
			company : COMPANY_NAME,
			customerName : vm.customerName,
			projectManager : vm.projectManager,
			address : vm.address,
			city : vm.city,
			state : vm.state,
			design : vm.design,
			questions : vm.questions,
			dueDate : vm.dueDate
		};

		// Disable the button to ensure the order is not accidentally sent multiple times
		_submitButton.disabled = true;

		axios.post(SAVE_REQUEST_INFO, data, true).then(() =>
		{
			notifier.showSuccessMessage(SUCCESS_MESSAGE);

			_submitButton.disabled = false;
		}, () =>
		{
			notifier.showGenericServerError();

			_submitButton.disabled = false;
		});
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_submitButton.addEventListener('click', submit);

// ----------------- DATA INITIALIZATION ---------------------------

vm.isFormValid = false;