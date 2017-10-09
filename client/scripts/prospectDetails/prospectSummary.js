// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/prospectDetails/viewModel';

import axios from 'client/scripts/utility/axios';
import gallery from 'client/scripts/utility/gallery';
import confirmationModal from 'client/scripts/utility/confirmationModal';

// ----------------- ENUMS/CONSTANTS ---------------------------

var PROSPECT_NOTES_TEXT_AREA = 'prospectNotes',
	UPLOAD_PICTURE_BUTTON = 'uploadPictureButton',
	UPLOAD_PICTURE_INPUT = 'uploadPictureInput',
	PICTURES_LISTING = 'picturesListingContainer',
	PICTURES_LISTING_LOADER = 'picturesListingLoadingIcons',
	PROSPECT_PICTURES_TEMPLATE = 'prospectPicturesTemplate',

	SAVE_PICTURES_URL = 'prospectDetails/saveNewPicture',
	DELETE_PICTURE_URL = 'prospectDetails/deletePicture',

	SHOW_CLASS = 'show',
	HIDE_CLASS = 'hide',
	UPLOADED_IMAGES_CLASS = 'uploadedImageThumbnail',
	DELETE_IMAGE_ICON_CLASS = 'deleteImage',

	DELETE_IMAGE_MESSAGE = '<span id=\'deleteImageWarning\'>Are you sure you want to delete this image?' +
		' Once you delete this image, it\'\ll be gone for good.</span><img src=\'::imageSrc\' />',
	IMAGE_SOURCE_PLACEHOLDER = '::imageSrc';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
var _prospectNotesFields = document.getElementById(PROSPECT_NOTES_TEXT_AREA),
	_picturesContainer = document.getElementById(PICTURES_LISTING),
	_picturesLoader = document.getElementById(PICTURES_LISTING_LOADER);

// ----------------- HANDLEBAR TEMPLATES ---------------------------

/**
 * The partial to load images on to the page
 */
var prospectPicturesTemplate = Handlebars.compile(document.getElementById(PROSPECT_PICTURES_TEMPLATE).innerHTML);

// ----------------- PRIVATE FUNCTIONS ---------------------------

/**
 * Function responsible for attaching all image-related listeners to any pictures attached to this prospect
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

	// Reset all the listeners for the pictures section
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
}

/**
 * Function responsible for deleting an uploaded image and wiping traces of its metadata from our system
 *
 * @param {Number} imageIndex - the index of the image to wipe from this prospect's image collection
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
	_picturesContainer.innerHTML = prospectPicturesTemplate({pictures: vm.pictures});

	_attachPictureListeners();
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
	_picturesContainer.innerHTML = prospectPicturesTemplate( {pictures: vm.pictures } );

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

_prospectNotesFields.addEventListener('change', setNotes);

// ----------------- PAGE INITIALIZATION --------------------------------

_attachPictureListeners();