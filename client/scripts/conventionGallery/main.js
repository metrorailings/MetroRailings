// ----------------- ENUMS/CONSTANTS ---------------------------

var PICTURE_CLASS = 'conventionPhoto',
	ACTIVE_CLASS = 'active';

// ----------------- PRIVATE VARIABLES ---------------------------

var _galleryImages = document.getElementsByClassName(PICTURE_CLASS),
	_galleryIndex;

// ----------------- LISTENERS ---------------------------

/**
 * Function responsible for transitioning between images
 *
 * @author kinsho
 */
function transitionToNextImage()
{
	// Fade out whatever current image is being shown on screen
	_galleryImages[_galleryIndex].classList.remove(ACTIVE_CLASS);

	// If we reached the end of the gallery, we start back towards the beginning of the collection
	if (_galleryIndex === _galleryImages.length - 1)
	{
		_galleryIndex = 0;
	}
	else
	{
		_galleryIndex += 1;
	}

	// Fade in the next image designated to be shown
	_galleryImages[_galleryIndex].classList.add(ACTIVE_CLASS);
}

// ----------------- LISTENER INITIALIZATION -----------------------------

// Set up an interval that will regularly transition images in and out at fixed time intervals
window.setInterval(transitionToNextImage, 7500);

// ----------------- PAGE INITIALIZATION -----------------------------

_galleryIndex = Math.floor(Math.random() * _galleryImages.length);
transitionToNextImage();