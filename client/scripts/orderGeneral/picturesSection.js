// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderGeneral/viewModel';

import axios from 'client/scripts/utility/axios';
import gallery from 'client/scripts/utility/gallery';
import confirmationModal from 'client/scripts/utility/confirmationModal';
import notifier from 'client/scripts/utility/notifications';

// ----------------- ENUMS/CONSTANTS ---------------------------

const UPLOAD_PICTURE_BUTTON = 'uploadPictureButton',
	UPLOAD_PICTURE_INPUT = 'uploadPictureInput',
	PICTURES_LISTING_CONTAINER = 'picturesListingContainer',
	PICTURES_LISTING = 'picturesListing',
	PICTURES_LISTING_LOADER = 'picturesListingLoadingIcons',
	ORDER_PICTURES_TEMPLATE = 'newPictureTemplate',

	SHOW_CLASS = 'show',
	HIDE_CLASS = 'hide',

	DELETE_IMAGE_MESSAGE = 'Are you sure you want to delete this image? Once you delete this image, it will be gone' +
		' for good.',
	IMAGE_DISPLAY_HTML = '<img src=\'::imageSrc\' alt="Order Images" />',
	IMAGE_SOURCE_PLACEHOLDER = '::imageSrc',

	IMAGE_UPLOAD_FAILED = 'Your image upload failed. If you tried to upload a file that\'s not naturally an image,' +
		' then it\'s possible that\'s why the upload failed.',
	SAVE_PICTURES_URL = 'orderDetails/saveNewPictures',
	DELETE_PICTURE_URL = 'orderDetails/deletePicture';

// ----------------- PRIVATE VARIABLES ---------------------------

let _picturesContainer = document.getElementById(PICTURES_LISTING_CONTAINER),
	_picturesListing = document.getElementById(PICTURES_LISTING),
	_picturesLoader = document.getElementById(PICTURES_LISTING_LOADER);

// ----------------- HANDLEBAR TEMPLATES ---------------------------

let orderPicturesTemplate;

/**
 * The partial to load a new image into the pictures container
 */
if (_picturesContainer)
{
	orderPicturesTemplate = Handlebars.compile(document.getElementById(ORDER_PICTURES_TEMPLATE).innerHTML);
}

// ----------------- PRIVATE FUNCTIONS ---------------------------

/**
 * Function responsible for attaching all image-related listeners to any pictures attached to this order
 *
 * @author kinsho
 */
function _attachImageListeners()
{
	let image;

	for (let i = 0; i < _picturesListing.children.length; i += 1)
	{
		image = _picturesListing.children[i];
		image.firstElementChild.addEventListener('click', openGallery);
		image.lastElementChild.addEventListener('click', deleteImage);
	}
}

/**
 * Function responsible for deleting an uploaded image and wiping traces of its metadata from our system
 *
 * @param {HTMLElement} imgElement - the image element that needs to be removed from the page and the back-end
 *
 * @author kinsho
 */
async function _deleteImage(imgElement)
{
	let saveData =
		{
			id: imgElement.dataset.orderId,
			// Remove the metadata from our local cache of order data
			imgMeta: vm.pictures.splice(imgElement.dataset.index, 1)[0]
		};

	// Show a localized message indicating that we are in the midst of deleting a picture from our remote server
	_picturesContainer.classList.add(HIDE_CLASS);
	_picturesLoader.classList.add(SHOW_CLASS);

	// Reach out to the server to delete the image from Dropbox and wipe its metadata traces from the database
	await axios.post(DELETE_PICTURE_URL, saveData);

	// Reanimate the list of images to account for the image that was deleted and fix any indexing discrepancy
	_picturesListing.innerHTML = orderPicturesTemplate({ id : vm._id, pictures : vm.pictures });
	_attachImageListeners();

	// Take off any loading indicators now that we have a response back from the server
	_picturesContainer.classList.remove(HIDE_CLASS);
	_picturesLoader.classList.remove(SHOW_CLASS);
}

// ----------------- LISTENERS ---------------------------

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
	let imageURLs = [];

	// Cycle through each of the uploaded images and collect their src links
	for (let i = 0; i < vm.pictures.length; i++)
	{
		imageURLs.push(vm.pictures[i].shareLink);
	}
	gallery.open(imageURLs, window.parseInt(event.currentTarget.dataset.index, 10));
}

/**
 * Listener responsible for uploading an image to Dropbox and then recording metadata about
 * the remote Dropbox file to the server
 *
 * @author kinsho
 */
async function uploadImage()
{
	let filesToUpload = document.getElementById(UPLOAD_PICTURE_INPUT).files,
		saveData = new FormData(),
		imgMetadata;

	// Prepare all the files that needs to be uploaded
	for (let i = 0; i < filesToUpload.length; i += 1)
	{
		saveData.append('files', filesToUpload[i], filesToUpload[i].name);
	}

	// Append the ID of the order as well to the payload
	saveData.append('id', vm._id);

	// Show a localized message indicating that we are in the midst of uploading pictures to our remote server
	_picturesContainer.classList.add(HIDE_CLASS);
	_picturesLoader.classList.add(SHOW_CLASS);

	// Upload the images into Dropbox and save all the metadata within our own database
	try
	{
		imgMetadata = await axios.post(SAVE_PICTURES_URL, saveData, false,
		{
			'content-type': 'multipart/form-data'
		}, 15000 * filesToUpload.length);
		imgMetadata = imgMetadata.data;
	}
	catch(error)
	{
		notifier.showSpecializedServerError(IMAGE_UPLOAD_FAILED);
	}

	// Store the metadata within our own local cache of data for this particular order
	vm.pictures.push(...imgMetadata);

	// Reanimate the list of images to show the newly uploaded image(s)
	_picturesListing.innerHTML = orderPicturesTemplate({ id : vm._id, pictures : vm.pictures });
	_attachImageListeners();

	// Take off any loading indicators now that we have a response back from the server
	window.setTimeout(() =>
	{
		_picturesContainer.classList.remove(HIDE_CLASS);
		_picturesLoader.classList.remove(SHOW_CLASS);
	}, 2000);
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
	let imgElement = event.currentTarget.previousElementSibling,
		imageIndex = window.parseInt(imgElement.dataset.index, 10),
		imgMetadata = vm.pictures[imageIndex],
		modalMessage = DELETE_IMAGE_MESSAGE.replace(IMAGE_SOURCE_PLACEHOLDER, imgMetadata.shareLink),
		imgSrc = IMAGE_DISPLAY_HTML.replace(IMAGE_SOURCE_PLACEHOLDER, imgMetadata.shareLink);

	confirmationModal.open(['<span>' + modalMessage + '</span>' + imgSrc], () => { _deleteImage(imgElement); }, () => {});
}

// --------------- INITIALIZATION LOGIC ----------------------

// Ensure it's possible to upload pictures prior to running any logic that assumes we can upload pictures here
if (_picturesContainer)
{
	// Set the high-level listeners for the section
	document.getElementById(UPLOAD_PICTURE_BUTTON).addEventListener('click', triggerFileBrowser);
	document.getElementById(UPLOAD_PICTURE_INPUT).addEventListener('change', uploadImage);

	_attachImageListeners();

	// If this order has any pictures present, load the metadata associated with those pictures into the view model
	// Otherwise, initialize the view model with an empty array to signify that no pictures have yet been uploaded
	vm.pictures = window.MetroRailings.pictures || [];
}