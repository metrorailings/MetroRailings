// ----------------- EXTERNAL MODULES --------------------------

import gallery from 'client/scripts/utility/gallery';

// ----------------- ENUMS/CONSTANTS ---------------------------

var GALLERIA = 'galleria',
	DEFAULT_GALLERIA = 'galleriaDefault',
	GALLERIA_TEMPLATE = 'galleriaTemplate',
	EXPAND_GALLERY_LINK = 'expandGalleryLink',
	EXPAND_GALLERY_ROW = 'expandGalleryRow',

	SHOW_CLASS = 'show';

// ----------------- PRIVATE VARIABLES ---------------------------

var _imagesLoaded = [], // The collection of images that are already visible on screen

	// Elements
	_galleria = document.getElementById(GALLERIA),
	_defaultGalleryPics = document.getElementById(DEFAULT_GALLERIA).getElementsByTagName('img'),
	_expandGalleryRow = document.getElementById(EXPAND_GALLERY_ROW),
	_expandGalleryLink = document.getElementById(EXPAND_GALLERY_LINK);

// ----------------- HANDLEBAR TEMPLATES ---------------------------

/**
 * The partial to load new images into the gallery
 */
var galleriaTemplate = Handlebars.compile(document.getElementById(GALLERIA_TEMPLATE).innerHTML);

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for loading images into the gallery section
 *
 * @author kinsho
 */
function loadNewImages()
{
	var completeGallery = window.MetroRailings.galleryImages,
		startingIndex = _imagesLoaded.length,
		endingIndex = startingIndex + 6,
		imagesToLoad = [],
		newHTML = '',
		newGalleria, newImgElements,
		i;

	// Figure out which new images need to be shown on screen
	for (i = startingIndex; i < endingIndex; i++)
	{
		// If we have reached the end of the list of available photos to show, bounce out
		if ( !(completeGallery[i]) )
		{
			break;
		}

		imagesToLoad.push(completeGallery[i]);
	}

	// Only generate new HTML should we have images to display
	if (imagesToLoad.length)
	{
		newHTML = galleriaTemplate({
			pictures: imagesToLoad,
			group: startingIndex
		});
	}

	// Pop the new pictures into the gallery
	newGalleria = document.createElement('DIV');
	newGalleria.innerHTML = newHTML;
	_galleria.appendChild(newGalleria.firstChild);

	// Attach click listeners to each of the new pictures so that we can open the gallery when the user clicks
	// on any one of them
	newGalleria = document.getElementById(GALLERIA + startingIndex);
	newImgElements = newGalleria.getElementsByTagName('img');
	for (i = 0; i < newImgElements.length; i++)
	{
		newImgElements[i].addEventListener('click', openGallery);
	}

	// Update the collection we use to track visible pictures
	for (i = 0; i < imagesToLoad.length; i++)
	{
		_imagesLoaded.push(imagesToLoad[i].path);
	}

	// If all the pictures have been loaded, take away the link to load more pictures
	if (_imagesLoaded.length === completeGallery.length)
	{
		_expandGalleryRow.parentNode.removeChild(_expandGalleryRow);
	}

	// Show the new images on a delay so that the browser has time to prepare to slide the new pictures into view
	window.setTimeout(() =>
	{
		newGalleria.classList.add(SHOW_CLASS);
	}, 80);
}

/**
 * An event that opens the gallery so that users can take a better look at the pictures in the galleria
 *
 * @param {Event} event - the event associated with the firing of this listener
 *
 */
function openGallery(event)
{
	var element = event.currentTarget,
		imageURL = element.src,
		index, i;

	// Find the index of the photo that will need to loaded into the gallery viewer when it opens
	// up. Also collect all the image URLs that may need to be loaded by the gallery
	for (i = 0; i < _imagesLoaded.length; i++)
	{
		if (imageURL.indexOf(_imagesLoaded[i]) > -1)
		{
			index = i;
		}
	}

	gallery.open(_imagesLoaded, index);
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_expandGalleryLink.addEventListener('click', loadNewImages);

for (var i = 0; i < _defaultGalleryPics.length; i++)
{
	_defaultGalleryPics[i].addEventListener('click', openGallery);

	// Don't forget to create a record noting that all the default pictures have been made available to the user
	_imagesLoaded.push(_defaultGalleryPics[i].src);
}