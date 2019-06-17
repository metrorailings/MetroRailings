// ----------------- EXTERNAL MODULES --------------------------

import paymentsVM from 'client/scripts/orderGeneral/paymentsViewModel';
import vm from 'client/scripts/orderGeneral/viewModel';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

// ----------------- ENUMS/CONSTANTS ---------------------------

const CHECK_PAYMENT_AMOUNT = 'newPaymentCheckAmount',
	CHECK_UPLOAD_BOX = 'checkUploadBox',
	CHECK_UPLOAD_FILE = 'checkUploadFile',
	NO_CHECK_IMAGE_UPLOADED = 'noCheckImageUploaded',
	YES_CHECK_IMAGE_UPLOADED = 'yesCheckImageUploaded',
	CHECK_SUBMIT_BUTTON = 'checkSaveButton',

	HIDE_CLASS = 'hide',

	CHECK_PAYMENT_URL = 'payment/recordCheckPayment',
	SUCCESS_MESSAGE = 'Success! A new payment has been made on this order in the amount of $',
	IMAGE_UPLOAD_FAILED = 'Your image upload failed. If you tried to upload a file that\'s not naturally an image,' +
		' then it\'s possible that\'s why the upload failed.';

// ----------------- PRIVATE VARIABLES ---------------------------

let _checkPaymentAmount = document.getElementById(CHECK_PAYMENT_AMOUNT),
	_checkUploadBox = document.getElementById(CHECK_UPLOAD_BOX),
	_checkUploadFile = document.getElementById(CHECK_UPLOAD_FILE),
	_noImageUploaded = document.getElementById(NO_CHECK_IMAGE_UPLOADED),
	_yesImageUploaded = document.getElementById(YES_CHECK_IMAGE_UPLOADED),
	_checkSubmitButton = document.getElementById(CHECK_SUBMIT_BUTTON);

// ----------------- LISTENERS ---------------------------

/**
 * Function to set the check amount into the payment view model
 *
 * @author kinsho
 */
function setCheckAmount()
{
	paymentsVM.checkAmount = _checkPaymentAmount.value;
}

/**
 * Function responsible for noting whether an image is ready to be uploaded
 */
function uploadImage()
{
	if (_checkUploadFile.files && _checkUploadFile.files.length)
	{
		paymentsVM.isCheckImageProvided = true;

		// Show the section of HTML indicating an image is ready to be uploaded
		_noImageUploaded.classList.add(HIDE_CLASS);
		_yesImageUploaded.classList.remove(HIDE_CLASS);
	}
}

async function submitCheckForm()
{
	let saveData = new FormData(),
		checkImage = _checkUploadFile.files[0],
		serverData;

	if (paymentsVM.isCheckFormSubmissible)
	{
		// Prepare all the data to be sent over the wire
		saveData.append('checkImage', checkImage, checkImage.name);
		saveData.append('orderId', vm._id);
		saveData.append('amount', paymentsVM.checkAmount);
	
		// Now send the data over the wire
		try
		{
			serverData = await axios.post(CHECK_PAYMENT_URL, saveData, false,
				{ 'content-type': 'multipart/form-data' }, 15000);
			serverData = serverData.data;

			notifier.showSuccessMessage(SUCCESS_MESSAGE + paymentsVM.checkAmount);
			// @TODO Update the payment chart to reflect the new check payment
		}
		catch(error)
		{
			notifier.showSpecializedServerError(IMAGE_UPLOAD_FAILED);
		}
	}
}

// ----------------- INITIALIZATION LOGIC ---------------------------

_checkPaymentAmount.addEventListener('change', setCheckAmount);

_checkUploadBox.addEventListener('click', () =>
{
	_checkUploadFile.click();
});
_checkUploadFile.addEventListener('change', uploadImage);

_checkSubmitButton.addEventListener('click', submitCheckForm);