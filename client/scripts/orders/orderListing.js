// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orders/viewModel';
import orderUtility from 'client/scripts/orders/orderUtility';

import statuses from 'shared/orderStatus';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';
import confirmationModal from 'client/scripts/utility/confirmationModal';
import rQueryClient from 'client/scripts/utility/rQueryClient';
import dropbox from 'client/scripts/utility/dropbox';
import gallery from 'client/scripts/utility/gallery';

// ----------------- ENUMS/CONSTANTS ---------------------------

var ORDER_PICTURES_TEMPLATE = 'orderPicturesTemplate',
	ORDER_PRINT_TEMPLATE = 'orderPrintTemplate',

	UPDATE_STATUS_URL = 'orders/updateStatus',
	ORDER_DETAILS_URL = '/orderDetails?orderNumber=::orderID',

	LISTENER_INIT_EVENT = 'listenerInit',

	STATUS_LINK_CLASS = 'nextStatusLink',
	PRINT_LINK_CLASS = 'printLink',
	LOAD_PICTURES_LINK_CLASS = 'loadPicturesLink',
	ORDER_DETAILS_BUTTON_CLASS = 'orderDetailsButton',
	UPLOADED_IMAGE_THUMBNAIL_CLASS = 'uploadedImageThumbnail',
	HIDE_CLASS = 'hide',

	NEXT_STATUS_MESSAGE = 'Are you sure you want to update order <b>::orderID</b> to <b>::nextStatus</b>?',

	ORDER_ID_PLACEHOLDER = '::orderID',
	NEXT_STATUS_PLACEHOLDER = '::nextStatus';

// ----------------- HANDLEBAR TEMPLATES ---------------------------

/**
 * The partial to render all pictures associated with a particular order
 */
var orderPicturesTemplate = Handlebars.compile(document.getElementById(ORDER_PICTURES_TEMPLATE).innerHTML);

/**
 * The partial to render the HTML containing the vital order details that will need to be print out for shop purposes
 */
var orderPrintTemplate = Handlebars.compile(document.getElementById(ORDER_PRINT_TEMPLATE).innerHTML);
// ----------------- PRIVATE FUNCTIONS ---------------------------

/**
 * Function meant to dynamically attach listeners to all status upgrade links
 * Needed so that we can reattach listeners every time orders are re-rendered onto screen
 *
 * @author kinsho
 */
function _attachStatusLinkListeners()
{
	var statusLinks = document.getElementsByClassName(STATUS_LINK_CLASS),
		i;

	for (i = statusLinks.length - 1; i >= 0; i--)
	{
		statusLinks[i].addEventListener('click', updateStatus);
	}
}

/**
 * Function meant to dynamically attach listeners to all print links
 * Needed so that we can reattach listeners every time orders are re-rendered onto screen
 *
 * @author kinsho
 */
function _attachPrintListeners()
{
	var printLinks = document.getElementsByClassName(PRINT_LINK_CLASS),
		i;

	for (i = printLinks.length - 1; i >= 0; i--)
	{
		printLinks[i].addEventListener('click', printOrder);
	}
}

/**
 * Function meant to dynamically attach listeners to all picture loader links
 * Needed so that we can reattach listeners every time orders are re-rendered onto screen
 *
 * @author kinsho
 */
function _attachPictureLoadListeners()
{
	var pictureLinks = document.getElementsByClassName(LOAD_PICTURES_LINK_CLASS),
		i;

	for (i = pictureLinks.length - 1; i >= 0; i--)
	{
		pictureLinks[i].addEventListener('click', loadPictures);
	}
}

/**
 * Function meant to dynamically attach listeners to all Edit buttons
 * Needed so that we can reattach listeners every time orders are re-rendered onto screen
 *
 * @author kinsho
 */
function _attachNavigationListeners()
{
	var editButtons = document.getElementsByClassName(ORDER_DETAILS_BUTTON_CLASS),
		i;

	for (i = editButtons.length - 1; i >= 0; i--)
	{
		editButtons[i].addEventListener('click', navigateToDetailsPage);
	}
}

// ----------------- LISTENERS ---------------------------

/**
 * Listener meant to print out the details of an order
 *
 * @param {Event} event - the event associated with the firing of this listener
 *
 * @author kinsho
 */
