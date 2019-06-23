// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/shopSchedule/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

const STATUS_ICONS = 'statusIcon';

// ----------------- PRIVATE VARIABLES ---------------------------

let _statusIcons = document.getElementsByClassName(STATUS_ICONS);

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the new status into the view model
 *
 * @param {Event} event - the event responsible for invoking this function
 *
 * @author kinsho
 */
function setNewStatus(event)
{
	vm.newStatus = event.currentTarget.dataset.status;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

// Set listener initialization logic inside an exportable module so that we can call upon the logic whenever we need to
let statusModalModule =
{
	initializeStatusModalListeners: function()
	{
		for (let i = 0; i < _statusIcons.length; i += 1)
		{
			_statusIcons[i].addEventListener('click', setNewStatus);
		}

		// Set the current status as the new status
		vm.newStatus = vm.oldStatus;
	}
};

export default statusModalModule;