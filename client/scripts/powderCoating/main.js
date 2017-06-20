// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/powderCoating/viewModel';
import typeSection from 'client/scripts/powderCoating/typeSection';

// ----------------- ENUMS/CONSTANTS ---------------------------

var PICTURE_BUTTON_CLASS = 'pictureButton',
	PRESS_DOWN_CLASS = 'pressDown';

// ----------------- LISTENERS ---------------------------

/**
 * An event that attaches a class to simulate a button press on a picture icon
 *
 * @param {Event} event - the event associated with the firing of this listener
 */
function pictureButtonPressed(event)
{
	event.currentTarget.classList.add(PRESS_DOWN_CLASS);
}

/**
 * An event that attaches a class to simulate a button release on a picture icon
 *
 * @param {Event} event - the event associated with the firing of this listener
 */
function pictureButtonReleased(event)
{
	event.currentTarget.classList.remove(PRESS_DOWN_CLASS);
}

// ----------------- LISTENER INITIALIZATION -----------------------------

var pictureButtons = document.getElementsByClassName(PICTURE_BUTTON_CLASS),
	i;

// Attach standardized event listeners to the picture icons on the page
for (i = 0; i < pictureButtons.length; i++)
{
	pictureButtons[i].addEventListener('mousedown', pictureButtonPressed);
	pictureButtons[i].addEventListener('mouseup', pictureButtonReleased);
}

// ----------------- DATA INITIALIZATION -----------------------------

vm.userProgress = 1;