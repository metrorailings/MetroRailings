// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createOrder/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var SECTION_ID = 'typeSection',

	WHEELS_CHECKBOX = 'wheelsCheckbox',
	MOTORCYCLE_CHECKBOX = 'motorcycleCheckbox',
	ATV_CHECKBOX = 'atvCheckbox',
	OTHER_METALS_CHECKBOX = 'otherCheckbox',

	PICTURE_BUTTON_CLASS = 'pictureButton';

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
document.getElementById(WHEELS_CHECKBOX).addEventListener('click', setRailingsType);
document.getElementById(MOTORCYCLE_CHECKBOX).addEventListener('click', setRailingsType);
document.getElementById(ATV_CHECKBOX).addEventListener('click', setRailingsType);
document.getElementById(OTHER_METALS_CHECKBOX).addEventListener('click', setRailingsType);

for (i = 0; i < pictureButtons.length; i++)
{
	pictureButtons[i].addEventListener('click', setRailingsType);
}

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

vm.orderType = '';