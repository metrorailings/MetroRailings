// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/prospectDetails/viewModel';

import axios from 'client/scripts/utility/axios';
import dropbox from 'client/scripts/utility/dropbox';
import gallery from 'client/scripts/utility/gallery';

// ----------------- ENUMS/CONSTANTS ---------------------------

var PROSPECT_NOTES_TEXT_AREA = 'prospectNotes',
	UPLOAD_PICTURE_BUTTON = 'uploadPictureButton',
	UPLOAD_PICTURE_INPUT = 'uploadPictureInput',
	PICTURES_LISTING = 'picturesListingContainer',
	PROSPECT_PICTURES_TEMPLATE = 'prospectPicturesTemplate',
	LOADING_VEIL = 'baseLoaderOverlay',

	SAVE_PICTURES_URL = 'prospectDetails/saveNewPicture',

	VISIBILITY_CLASS = 'show',
	UPLOADED_IMAGES_CLASS = 'uploadedImageThumbnail';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
var _prospectNotesFields = document.getElementById(PROSPECT_NOTES_TEXT_AREA),
	_picturesContainer = document.getElementById(PICTURES_LISTING),
	_loadingVeil = document.getElementById(LOADING_VEIL);

// ----------------- HANDLEBAR TEMPLATES ---------------------------

/**
 * The partial to load images on to the page
 */
var prospectPicturesTemplate = Handlebars.compile(document.getElementById(PROSPECT_PICTURES_TEMPLATE).innerHTML);

// ----------------- PRIVATE FUNCTIONS ---------------------------

/**
 * Function meant to show all images associated with the prospect currently in context
 *
 * @author kinsho
 */
async function _renderImageListing()
{
	var imageElements,
		i;

	// Cycle through each picture to see if there's a link that we can use to view the picture
	// If not, generate that link
	for (i = vm.pictures.length - 1; i >= 0; i--)
	{
		if ( !(vm.pictures[i].fullLink) )
		{
			vm.pictures[i].fullLink = await dropbox.fetchLink(vm.pictures[i]);
		}
	}

	_picturesContainer.innerHTML = prospectPicturesTemplate({pictures: vm.pictures});

	// Reset all the listeners for the section
	document.getElementById(UPLOAD_PICTURE_BUTTON).addEventListener('click', triggerFileBrowser);
	document.getElementById(UPLOAD_PICTURE_INPUT).addEventListener('change', uploadImage);

	imageElements = _picturesContainer.getElementsByClassName(UPLOADED_IMAGES_CLASS);
	for (i = imageElements.length - 1; i >= 0; i--)
	{
		imageElements[i].addEventListener('click', openGallery);
	}
}

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting prospect notes into the view model
 *
 * @author kinsho
 */
function setNotes()
{
	vm.notes = _prospectNotesFields.value;
}

/**
 * Listener responsible for opening up the file browser
 *
 * @author kinsho
 */
function triggerFileBrowser()
{
	document.getElementById(UPLOAD_PICTURE_INPUT).click();
}

/**
 * Listener responsible for opening up a gallery so that the viewer can take a better look at an uploaded picture
 *
 * @param {Event} event - the event associated with the firing of this listener
 *
 * @author kinsho
 */
function openGallery(event)
{
	var imageURLs = [];

	// Cycle through each of the uploaded images and collect their src links
	for (var i = 0; i < vm.pictures.length; i++)
	{
		imageURLs.push(vm.pictures[i].fullLink);
	}
	gallery.open(imageURLs, window.parseInt(event.currentTarget.dataset.index, 10));
}

/**
 * Listener responsible for uploading an image to Dropbox and then recording metadata about
 * the remote Dropbox file in the server
 *
 * @author kinsho
 */
async function uploadImage()
{
	var fileToUpload = document.getElementById(UPLOAD_PICTURE_INPUT).files[0],
		imageNameComponents = fileToUpload.name.split('.'),
		// All file names will take on the form of <orderID>-<latest picture count on order>
		revisedFileName = vm._id + '-' + (vm.pictures.length + 1) + '.' + imageNameComponents[imageNameComponents.length - 1],
		saveData =
		{
			id: vm._id,
		},
		imgMetadata;

	_loadingVeil.classList.add(VISIBILITY_CLASS);

	imgMetadata = await dropbox.uploadFile(fileToUpload, revisedFileName);
	saveData.imgMeta = imgMetadata.data;
	vm.pictures.push(saveData.imgMeta);

	await axios.post(SAVE_PICTURES_URL, saveData, false);

	_loadingVeil.classList.remove(VISIBILITY_CLASS);
	_renderImageListing();
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_prospectNotesFields.addEventListener('change', setNotes);

// ----------------- PAGE INITIALIZATION --------------------------------

_renderImageListing();