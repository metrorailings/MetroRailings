// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createOrder/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var SECTION_ID = 'typeSection',
	STAIRS_CHECKBOX = 'stairsCheckbox',
	DECK_CHECKBOX = 'deckCheckbox',

	PICTURE_BUTTON_CLASS = 'pictureButton';

// ----------------- PRIVATE FUNCTIONS ---------------------------

// ----------------- LISTENERS ---------------------------

/**
 * An event that sets the type of railings needed within the view model
 *
 * @param {Event} event - the event associated with the firing of this listener
 */
function setRailingsType(event)
{
	var element = event.currentTarget,
		type = element.dataset.type || element.value;

	vm.orderType = type;
}

// ----------------- DATA INITIALIZATION -----------------------------

// ----------------- LISTENER INITIALIZATION -----------------------------

var pictureButtons = document.getElementById(SECTION_ID).getElementsByClassName(PICTURE_BUTTON_CLASS),
	i;

// Attach event listeners to the railings type checkboxes as well as their associated picture buttons
document.getElementById(STAIRS_CHECKBOX).addEventListener('click', setRailingsType);
document.getElementById(DECK_CHECKBOX).addEventListener('click', setRailingsType);

for (i = 0; i < pictureButtons.length; i++)
{
	pictureButtons[i].addEventListener('click', setRailingsType);
}

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

vm.orderType = '';