// ----------------- EXTERNAL MODULES --------------------------

import paymentsVM from 'client/scripts/orderGeneral/paymentsViewModel';
import vm from 'client/scripts/orderGeneral/viewModel';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

import paymentRecord from 'client/scripts/orderGeneral/paymentRecord';

// ----------------- ENUMS/CONSTANTS ---------------------------

const CASH_PAYMENT_AMOUNT = 'newPaymentCashAmount',
	CASH_MEMO = 'cashMemo',
	CASH_UPLOAD_BOX = 'cashUploadBox',
	CASH_UPLOAD_FILE = 'cashUploadFile',
	NO_CASH_IMAGE_UPLOADED = 'noCashImageUploaded',
	YES_CASH_IMAGE_UPLOADED = 'yesCashImageUploaded',
	CASH_SUBMIT_BUTTON = 'cashSaveButton',

	PARENT_SECTION_LISTENER = 'parentSectionListener',

	HIDE_CLASS = 'hide',

	CASH_PAYMENT_URL = 'payment/recordCashPayment',
	SUCCESS_MESSAGE = 'Success! A new cash payment has been made on this order in the amount of $',
	IMAGE_UPLOAD_FAILED = 'Your image upload failed. If you tried to upload a file that\'s not naturally an image,' +
		' then it\'s possible that\'s why the upload failed.';

// ----------------- PRIVATE VARIABLES ---------------------------

let _cashPaymentAmount = document.getElementById(CASH_PAYMENT_AMOUNT),
	_cashMemo = document.getElementById(CASH_MEMO),
	_cashUploadBox = document.getElementById(CASH_UPLOAD_BOX),
	_cashUploadFile = document.getElementById(CASH_UPLOAD_FILE),
	_noImageUploaded = document.getElementById(NO_CASH_IMAGE_UPLOADED),
	_yesImageUploaded = document.getElementById(YES_CASH_IMAGE_UPLOADED),
	_cashSubmitButton = document.getElementById(CASH_SUBMIT_BUTTON);

// ----------------- PRIVATE FUNCTIONS ---------------------------

/**
 * Function that clears out all the values that were written or selected in the cash form
 *
 * @author kinsho
 */
function _clearCashForm()
{
	_cashPaymentAmount.value = '';
	_cashMemo.value = '';
	_cashUploadFile.value = '';

	paymentsVM.cashAmount = '';
	paymentsVM.cashMemo = '';
	paymentsVM.isCashImageProvided = false;

	// Show the section of HTML that notifies the admin that a new check image can be uploaded
	_noImageUploaded.classList.remove(HIDE_CLASS);
	_yesImageUploaded.classList.add(HIDE_CLASS);
}

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
 * Function that sets a memo in the view model
 */
function setCashMemo()
{
	paymentsVM.cashMemo = _cashMemo.value;
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
		paymentData, balanceEvent;

	if (paymentsVM.isCashFormSubmissible)
	{
		// Prepare all the data to be sent over the wire
		saveData.append('cashImage', cashImage, cashImage.name);
		saveData.append('orderId', vm._id);
		saveData.append('amount', paymentsVM.cashAmount);
		saveData.append('memo', paymentsVM.cashMemo);

		// Disable the submission button to prevent accidental resends
		_cashSubmitButton.disabled = true;

		// Now send the data over the wire
		try
		{
			paymentData = await axios.post(CASH_PAYMENT_URL, saveData, true,
				{ 'content-type': 'multipart/form-data' }, 30000);

			// Show a message indicating the payment was successfully recorded
			notifier.showSuccessMessage(SUCCESS_MESSAGE + paymentsVM.cashAmount);

			// Update the payments chart to reflect the new payment
			paymentRecord.produceNewRecord(paymentData.data);

			// Update the balance remaining
			balanceEvent = new CustomEvent(PARENT_SECTION_LISTENER,
				{ detail: { amount : paymentsVM.cashAmount } });
			document.dispatchEvent(balanceEvent);

			// Blank out all the values in the cash form
			_clearCashForm();

			_cashSubmitButton.disabled = false;
		}
		catch(error)
		{
			console.log('Ran into an error trying to record a new cash payment...');
			console.error(error);

			notifier.showSpecializedServerError(IMAGE_UPLOAD_FAILED);

			_cashSubmitButton.disabled = false;
		}
	}
}

// ----------------- INITIALIZATION LOGIC ---------------------------

if (_cashPaymentAmount)
{
	_cashPaymentAmount.addEventListener('change', setCashAmount);
	_cashMemo.addEventListener('change', setCashMemo);

	_cashUploadBox.addEventListener('click', () =>
	{
		_cashUploadFile.click();
	});
	_cashUploadFile.addEventListener('change', uploadImage);

	_cashSubmitButton.addEventListener('click', submitCashForm);

	paymentsVM.isCashFormSubmissible = false;
}