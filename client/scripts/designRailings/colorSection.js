// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/designRailings/viewModel';

import rQuery from 'client/scripts/utility/rQueryClient';
import gallery from 'client/scripts/utility/gallery';

// ----------------- ENUMS/CONSTANTS ---------------------------

var COLOR_DEMO_PICTURE = 'colorDemoPicture',
	COLOR_DEMO_LABEL = 'colorDemoName',
	WHITE_COLOR_OPTION = 'whiteColor',

	COLOR_OPTION_CLASS = 'colorOption',

	DEFAULT_COLOR_VALUE = 'white';

// ----------------- PRIVATE VARIABLES ---------------------------

var _colorDemoPicture = document.getElementById(COLOR_DEMO_PICTURE),
	_colorDemoLabel = document.getElementById(COLOR_DEMO_LABEL),
	_whiteColorOption = document.getElementById(WHITE_COLOR_OPTION),
	_colorOptions = document.getElementsByClassName(COLOR_OPTION_CLASS);

// ----------------- PRIVATE FUNCTIONS ---------------------------

/**
 * Function is responsible for presenting an image associated with whatever color the user selects
 *
 * @param {String} color - the keyword associated with the chosen color
 *
 * @author kinsho
 */
function _setColorDetails(colorElement)
{
	var imageURL = colorElement.dataset.imageUrl,
		color = colorElement.dataset.color.toUpperCase();

	// Set some text denoting whatever color the user picked
	_colorDemoLabel.innerHTML = rQuery.capitalize(color);

	// Set the image associated with that color now
	_colorDemoPicture.src = imageURL;
}

// ----------------- LISTENERS ---------------------------

/**
 * Listener that sets the color of the railing that the user desires into the view model
 * Listener also invokes some logic to modify the view
 *
 * @param {Event} event - the event object associated with the listener
 *
 * @author kinsho
 */
function setColor(event)
{
	var element = event.currentTarget;

	vm.orderColor = element.dataset.color;

	// Modify some aspects of the view based on information stored within the clicked element
	_setColorDetails(element);
}

/**
 * An event that opens the gallery so that users can take a better look at some colored railings
 *
 * @param {Event} event - the event associated with the firing of this listener
 */
function openGallery(event)
{
	var element = event.currentTarget,
		imageURLs = [element.src];

	gallery.open(imageURLs, 0);
}

// ----------------- DATA INITIALIZATION -----------------------------

// ----------------- LISTENER INITIALIZATION -----------------------------

for (var i = 0; i < _colorOptions.length; i++)
{
	_colorOptions[i].addEventListener('click', setColor);
}

_colorDemoPicture.addEventListener('click', openGallery);

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

vm.orderColor = DEFAULT_COLOR_VALUE;

// Adjust the view to reflect the fact that a default color was selected
_setColorDetails(_whiteColorOption);