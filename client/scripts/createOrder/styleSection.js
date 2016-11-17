// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createOrder/viewModel';
import gallery from 'client/scripts/utility/gallery';

// ----------------- ENUMS/CONSTANTS ---------------------------

var SECTION_ID = 'styleSection',
	BARS_CHECKBOX = 'barsCheckbox',
	COLLARS_CHECKBOX = 'collarsCheckbox',
	CUSTOM_STYLING_CHECKBOX = 'customStylingCheckbox',

	PICTURE_BUTTON_CLASS = 'pictureButton',
	RAILINGS_PHOTO_CLASS = 'railingPhoto';

// ----------------- PRIVATE FUNCTIONS ---------------------------

// ----------------- LISTENERS ---------------------------

/**
 * An event that sets the style of railings needed within the view model
 *
 * @param {Event} event - the event associated with the firing of this listener
 */
function setRailingsStyle(event)
{
	var element = event.currentTarget,
		style = element.dataset.style || element.value;

	vm.orderStyle = style;
}

/**
 * An event that opens the gallery so that users can take a better look at some specific railings
 *
 * @param {Event} event - the event associated with the firing of this listener
 */
function openGallery(event)
{
	var element = event.currentTarget,
		siblingPictures = element.parentNode.children,
		imageURL = element.src,
		imageURLs = [],
		index, i;

	// Find the index of the photo that will need to loaded into the gallery viewer when it opens
	// up. Also collect all the image URLs that may need to be loaded by the gallery
	for (i = 0; i < siblingPictures.length; i++)
	{
		if (siblingPictures[i].src === imageURL)
		{
			index = i;
		}

		imageURLs.push(siblingPictures[i].src);
	}

	gallery.open(imageURLs, index);
}

// ----------------- DATA INITIALIZATION -----------------------------

// ----------------- LISTENER INITIALIZATION -----------------------------

var pictureButtons = document.getElementById(SECTION_ID).getElementsByClassName(PICTURE_BUTTON_CLASS),
	railingPhotos = document.getElementsByClassName(RAILINGS_PHOTO_CLASS),
	i;

// Attach event listeners to the railings type checkboxes as well as their associated picture buttons
document.getElementById(BARS_CHECKBOX).addEventListener('click', setRailingsStyle);
document.getElementById(COLLARS_CHECKBOX).addEventListener('click', setRailingsStyle);
document.getElementById(CUSTOM_STYLING_CHECKBOX).addEventListener('click', setRailingsStyle);

for (i = 0; i < pictureButtons.length; i++)
{
	pictureButtons[i].addEventListener('click', setRailingsStyle);
}

// Attach an event listener to each railing photo so that these photos can be viewed in the gallery
for (i = 0; i < railingPhotos.length; i++)
{
	railingPhotos[i].addEventListener('click', openGallery);
}

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

vm.orderStyle = '';