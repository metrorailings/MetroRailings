// ----------------- EXTERNAL MODULES --------------------------

import paymentsVM from 'client/scripts/orderGeneral/paymentsViewModel';
import vm from 'client/scripts/orderGeneral/viewModel';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

// ----------------- ENUMS/CONSTANTS ---------------------------

const CASH_PAYMENT_AMOUNT = 'newPaymentCashAmount',
	CASH_UPLOAD_BOX = 'cashUploadBox',
	CASH_UPLOAD_FILE = 'cashUploadFile',
	NO_CASH_IMAGE_UPLOADED = 'noCashImageUploaded',
	YES_CASH_IMAGE_UPLOADED = 'yesCashImageUploaded',
	CASH_SUBMIT_BUTTON = 'cashSaveButton',

	HIDE_CLASS = 'hide',

	CASH_PAYMENT_URL = 'payment/recordCashPayment',
	SUCCESS_MESSAGE = 'Success! A new payment has been made on this order in the amount of $',
	IMAGE_UPLOAD_FAILED = 'Your image upload failed. If you tried to upload a file that\'s not naturally an image,' +
		' then it\'s possible that\'s why the upload failed.';

// ----------------- PRIVATE VARIABLES ---------------------------

let _cashPaymentAmount = document.getElementById(CASH_PAYMENT_AMOUNT),
	_cashUploadBox = document.getElementById(CASH_UPLOAD_BOX),
	_cashUploadFile = document.getElementById(CASH_UPLOAD_FILE),
	_noImageUploaded = document.getElementById(NO_CASH_IMAGE_UPLOADED),
	_yesImageUploaded = document.getElementById(YES_CASH_IMAGE_UPLOADED),
	_cashSubmitButton = document.getElementById(CASH_SUBMIT_BUTTON);

// ----------------- LISTENERS ---------------------------

/**
 * Function to set the cash amount into the payment view model
 *
 * @author kinsho
 */
function setCashAmount()
{
	paymentsVM.cashAmount = _cashPaymentAmount.value;
}

/**
 * Function responsible for noting whether an image is ready to be uploaded
 */
function uploadImage()
{
	if (_cashUploadFile.files && _cashUploadFile.files.length)
	{
		paymentsVM.isCashImageProvided = true;

		// Show the section of HTML indicating an image is ready to be uploaded
		_noImageUploaded.classList.add(HIDE_CLASS);
		_yesImageUploaded.classList.remove(HIDE_CLASS);
	}
}

async function submitCashForm()
{
	let saveData = new FormData(),
		cashImage = _cashUploadFile.files[0],
		serverData;

	if (paymentsVM.isCashFormSubmissible)
	{
		// Prepare all the data to be sent over the wire
		saveData.append('cashImage', cashImage, cashImage.name);
		saveData.append('orderId', vm._id);
		saveData.append('amount', paymentsVM.cashAmount);

		// Now send the data over the wire
		try
		{
			serverData = await axios.post(CASH_PAYMENT_URL, saveData, false,
				{ 'content-type': 'multipart/form-data' }, 15000);
			serverData = serverData.data;

			notifier.showSuccessMessage(SUCCESS_MESSAGE + paymentsVM.cashAmount);
			// @TODO Update the payment chart to reflect the new check payment
		}
		catch(error)
		{
			notifier.showSpecializedServerError(IMAGE_UPLOAD_FAILED);
		}
	}
}

// ----------------- INITIALIZATION LOGIC ---------------------------

_cashPaymentAmount.addEventListener('change', setCashAmount);

_cashUploadBox.addEventListener('click', () =>
{
	_cashUploadFile.click();
});
_cashUploadFile.addEventListener('change', uploadImage);

_cashSubmitButton.addEventListener('click', submitCashForm);