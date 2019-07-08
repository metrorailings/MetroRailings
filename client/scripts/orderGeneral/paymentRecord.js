// ----------------- EXTERNAL MODULES --------------------------

import gallery from 'client/scripts/utility/gallery';

// ----------------- ENUMS/CONSTANTS ---------------------------

const PAYMENT_RECORD_TEMPLATE = 'paymentRecordTemplate',
	PAYMENT_RECORD_CONTAINER = 'paymentRecordContainer';

// ----------------- PRIVATE VARIABLES --------------------------

let paymentRecordContainer = document.getElementById(PAYMENT_RECORD_CONTAINER),
	recordTemplate;

// ----------------- HANDLEBAR TEMPLATES --------------------------

/**
 * The partial to load payment records dynamically
 */
if (paymentRecordContainer)
{
	recordTemplate = Handlebars.compile(document.getElementById(PAYMENT_RECORD_TEMPLATE).innerHTML);
}

// ----------------- LISTENERS ---------------------------

/**
 * Function that opens up the gallery so that admins can take a much better look at checks or cash receipts
 *
 * @param {Event} event - the event object responsible for invoking this function
 *
 * @author kinsho
 */
function blowUpPictures(event)
{
	let target = event.currentTarget,
		pictures = paymentRecordContainer.getElementsByTagName('img'),
		indexToStart = -1, imageIndex = -1,
		imageURLs = [];

	for (let i = 0; i < pictures.length; i += 1)
	{
		imageURLs.push(pictures[i].src);
		imageIndex += 1;

		// Mark the index at which the image that was clicked upon resides in the gallery list
		if (target.src === pictures[i].src)
		{
			indexToStart = imageIndex;
		}
	}

	// Open up the gallery with the images that need to be shown
	gallery.open(imageURLs, indexToStart);
}

// ----------------- MODULE ---------------------------

let paymentRecordModule =
{
	/**
	 * Function that generates new payment records on the fly given payment information
	 *
	 * @param {Object} paymentData - the data which will be used to populate the record
	 *
	 * @author kinsho
	 */
	produceNewRecord : function(paymentData)
	{
		let newHTML = document.createElement('template'),
			recordImgs = paymentRecordContainer.getElementsByTagName('img'),
			numOfOriginalImgs = recordImgs.length;

		newHTML.innerHTML = recordTemplate(paymentData);
		paymentRecordContainer.insertBefore(newHTML.content.firstChild, paymentRecordContainer.firstElementChild);

		// If an image element is present in the new record, tag the image as clickable
		if (recordImgs.length > numOfOriginalImgs)
		{
			recordImgs[0].addEventListener('click', blowUpPictures);
		}
	}
};

// ----------------- INITIALIZATION ---------------------------

if (paymentRecordContainer)
{
	let paymentImages = paymentRecordContainer.getElementsByTagName('img');

	// Attach listeners to all images present in the payment records already loaded on the page
	for (let i = 0; i < paymentImages.length; i += 1)
	{
		paymentImages[i].addEventListener('click', blowUpPictures);
	}
}

// ----------------- MOULE EXPORT ---------------------------

export default paymentRecordModule;