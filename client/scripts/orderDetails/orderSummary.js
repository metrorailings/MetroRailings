// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderDetails/viewModel';

import axios from 'client/scripts/utility/axios';
import gallery from 'client/scripts/utility/gallery';
import confirmationModal from 'client/scripts/utility/confirmationModal';

import rQueryClient from 'client/scripts/utility/rQueryClient';

// ----------------- ENUMS/CONSTANTS ---------------------------

var ORDER_NOTES_TEXT_AREA = 'orderNotes',
	UPLOAD_PICTURE_BUTTON = 'uploadPictureButton',
	UPLOAD_PICTURE_INPUT = 'uploadPictureInput',
	PICTURES_LISTING = 'picturesListingContainer',
	PICTURES_LISTING_LOADER = 'picturesListingLoadingIcons',
	FILE_UPLOAD_BUTTON = 'uploadPictureInput',
	ORDER_PICTURES_TEMPLATE = 'orderPicturesTemplate',

	RUSH_ORDER_BUTTONS = 'rushOrder',

	SAVE_PICTURES_URL = 'orderDetails/saveNewPicture',
	DELETE_PICTURE_URL = 'orderDetails/deletePicture',

	DISABLED_CLASS = 'disabled',
	SHOW_CLASS = 'show',
	HIDE_CLASS = 'hide',
	STATUS_RADIO_BUTTONS = 'statusRadio',
	DATA_GROUPING_CLASS = 'dataGrouping',
	UPLOADED_IMAGES_CLASS = 'uploadedImageThumbnail',
	DELETE_IMAGE_ICON_CLASS = 'deleteImage',

	DELETE_IMAGE_MESSAGE = '<span id=\'deleteImageWarning\'>Are you sure you want to delete this image?' +
		' Once you delete this image, it\'\ll be gone for good.</span><img src=\'::imageSrc\' />',
	IMAGE_SOURCE_PLACEHOLDER = '::imageSrc';

// ----------------- PRIVATE VARIABLES ---------------------------

	// Elements
var _orderNotesFields = document.getElementById(ORDER_NOTES_TEXT_AREA),
	_statusRadioButtons = document.getElementsByClassName(STATUS_RADIO_BUTTONS),
	_picturesContainer = document.getElementById(PICTURES_LISTING),
	_picturesLoader = document.getElementById(PICTURES_LISTING_LOADER),
	_rushOrderButtons = document.getElementsByName(RUSH_ORDER_BUTTONS);

// ----------------- HANDLEBAR TEMPLATES ---------------------------

/**
 * The partial to load images on to the page
 */
var orderPicturesTemplate = Handlebars.compile(document.getElementById(ORDER_PICTURES_TEMPLATE).innerHTML);

// ----------------- PRIVATE FUNCTIONS ---------------------------

/**
 * Function responsible for attaching all image-related listeners to any pictures attached to this order
 *
 * @author kinsho
 */
function _attachPictureListeners()
{
	var imageElements,
		deleteIcons,
		i;

	/*
	 * Ensure that any prior listeners are removed prior to adding new event listeners
	 */

	// Reset all the listeners for the section
	document.getElementById(UPLOAD_PICTURE_BUTTON).removeEventListener('click', triggerFileBrowser);
	document.getElementById(UPLOAD_PICTURE_BUTTON).addEventListener('click', triggerFileBrowser);
	document.getElementById(UPLOAD_PICTURE_BUTTON).removeEventListener('click', uploadImage);
	document.getElementById(UPLOAD_PICTURE_INPUT).addEventListener('change', uploadImage);

	imageElements = _picturesContainer.getElementsByClassName(UPLOADED_IMAGES_CLASS);
	for (i = imageElements.length - 1; i >= 0; i--)
	{
		imageElements[i].removeEventListener('click', openGallery);
		imageElements[i].addEventListener('click', openGallery);
	}

	deleteIcons = _picturesContainer.getElementsByClassName(DELETE_IMAGE_ICON_CLASS);
	for (i = deleteIcons.length - 1; i >= 0; i--)
	{
		deleteIcons[i].removeEventListener('click', deleteImage);
		deleteIcons[i].addEventListener('click', deleteImage);
	}

	// Ensure that these file upload inputs are always enabled, even when the order is closed
	// Don't forget to take away the opacity of the surrounding container
	window.setTimeout(() =>
	{
		var fileUploadButton = document.getElementById(FILE_UPLOAD_BUTTON);

		fileUploadButton.disabled = false;
		rQueryClient.closestElementByClass(fileUploadButton, DATA_GROUPING_CLASS).classList.remove(DISABLED_CLASS);
	}, 500);
}

