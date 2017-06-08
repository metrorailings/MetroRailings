// ----------------- EXTERNAL MODULES --------------------------

import gallery from 'client/scripts/utility/gallery';

// ----------------- ENUMS/CONSTANTS ---------------------------

var PICTURE_CLASS = 'galleryPicture';

// ----------------- PRIVATE VARIABLES ---------------------------

var _galleryImages = document.getElementsByClassName(PICTURE_CLASS),
	_gallerySrc = [];

// ----------------- LISTENERS ---------------------------

/**
 * An event that opens the gallery so that users can take a better look at the pictures in the galleria
 *
 * @param {Event} event - the event associated with the firing of this listener
 */
function _openGallery(event)
{
	var element = event.currentTarget,
		imageURL = element.src,
		index, i;

	// Find the index of the photo that will need to loaded into the gallery viewer when it opens
	// up. Also collect all the image URLs that may need to be loaded by the gallery
	for (i = 0; i < _gallerySrc.length; i++)
	{
		if (imageURL.indexOf(_gallerySrc[i]) > -1)
		{
			index = i;
		}
	}

	gallery.open(_gallerySrc, index);
}

// ----------------- LISTENER INITIALIZATION -----------------------------

for (var i = 0; i < _galleryImages.length; i++)
{
	_galleryImages[i].addEventListener('click', _openGallery);
}

// ----------------- PAGE INITIALIZATION -----------------------------

for (var j = 0; j < _galleryImages.length; j++)
{
	_gallerySrc.push(_galleryImages[j].src);
}