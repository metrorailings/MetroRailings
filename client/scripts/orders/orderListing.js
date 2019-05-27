// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orders/viewModel';
import orderUtility from 'client/scripts/orders/orderUtility';

import noteHandler from 'client/scripts/notes/notes';
import uploader from 'client/scripts/uploadFile/uploadFile';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';
import confirmationModal from 'client/scripts/utility/confirmationModal';
import gallery from 'client/scripts/utility/gallery';
import translator from 'client/scripts/utility/translate';

// ----------------- ENUMS/CONSTANTS ---------------------------

const ORDER_PICTURES_TEMPLATE = 'orderPicturesTemplate',

	LISTENER_INIT_EVENT = 'listenerInit',

	ORDER_BLOCK_PREFIX = 'order-',

	REMOVE_ORDER_CLASS = 'trashLink',
	LOAD_PICTURES_LINK_CLASS = 'loadPicturesLink',
	UPLOADED_IMAGE_THUMBNAIL_CLASS = 'uploadedImageThumbnail',
	NOTE_LISTING = 'noteListing',
	FILE_LISTING = 'filesListing',

	HIDE_CLASS = 'hide',

	DELETE_ORDER_MESSAGE = '<span> Are you sure you want to <b> DELETE </b> this potential order? Once you delete' +
		' this order, you will need to go to the database administrator to restore this prospect back into the' +
		' system. </span>',

	DELETE_ORDER_URL = 'orders/removeOrder';

// ----------------- PRIVATE VARIABLES ---------------------------

let _noteListings = document.getElementsByClassName(NOTE_LISTING),
	_fileListings = document.getElementsByClassName(FILE_LISTING);

// ----------------- HANDLEBAR TEMPLATES ---------------------------

/**
 * The partial to render all pictures associated with a particular order
 */
let orderPicturesTemplate = Handlebars.compile(document.getElementById(ORDER_PICTURES_TEMPLATE).innerHTML);

// ----------------- PRIVATE FUNCTIONS ---------------------------

/**
 * Function meant to dynamically attach listeners to all picture loader links
 * Needed so that we can reattach listeners every time orders are re-rendered onto screen
 *
 * @author kinsho
 */
function _attachPictureLoadListeners()
{
	let pictureLinks = document.getElementsByClassName(LOAD_PICTURES_LINK_CLASS);

	for (let i = pictureLinks.length - 1; i >= 0; i--)
	{
		pictureLinks[i].addEventListener('click', loadPictures);
	}
}

/**
 * Function meant to dynamically attach listeners to all 'Remove from System' links
 * Needed so that we can reattach listeners every time orders are re-rendered onto screen
 *
 * @author kinsho
 */
function _attachOrderRemovalListeners()
{
	let removeLinks = document.getElementsByClassName(REMOVE_ORDER_CLASS);

	for (let i = removeLinks.length - 1; i >= 0; i--)
	{
		removeLinks[i].addEventListener('click', removeOrder);
	}
}

// ----------------- LISTENERS ---------------------------

/**
 * Listener meant to pull and display any pictures associated with an order
 *
 * @param {Event} event - the event associated with the firing of this listener
 *
 * @author kinsho
 */
async function loadPictures(event)
{
	let targetElement = event.currentTarget,
		parentContainer = targetElement.parentNode,
		orderID = window.parseInt(targetElement.dataset.id, 10),
		orderIndex = orderUtility.findOrderIndexById(vm.orders, orderID),
		order = vm.orders[orderIndex],
		pictures = order.pictures,
		thumbnails,
		i;

	// Fade out the link prior to loading images
	targetElement.classList.add(HIDE_CLASS);

	// Replace the link with the pictures
	parentContainer.removeChild(parentContainer.lastElementChild);
	parentContainer.innerHTML += orderPicturesTemplate(
	{
		id: orderID,
		pictures: pictures
	});

	// Set up a listener on each newly generated image so that we can load the image in gallery form
	thumbnails = parentContainer.getElementsByClassName(UPLOADED_IMAGE_THUMBNAIL_CLASS);
	for (i = thumbnails.length - 1; i >= 0; i--)
	{
		thumbnails[i].addEventListener('click', openGallery);
	}
}

/**
 * Listener meant to load a set of images in the gallery and then open up that gallery
 *
 * @param {Event} event - the event associated with the firing of this listener
 *
 * @author kinsho
 */
function openGallery(event)
{
	let currentTarget = event.currentTarget,
		pictureIndex = window.parseInt(currentTarget.dataset.index, 10),
		parentContainer = currentTarget.parentNode,
		orderID = window.parseInt(parentContainer.dataset.id, 10),
		orderIndex = orderUtility.findOrderIndexById(vm.orders, orderID),
		order = vm.orders[orderIndex],
		imageURLs = [];

	// Cycle through each image within the set and collect their src links
	for (let i = 0; i < order.pictures.length; i++)
	{
		imageURLs.push(order.pictures[i].shareLink);
	}
	gallery.open(imageURLs, pictureIndex);
}

/**
 * Listener meant to remove a prospect or pending order from the system
 *
 * @param {Event} event - the event associated with the firing of this listener
 *
 * @author kinsho
 */
function removeOrder(event)
{
	let targetElement = event.currentTarget,
		orderID = window.parseInt(targetElement.dataset.id, 10),
		orderIndex = orderUtility.findOrderIndexById(vm.orders, orderID),
		modalMessage = DELETE_ORDER_MESSAGE,
		orderBlock = document.getElementById(ORDER_BLOCK_PREFIX + orderID);

	// Translate the modal's message should the page's default language be set in anything other than English
	translator.translateText(modalMessage).then((modalBodyText) =>
	{
		// Confirm that we will be updating the status
		confirmationModal.open([modalBodyText], () =>
		{
			// Remove the order in the back-end so that it will no longer appear in the front-facing admin system
			axios.post(DELETE_ORDER_URL, { orderID: orderID }).then(() =>
			{
				// Remove the order from the cached collection of orders
				vm.orders.splice(orderIndex, 1);

				// Hide the block associated with this order from view
				orderBlock.classList.add(HIDE_CLASS);

			}, () =>
			{
				notifier.showGenericServerError();
			});

		}, () => {});
	}, () => {});
}

// ----------------- LISTENER INITIALIZATION -----------------------------

document.addEventListener(LISTENER_INIT_EVENT, () =>
{
	_attachPictureLoadListeners();
	_attachOrderRemovalListeners();

	// Ensure notes are submittable prior to running any note-specific logic
	if (_noteListings)
	{
		// Initializes all note areas
		for (let i = _noteListings.length - 1; i >= 0; i -= 1)
		{
			new noteHandler(_noteListings[i]);
		}
	}

	// Likewise, ensure it's possible to upload files before running any uploading logic
	if (_fileListings)
	{
		// Initialize all uploading sections
		for (let j = _fileListings.length - 1; j >= 0; j -= 1)
		{
			new uploader(_fileListings[j]);
		}
	}
});