/**
 * Function responsible for deleting an uploaded image and wiping traces of its metadata from our system
 *
 * @param {Number} imageIndex - the index of the image to wipe from this order's image collection
 *
 * @author kinsho
 */
async function _deleteImage(imageIndex)
{
	var saveData =
		{
			id: vm._id,
			// Remove the metadata from our local cache of order data
			imgMeta: vm.pictures.splice(imageIndex, 1)[0]
		};

	// Show a localized message indicating that we are in the midst of deleting a picture from our remote server
	_picturesContainer.classList.add(HIDE_CLASS);
	_picturesLoader.classList.add(SHOW_CLASS);

	// Reach out to the server to delete the image from Dropbox and wipe its metadata traces from the database
	await axios.post(DELETE_PICTURE_URL, saveData);

	// Take off any loading indicators now that we have a response back from the server
	_picturesContainer.classList.remove(HIDE_CLASS);
	_picturesLoader.classList.remove(SHOW_CLASS);

	// Re-render the pictures template again to remove the now-deleted image
	_picturesContainer.innerHTML = orderPicturesTemplate( { pictures: vm.pictures } );

	_attachPictureListeners();
}

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
 * Listener responsible for setting the rush order flag into the view model
 *
 * @param {Event} event - the event associated with the firing of this event
 *
 * @author kinsho
 */
function setRushOrder(event)
{
	vm.rushOrder = event.currentTarget.value;
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
		imageURLs.push(vm.pictures[i].shareLink);
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
	var filesToUpload = document.getElementById(UPLOAD_PICTURE_INPUT).files,
		saveData = new FormData(),
		imgMetadata,
		i;

	// Prepare all the files that needs to be uploaded
	for (i = 0; i < filesToUpload.length; i++)
	{
		saveData.append('files', filesToUpload[i], filesToUpload[i].name);
	}

	// Append the ID of the order as well to the payload
	saveData.append('id', vm._id);

	// Show a localized message indicating that we are in the midst of uploading pictures to our remote server
	_picturesContainer.classList.add(HIDE_CLASS);
	_picturesLoader.classList.add(SHOW_CLASS);

	// Upload the images into Dropbox and save all the metadata within our own database
	imgMetadata = await axios.post(SAVE_PICTURES_URL, saveData, false,
	{
		'content-type': 'multipart/form-data',
	}, 15000 * filesToUpload.length);
	imgMetadata = imgMetadata.data;

	// Take off any loading indicators now that we have a response back from the server
	_picturesContainer.classList.remove(HIDE_CLASS);
	_picturesLoader.classList.remove(SHOW_CLASS);

	// Store the metadata within our own local cache of data for this particular order
	vm.pictures.push(...imgMetadata);

	// Re-render the image template again to account for the newly uploaded image
	_picturesContainer.innerHTML = orderPicturesTemplate( {pictures: vm.pictures } );

	_attachPictureListeners();
}

/**
 * Listener responsible for presenting a confirmation modal to warn the admin about whether he really wants
 * to delete an image and all its associated data permanently.
 *
 * @param {Event} event - the event associated with the firing of this listener
 *
 * @author kinsho
 */
async function deleteImage(event)
{
	var imgElement = event.currentTarget.parentNode.children[0],
		imageIndex = window.parseInt(imgElement.dataset.index, 10),
		imgMetadata = vm.pictures[imageIndex];

	confirmationModal.open([DELETE_IMAGE_MESSAGE.replace(IMAGE_SOURCE_PLACEHOLDER, imgMetadata.shareLink)], () => { _deleteImage(imageIndex); }, () => {});
}

// ----------------- LISTENER INITIALIZATION -----------------------------

// Set listeners on all the radio buttons related to order status
for (var i = 0; i < _statusRadioButtons.length; i++)
{
	_statusRadioButtons[i].addEventListener('click', setStatus);
}

_orderNotesFields.addEventListener('change', setNotes);
_rushOrderButtons[0].addEventListener('change', setRushOrder);
_rushOrderButtons[1].addEventListener('change', setRushOrder);

_attachPictureListeners();