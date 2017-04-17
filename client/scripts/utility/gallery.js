/**
 * @main gallery
 */

// ----------------- ENUMS/CONSTANTS --------------------------

var GALLERY_OVERLAY = 'galleryOverlay',
	GALLERY_PICTURE = 'galleryPicture',
	GALLERY_PICTURE_VIEWER = 'galleryPictureViewer',
	GALLERY_LEFT_SLIDER = 'galleryLeftButton',
	GALLERY_RIGHT_SLIDER = 'galleryRightButton',
	GALLERY_EXIT_ICON = 'galleryExitButton',

	SHOW_CLASS = 'show',
	HIDE_CLASS = 'hide',
	SURFACE_CLASS = 'surface',
	DISABLED_CLASS = 'disabled',
	FADE_CLASSES =
	{
		OUT_LEFT: 'fadeOutLeft',
		OUT_RIGHT: 'fadeOutRight',
		IN_LEFT: 'fadeInLeft',
		IN_RIGHT: 'fadeInRight'
	};

// ----------------- PRIVATE MEMBERS --------------------------

var _imageURLs = [], // The list of image URLs to show within the gallery
	_currentIndex, // The index of the picture currently loaded into the gallery viewer
	_transitioning, // A flag indicating whether we are in the middle of transitioning between photos

	// Gallery elements
	_galleryOverlay = document.getElementById(GALLERY_OVERLAY),
	_galleryPicture = document.getElementById(GALLERY_PICTURE),
	_galleryPictureViewer = document.getElementById(GALLERY_PICTURE_VIEWER),
	_galleryLeftSlider = document.getElementById(GALLERY_LEFT_SLIDER),
	_galleryRightSlider = document.getElementById(GALLERY_RIGHT_SLIDER),
	_galleryExitIcon = document.getElementById(GALLERY_EXIT_ICON);


// ----------------- PRIVATE FUNCTIONS --------------------------

/**
 * Function manages the visibility of the gallery slider controls
 *
 * @author kinsho
 */
function _toggleControlsVisibility()
{
	// Hide the proper navigation buttons depending on the number of photos in the gallery and the current
	// photo being viewed
	if (_imageURLs.length === 1)
	{
		_galleryRightSlider.classList.add(HIDE_CLASS);
		_galleryLeftSlider.classList.add(HIDE_CLASS);
	}
	else if (_currentIndex === (_imageURLs.length - 1))
	{
		_galleryLeftSlider.classList.remove(HIDE_CLASS);
		_galleryRightSlider.classList.add(HIDE_CLASS);
	}
	else if (_currentIndex === 0)
	{
		_galleryLeftSlider.classList.add(HIDE_CLASS);
		_galleryRightSlider.classList.remove(HIDE_CLASS);
	}
	else
	{
		_galleryRightSlider.classList.remove(HIDE_CLASS);
		_galleryLeftSlider.classList.remove(HIDE_CLASS);
	}
}

/**
 * A function that alters the look of the slider controls so that they can look either disabled or enabled depending
 * on whether the gallery is in the midst of switching out photos
 *
 * @param {Boolean} disable - a flag indicating whether to disable the controls in appearance
 *
 * @author kinsho
 */
function _disableEnableControls(disable)
{
	if (disable)
	{
		_transitioning = true;

		_galleryLeftSlider.classList.add(DISABLED_CLASS);
		_galleryRightSlider.classList.add(DISABLED_CLASS);
	}
	else
	{
		_transitioning = false;

		_galleryLeftSlider.classList.remove(DISABLED_CLASS);
		_galleryRightSlider.classList.remove(DISABLED_CLASS);
	}
}

// ----------------- LISTENERS --------------------------

// The following are animation listeners designed to gracefully manage the gallery sliding and fading

function fadeInLeft()
{
	_galleryPictureViewer.removeEventListener('animationend', fadeInLeft);

	_currentIndex += 1;
	_galleryPicture.src = _imageURLs[_currentIndex];
	_galleryPictureViewer.classList.add(FADE_CLASSES.IN_LEFT);

	_toggleControlsVisibility();
	_galleryPictureViewer.addEventListener('animationend', removeFadeTracesAndUpdateGallery);
}

function fadeInRight()
{
	_galleryPictureViewer.removeEventListener('animationend', fadeInRight);

	_currentIndex -= 1;
	_galleryPicture.src = _imageURLs[_currentIndex];
	_galleryPictureViewer.classList.add(FADE_CLASSES.IN_RIGHT);

	_toggleControlsVisibility();
	_galleryPictureViewer.addEventListener('animationend', removeFadeTracesAndUpdateGallery);
}

