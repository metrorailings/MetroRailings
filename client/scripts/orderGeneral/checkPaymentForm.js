// ----------------- EXTERNAL MODULES --------------------------

import paymentsVM from 'client/scripts/orderGeneral/paymentsViewModel';
import vm from 'client/scripts/orderGeneral/viewModel';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

import paymentRecord from 'client/scripts/orderGeneral/paymentRecord';

// ----------------- ENUMS/CONSTANTS ---------------------------

const CHECK_PAYMENT_AMOUNT = 'newPaymentCheckAmount',
	CHECK_MEMO = 'checkMemo',
	CHECK_UPLOAD_BOX = 'checkUploadBox',
	CHECK_UPLOAD_FILE = 'checkUploadFile',
	NO_CHECK_IMAGE_UPLOADED = 'noCheckImageUploaded',
	YES_CHECK_IMAGE_UPLOADED = 'yesCheckImageUploaded',
	CHECK_SUBMIT_BUTTON = 'checkSaveButton',

	CHANGE_BALANCE_REMAINING_LISTENER = 'changeBalanceRemaining',

	HIDE_CLASS = 'hide',

	CHECK_PAYMENT_URL = 'payment/recordCheckPayment',
	SUCCESS_MESSAGE = 'Success! A new check payment has been made on this order in the amount of $',
	IMAGE_UPLOAD_FAILED = 'Your image upload failed. If you tried to upload a file that\'s not naturally an image,' +
		' then it\'s possible that\'s why the upload failed.';

// ----------------- PRIVATE VARIABLES ---------------------------

let _checkPaymentAmount = document.getElementById(CHECK_PAYMENT_AMOUNT),
	_checkMemo = document.getElementById(CHECK_MEMO),
	_checkUploadBox = document.getElementById(CHECK_UPLOAD_BOX),
	_checkUploadFile = document.getElementById(CHECK_UPLOAD_FILE),
	_noImageUploaded = document.getElementById(NO_CHECK_IMAGE_UPLOADED),
	_yesImageUploaded = document.getElementById(YES_CHECK_IMAGE_UPLOADED),
	_checkSubmitButton = document.getElementById(CHECK_SUBMIT_BUTTON);

// ----------------- PRIVATE FUNCTIONS ---------------------------

/**
 * Function that clears out all the values that were written or selected in the check form
 *
 * @author kinsho
 */
function _clearCheckForm()
{
	_checkPaymentAmount.value = '';
	_checkMemo.value = '';
	_checkUploadFile.value = '';

	paymentsVM.checkAmount = '';
	paymentsVM.checkMemo = '';
	paymentsVM.isCheckImageProvided = false;

	// Show the section of HTML that notifies the admin that a new check image can be uploaded
	_noImageUploaded.classList.remove(HIDE_CLASS);
	_yesImageUploaded.classList.add(HIDE_CLASS);
}

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
 * Function that sets a memo in the view model
 */
function setCheckMemo()
{
	paymentsVM.checkMemo = _checkMemo.value;
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
		paymentData, balanceEvent;

	if (paymentsVM.isCheckFormSubmissible)
	{
		// Prepare all the data to be sent over the wire
		saveData.append('checkImage', checkImage, checkImage.name);
		saveData.append('orderId', vm._id);
		saveData.append('amount', paymentsVM.checkAmount);
		saveData.append('memo', paymentsVM.checkMemo || '');

		// Disable the submission button to prevent accidental resends
		_checkSubmitButton.disabled = true;

		try
		{
			paymentData = await axios.post(CHECK_PAYMENT_URL, saveData, true,
				{ 'content-type': 'multipart/form-data' }, 15000);

			// Show a message indicating the payment was successfully recorded
			notifier.showSuccessMessage(SUCCESS_MESSAGE + paymentsVM.checkAmount);

			// Update the payments chart to reflect the new payment
			paymentRecord.produceNewRecord(paymentData.data);

			// Update the balance remaining
			balanceEvent = new CustomEvent(CHANGE_BALANCE_REMAINING_LISTENER,
				{ detail: { amount : paymentsVM.checkAmount } });
			document.dispatchEvent(balanceEvent);

			// Blank out all the values in the check form
			_clearCheckForm();

			_checkSubmitButton.disabled = false;
		}
		catch(error)
		{
			console.log('Ran into an error trying to record a new check payment...');
			console.error(error);

			notifier.showSpecializedServerError(IMAGE_UPLOAD_FAILED);

			_checkSubmitButton.disabled = false;
		}
	}
}

// ----------------- INITIALIZATION LOGIC ---------------------------

if (_checkPaymentAmount)
{
	_checkPaymentAmount.addEventListener('change', setCheckAmount);
	_checkMemo.addEventListener('change', setCheckMemo);

	_checkUploadBox.addEventListener('click', () =>
	{
		_checkUploadFile.click();
	});
	_checkUploadFile.addEventListener('change', uploadImage);

	_checkSubmitButton.addEventListener('click', submitCheckForm);

	paymentsVM.isCheckFormSubmissible = false;
}