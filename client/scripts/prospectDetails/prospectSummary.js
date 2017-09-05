// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/prospectDetails/viewModel';

import axios from 'client/scripts/utility/axios';
import dropbox from 'client/scripts/utility/dropbox';
import gallery from 'client/scripts/utility/gallery';
import confirmationModal from 'client/scripts/utility/confirmationModal';

// ----------------- ENUMS/CONSTANTS ---------------------------

var PROSPECT_NOTES_TEXT_AREA = 'prospectNotes',
	UPLOAD_PICTURE_BUTTON = 'uploadPictureButton',
	UPLOAD_PICTURE_INPUT = 'uploadPictureInput',
	PICTURES_LISTING = 'picturesListingContainer',
	PROSPECT_PICTURES_TEMPLATE = 'prospectPicturesTemplate',
	LOADING_VEIL = 'baseLoaderOverlay',

	SAVE_PICTURES_URL = 'prospectDetails/saveNewPicture',
	DELETE_PICTURE_URL = 'prospectDetails/deletePicture',

	VISIBILITY_CLASS = 'show',
	UPLOADED_IMAGES_CLASS = 'uploadedImageThumbnail',
	DELETE_IMAGE_ICON_CLASS = 'deleteImage',

	DELETE_IMAGE_MESSAGE = '<span id=\'deleteImageWarning\'>Are you sure you want to delete this image?' +
		' Once you delete this image, it\'\ll be gone for good.</span><img src=\'::imageSrc\' />',
	IMAGE_SOURCE_PLACEHOLDER = '::imageSrc';

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
		deleteIcons,
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

	deleteIcons = _picturesContainer.getElementsByClassName(DELETE_IMAGE_ICON_CLASS);
	for (i = deleteIcons.length - 1; i >= 0; i--)
	{
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
	var imgMetadata = vm.pictures[imageIndex],
		saveData =
		{
			id: vm._id,
		};

	_loadingVeil.classList.add(VISIBILITY_CLASS);

	// Erase the file from the Dropbox repository
	await dropbox.deleteFile(imgMetadata.path_lower);

	// Then erase metadata about the wiped image from the database
	saveData.imgMeta = vm.pictures.splice(imageIndex, 1)[0];
	await axios.post(DELETE_PICTURE_URL, saveData, false);

	_loadingVeil.classList.remove(VISIBILITY_CLASS);
	_renderImageListing();
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
		revisedFileName = vm._id + '-' + (new Date().toTimeString()) + '.' + imageNameComponents[imageNameComponents.length - 1],
		saveData =
		{
			id: vm._id,
		},
		imgMetadata;

	_loadingVeil.classList.add(VISIBILITY_CLASS);

	imgMetadata = await dropbox.uploadFile(fileToUpload, revisedFileName);

	// Push the image metadata into the database
	saveData.imgMeta = imgMetadata.data;
	vm.pictures.push(saveData.imgMeta);

	await axios.post(SAVE_PICTURES_URL, saveData, false);

	_loadingVeil.classList.remove(VISIBILITY_CLASS);
	_renderImageListing();
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

	confirmationModal.open([DELETE_IMAGE_MESSAGE.replace(IMAGE_SOURCE_PLACEHOLDER, imgMetadata.fullLink)], () => { _deleteImage(imageIndex); }, () => {});
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_prospectNotesFields.addEventListener('change', setNotes);

// ----------------- PAGE INITIALIZATION --------------------------------

_renderImageListing();