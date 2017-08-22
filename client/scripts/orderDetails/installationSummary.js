// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderDetails/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var PLATFORM_TYPE_SELECT = 'orderPlatformType',
	COVER_PLATES_BUTTONS = 'coverPlates';

// ----------------- PRIVATE VARIABLES ---------------------------

var _platformTypeField = document.getElementById(PLATFORM_TYPE_SELECT),
	_coverPlatesButtons = document.getElementsByName(COVER_PLATES_BUTTONS);

// ----------------- PRIVATE FUNCTIONS ---------------------------

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the installation platform type into the view model
 *
 * @author kinsho
 */
function setPlatformType()
{
	vm.platformType = _platformTypeField.value;
}

/**
 * Listener responsible for setting a flag into the view model that indicates whether cover plates are needed
 *
 * @param {Event} event - the event that triggered the invocation of this listener
 *
 * @author kinsho
 */
function setCoverPlates(event)
{
	vm.coverPlates = event.currentTarget.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_platformTypeField.addEventListener('change', setPlatformType);
_coverPlatesButtons[0].addEventListener('change', setCoverPlates);
_coverPlatesButtons[1].addEventListener('change', setCoverPlates);