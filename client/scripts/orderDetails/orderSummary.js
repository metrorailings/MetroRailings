// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderDetails/viewModel';

import axios from 'client/scripts/utility/axios';
import dropbox from 'client/scripts/utility/dropbox';
import gallery from 'client/scripts/utility/gallery';

// ----------------- ENUMS/CONSTANTS ---------------------------

var ORDER_NOTES_TEXT_AREA = 'orderNotes',
	UPLOAD_PICTURE_BUTTON = 'uploadPictureButton',
	UPLOAD_PICTURE_INPUT = 'uploadPictureInput',
	PICTURES_LISTING = 'picturesListingContainer',
	ORDER_PICTURES_TEMPLATE = 'orderPicturesTemplate',
	LOADING_VEIL = 'baseLoaderOverlay',

	SAVE_PICTURES_URL = 'orderDetails/saveNewPicture',

	VISIBILITY_CLASS = 'show',
	STATUS_RADIO_BUTTONS = 'statusRadio',
	UPLOADED_IMAGES_CLASS = 'uploadedImageThumbnail';

// ----------------- PRIVATE VARIABLES ---------------------------

	// Elements
var _orderNotesFields = document.getElementById(ORDER_NOTES_TEXT_AREA),
	_statusRadioButtons = document.getElementsByClassName(STATUS_RADIO_BUTTONS),
	_picturesContainer = document.getElementById(PICTURES_LISTING),
	_loadingVeil = document.getElementById(LOADING_VEIL);

// ----------------- HANDLEBAR TEMPLATES ---------------------------

/**
 * The partial to load images on to the page
 */
var orderPicturesTemplate = Handlebars.compile(document.getElementById(ORDER_PICTURES_TEMPLATE).innerHTML);

// ----------------- PRIVATE FUNCTIONS ---------------------------

/**
 * Function meant to show all images associated with the order currently in context
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

	_picturesContainer.innerHTML = orderPicturesTemplate({pictures: vm.pictures});

	// Reset all the listeners for the section
	document.getElementById(UPLOAD_PICTURE_BUTTON).addEventListener('click', triggerFileBrowser);
	document.getElementById(UPLOAD_PICTURE_INPUT).addEventListener('change', uploadImage);

	imageElements = _picturesContainer.getElementsByClassName(UPLOADED_IMAGES_CLASS);
	for (i = imageElements.length - 1; i >= 0; i--)
	{
		imageElements[i].addEventListener('click', openGallery);
	}
}

// ----------------- PROCESSED GENERATOR FUNCTIONS ---------------------------

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the status in the view model
 *
 * @param {Event} event - the event associated with the firing of this event
 *
 * @author kinsho
 */
function setStatus(event)
{
	vm.status = event.currentTarget.value;
}

/**
 * Listener responsible for setting order notes into the view model
 *
 * @author kinsho
 */
function setNotes()
{
	vm.notes = _orderNotesFields.value;
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

// Set listeners on all the radio buttons related to order status
for (var i = 0; i < _statusRadioButtons.length; i++)
{
	_statusRadioButtons[i].addEventListener('click', setStatus);
}

_orderNotesFields.addEventListener('change', setNotes);

// ----------------- PAGE INITIALIZATION --------------------------------

_renderImageListing();