function removeFadeTracesAndUpdateGallery()
{
	_galleryPictureViewer.removeEventListener('animationend', removeFadeTracesAndUpdateGallery);

	_disableEnableControls(false);
	_galleryPictureViewer.classList.remove(FADE_CLASSES.OUT_LEFT);
	_galleryPictureViewer.classList.remove(FADE_CLASSES.OUT_RIGHT);
	_galleryPictureViewer.classList.remove(FADE_CLASSES.IN_LEFT);
	_galleryPictureViewer.classList.remove(FADE_CLASSES.IN_RIGHT);
}

function desurface()
{
	_galleryOverlay.removeEventListener('transitionend', desurface);
	_galleryOverlay.classList.remove(SURFACE_CLASS);
}

/**
 * Function will slide us over to the next photo in the collection
 *
 * @author kinsho
 */
function goToNextPhoto()
{
	// Keep the logic from executing if we are on the last photo in the gallery or currently in the midst of a transition
	if (_currentIndex !== (_imageURLs.length - 1) && !(_transitioning))
	{
		_disableEnableControls(true);

		_galleryPictureViewer.addEventListener('animationend', fadeInLeft);
		_galleryPictureViewer.classList.add(FADE_CLASSES.OUT_LEFT);
	}
}

/**
 * Function will slide us over to the previous photo in the collection
 *
 * @author kinsho
 */
function goToPrevPhoto()
{
	// Keep the logic from executing if we are on the first photo in the gallery or currently in the midst of a transition
	if ((_currentIndex !== 0) && !(_transitioning))
	{
		_disableEnableControls(true);

		_galleryPictureViewer.addEventListener('animationend', fadeInRight);
		_galleryPictureViewer.classList.add(FADE_CLASSES.OUT_RIGHT);
	}
}

/**
 * Function will detect whether the right or left arrow keys were pressed and will slide the gallery accordingly
 *
 * @param {Event} event - the event object associated with this listener
 *
 * @author kinsho
 */
function detectArrowKeys(event)
{
	// Left arrow key
	if (event.keyCode === 37)
	{
		goToPrevPhoto();
	}

	// Right arrow key
	else if (event.keyCode === 39)
	{
		goToNextPhoto();
	}
}

/**
 * Function will fade out the gallery and return the user to whatever screen he was on
 *
 * @author kinsho
 */
function exitGallery()
{
	_galleryOverlay.addEventListener('transitionend', desurface);
	_galleryOverlay.classList.remove(SHOW_CLASS);
}

// ----------------- MODULE ---------------------------

var galleryModule =
{
	/**
	 * Function responsible for initializing a new bunch of photos into the gallery and opening up
	 * the viewer
	 *
	 * @param {Array<String>} URLs - a collection of image URLs that will fetch the images to be shown by
	 * 		the gallery
	 * @param {Number} index - the index value determining which image to show first in the gallery
	 *
	 * @author kinsho
	 */
	open: function(URLs, index)
	{
		_currentIndex = index;
		_imageURLs = URLs;

		_galleryPicture.src = _imageURLs[index];
		_galleryOverlay.classList.add(SURFACE_CLASS);

		// Set any animations on a slight delay following the surfacing of the gallery
		window.setTimeout(() =>
		{
			_galleryOverlay.classList.add(SHOW_CLASS);
			_toggleControlsVisibility();
		}, 50);
	}
};

// ----------------- CONFIGURATION ---------------------------

// ----------------- LISTENER INITIALIZATION --------------------------

// Attach the gallery sliders to the appropriate icons
_galleryLeftSlider.addEventListener('click', goToPrevPhoto);
_galleryRightSlider.addEventListener('click', goToNextPhoto);

// Set it up so that the keyboard can also move the gallery around
document.addEventListener('keydown', detectArrowKeys);

// Put up the listeners to allow the user to exit the gallery
_galleryExitIcon.addEventListener('click', exitGallery);
_galleryOverlay.addEventListener('click', (event) =>
{
	// Allow the user to exit the gallery when he clicks outside the confines of the gallery
	if (event.target.id === _galleryOverlay.id)
	{
		exitGallery();
	}
});

// ----------------- EXPORT ---------------------------

export default galleryModule;