async function printOrder()
{
	var currentTarget = event.currentTarget,
		orderID = window.parseInt(currentTarget.dataset.id, 10),
		orderIndex = orderUtility.findOrderIndexById(vm.orders, orderID),
		order = vm.orders[orderIndex],
		pictures = order.pictures,
		printWindow = window.open('', '', 'left=0,top=0,width=1,height=1,toolbar=0,scrollbars=1,status=0'),
		i;

	// Fetch a link to each picture
	for (i = 0; i < pictures.length; i++)
	{
		if ( !(pictures[i].fullLink) )
		{
			pictures[i].fullLink = await dropbox.fetchLink(pictures[i]);
		}
	}

	// Generate the HTML to print out

	// Use the newly initialized window to print out details relating to the order
	printWindow.document.write(orderPrintTemplate({order: order}));
	printWindow.document.close();
	printWindow.focus();
	printWindow.print();
	printWindow.close();
}

/**
 * Listener meant to pull and display any pictures associated with an order
 *
 * @param {Event} event - the event associated with the firing of this listener
 *
 * @author kinsho
 */
async function loadPictures(event)
{
	var targetElement = event.currentTarget,
		parentContainer = targetElement.parentNode,
		orderID = window.parseInt(targetElement.dataset.id, 10),
		orderIndex = orderUtility.findOrderIndexById(vm.orders, orderID),
		order = vm.orders[orderIndex],
		pictures = order.pictures,
		thumbnails,
		i;

	// Fade out the link prior to loading images
	targetElement.classList.add(HIDE_CLASS);

	// Fetch a link to each picture
	for (i = 0; i < pictures.length; i++)
	{
		if ( !(pictures[i].fullLink) )
		{
			pictures[i].fullLink = await dropbox.fetchLink(pictures[i]);
		}
	}

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
	var currentTarget = event.currentTarget,
		pictureIndex = window.parseInt(currentTarget.dataset.index, 10),
		parentContainer = currentTarget.parentNode,
		orderID = window.parseInt(parentContainer.dataset.id, 10),
		orderIndex = orderUtility.findOrderIndexById(vm.orders, orderID),
		order = vm.orders[orderIndex],
		imageURLs = [],
		i;

	// Cycle through each image within the set and collect their src links
	for (i = 0; i < order.pictures.length; i++)
	{
		imageURLs.push(order.pictures[i].fullLink);
	}
	gallery.open(imageURLs, pictureIndex);
}

/**
 * Listener meant to move an order along to the next phase of development
 *
 * @param {Event} event - the event associated with the firing of this listener
 *
 * @author kinsho
 */
function updateStatus(event)
{
	var targetElement = event.currentTarget,
		orderID = window.parseInt(targetElement.dataset.id, 10),
		orderIndex = orderUtility.findOrderIndexById(vm.orders, orderID),
		order = vm.orders[orderIndex],
		nextStatus = statuses.moveStatusToNextLevel(order.status),
		// Generate the message to place within the confirmation modal
		modalMessage = NEXT_STATUS_MESSAGE.replace(ORDER_ID_PLACEHOLDER, orderID)
			.replace(NEXT_STATUS_PLACEHOLDER, rQueryClient.capitalize(nextStatus));

	// Confirm that we will be updating the status
	confirmationModal.open([modalMessage], () =>
	{
		// Update the status in the back-end, then use the results from the service to modify the local copy of data as needed
		axios.post(UPDATE_STATUS_URL, { orderID: orderID }).then((results) =>
		{
			// Update the last known modification date for the order in context
			order.lastModifiedDate = results.data.lastModifiedDate;

			// Update the status to the next one in the development cycle
			order.status = results.data.status;

			// Move the newly modified order to the front of the pack to indicate that it was the order most recently modified
			vm.orders.splice(orderIndex, 1);
			vm.orders.unshift(order);
		}, () =>
		{
			notifier.showGenericServerError();
		});

	}, () => {});
}

/**
 * Listener meant to take the user to the order details page for a particular order
 *
 * @param {Event} event - the event associated with the firing of this listener
 *
 * @author kinsho
 */
function navigateToDetailsPage(event)
{
	var targetElement = event.currentTarget,
		orderID = targetElement.dataset.id,
		orderDetailsURL = ORDER_DETAILS_URL.replace(ORDER_ID_PLACEHOLDER, orderID);

	window.location.href = orderDetailsURL;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

document.addEventListener(LISTENER_INIT_EVENT, () =>
{
	_attachStatusLinkListeners();
	_attachPrintListeners();
	_attachPictureLoadListeners();
	_attachNavigationListeners();
});