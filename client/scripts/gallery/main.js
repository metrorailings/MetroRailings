// ----------------- EXTERNAL MODULES --------------------------

import gallery from 'client/scripts/utility/gallery';

// ----------------- ENUMS/CONSTANTS ---------------------------

var PICTURE_CLASS = 'galleryPicture';

// ----------------- PRIVATE VARIABLES ---------------------------

var _galleryImages = document.getElementsByClassName(PICTURE_CLASS);

// ----------------- LISTENERS ---------------------------

/**
 * An event that opens the gallery so that users can take a better look at the pictures in the galleria
 *
 * @param {Event} event - the event associated with the firing of this listener
 */
function _openGallery(event)
{
	var element = event.currentTarget,
		imageIndex = window.parseInt(element.dataset.index, 10),
		URLs = [],
		index, i;

	// Find the index of the photo that will need to loaded into the gallery viewer when it opens
	// up. Also collect all the image URLs that may need to be loaded by the gallery
	for (i = 0; i < window.MetroRailings.pictures.length; i++)
	{
		if (window.MetroRailings.pictures[i].index === imageIndex)
		{
			index = i;
		}

		URLs.push(window.MetroRailings.pictures[i].url);
	}

	gallery.open(URLs, index);
}

// ----------------- LISTENER INITIALIZATION -----------------------------

for (var i = 0; i < _galleryImages.length; i++)
{
	_galleryImages[i].addEventListener('click', _openGallery);
}