/**
 * @main uploadFile
 */

// ----------------- EXTERNAL MODULES --------------------------

import axios from 'client/scripts/utility/axios';
import tooltipManager from 'client/scripts/utility/tooltip';
import handlebarHelpers from 'client/scripts/utility/handlebarHelpers';

import viewModel from 'client/scripts/uploadFile/viewModel';
import notifier from '../utility/notifications';

// ----------------- ENUMS/CONSTANTS --------------------------

const UPLOAD_FILE_SECTION = 'fileUploadSection',
	UPLOAD_FILE_SELECT = 'uploadFileType',
	UPLOAD_FILE_INPUT = 'uploadFileInput',
	UPLOADING_INDICATORS = 'fileUploadingIndicators',

	PICTURES_LISTING = 'picturesContainer',
	DRAWINGS_LISTING = 'drawingsContainer',
	FILES_LISTING = 'filesContainer',

	LOAD_PICTURES_LINK = 'loadPicturesLink',
	LOAD_DRAWINGS_LINK = 'loadDrawingsLink',
	LOAD_FILES_LINK = 'loadFilesLink',

	THUMBNAIL_TEMPLATE = 'thumbnailTemplate',

	HIDE_CLASS = 'hide',

	UPLOAD_FILE_URL = 'uploadFile/saveFile',
	LOAD_PICTURES_URL = 'uploadFile/loadPictures',
	LOAD_DRAWINGS_URL = 'uploadFile/loadDrawings',
	LOAD_FILES_URL = 'uploadFile/loadFiles',

	FILE_UPLOAD_FAILED = 'Your file upload failed. If it\'s an unusual file, that may be why the upload is failing.' +
		' Consult Rickin for assistance.';

// ----------------- HANDLEBAR TEMPLATES --------------------------

/**
 * The partial to load thumbnails into view
 */
const thumbnailTemplate = Handlebars.compile(document.getElementById(THUMBNAIL_TEMPLATE).innerHTML);

// ----------------- PRIVATE FUNCTION --------------------------

/**
 * Function responsible for loading a new thumbnail into view inside whatever section it belongs to
 *
 * @param {Object} file - the file that will be represented by the thumbnail
 * @param {Number} orderId - the ID of the order associated with the file being represented
 * @param {HTMLElement} fileContainer - the thumbnail listing in which to include the new thumbnail
 *
 * @author kinsho
 */
function _loadNewThumbnail(file, orderId, fileContainer)
{
	let newHTML = document.createElement('template');
	newHTML.innerHTML = thumbnailTemplate({ shareLink : file.shareLink, orderId : orderId });
	fileContainer.appendChild(newHTML.content.firstChild);
}

// ----------------- MODULE ---------------------------

/**
 * Constructor function that'll help us upload new files for any order
 *
 * @param {HTMLElement} filesContainer - the HTML container containing the upload and preview interfaces
 *
 * @author kinsho
 */
function initUploader(filesContainer)
{
	// Instantiate the view model that will be associated with the section that will be used to create new notes
	let vm = new viewModel(filesContainer.getElementsByClassName(UPLOAD_FILE_SECTION)[0]),
		uploadForm = filesContainer.getElementsByClassName(UPLOAD_FILE_SECTION)[0],
		fileTypeSelect = filesContainer.getElementsByClassName(UPLOAD_FILE_SELECT)[0],
		fileInput = filesContainer.getElementsByClassName(UPLOAD_FILE_INPUT)[0],
		uploadingIndicators = filesContainer.getElementsByClassName(UPLOADING_INDICATORS)[0],
		picturesListing = filesContainer.getElementsByClassName(PICTURES_LISTING)[0],
		drawingsListing = filesContainer.getElementsByClassName(DRAWINGS_LISTING)[0],
		fileListing = filesContainer.getElementsByClassName(FILES_LISTING)[0],
		loadPicturesLink = filesContainer.getElementsByClassName(LOAD_PICTURES_LINK)[0],
		loadDrawingsLink = filesContainer.getElementsByClassName(LOAD_DRAWINGS_LINK)[0],
		loadFilesLink = filesContainer.getElementsByClassName(LOAD_FILES_LINK)[0],

		startUploadProcess = () =>
		{
			// The upload process begins when the type of file being uploaded is specified
			vm.type = fileTypeSelect.value;

			fileInput.click();
		},

		uploadFile = async function()
		{
			let filesToUpload = fileInput.files,
				saveData = new FormData(),
				imgMetadata;

			// Prepare all the files that needs to be uploaded
			for (let i = 0; i < filesToUpload.length; i += 1)
			{
				saveData.append('files', filesToUpload[i], filesToUpload[i].name);
			}

			// Append the ID of the order as well to the payload
			saveData.append('id', vm.orderId);

			// Last, append the type of file being uploaded
			saveData.append('type', vm.type);

			// Show that an upload is in progress
			uploadForm.classList.add(HIDE_CLASS);
			uploadingIndicators.classList.remove(HIDE_CLASS);

			// Upload the images into Dropbox and save all the metadata within our own database
			try
			{
				imgMetadata = await axios.post(UPLOAD_FILE_URL, saveData, false,
				{
					'content-type': 'multipart/form-data'
				}, 15000 * filesToUpload.length);
				imgMetadata = imgMetadata.data;
			}
			catch(error)
			{
				notifier.showSpecializedServerError(FILE_UPLOAD_FAILED);
			}
		},

		loadPictures = () =>
		{
		},

		loadDrawings = () =>
		{
		},

		loadFiles = () =>
		{
		};

	// Initialize the listeners
	fileTypeSelect.addEventListener('change', startUploadProcess);
	fileInput.addEventListener('click', uploadFile);

	if (loadPicturesLink)
	{
		loadPicturesLink.addEventListener('click', loadPictures);
	}
	if (loadDrawingsLink)
	{
		loadDrawingsLink.addEventListener('click', loadDrawings);
	}
	if (loadFilesLink)
	{
		loadFilesLink.addEventListener('click', loadFiles);
	}
}

// ----------------- EXPORT ---------------------------

export default initUploader;