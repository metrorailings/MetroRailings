/**
 * @main uploadFile
 */

// ----------------- EXTERNAL MODULES --------------------------

import axios from 'client/scripts/utility/axios';
import handlebarHelpers from 'client/scripts/utility/handlebarHelpers';
import gallery from 'client/scripts/utility/gallery';
import confirmationModal from 'client/scripts/utility/confirmationModal';

import viewModel from 'client/scripts/uploadFile/viewModel';
import notifier from 'client/scripts/utility/notifications';

// ----------------- ENUMS/CONSTANTS --------------------------

const UPLOAD_FILE_SECTION = 'fileUploadSection',
	UPLOAD_FORM = 'fileUploadForm',
	UPLOAD_FILE_SELECT = 'uploadFileType',
	UPLOAD_FILE_INPUT = 'uploadFileInput',
	UPLOADING_INDICATORS = 'fileUploadingIndicators',

	PICTURES_LISTING = 'picturesContainer',
	DRAWINGS_LISTING = 'drawingsContainer',
	FILES_LISTING = 'filesContainer',

	LOAD_PICTURES_LINK = 'loadPicturesLink',
	LOAD_DRAWINGS_LINK = 'loadDrawingsLink',
	LOAD_FILES_LINK = 'loadFilesLink',
	DOWNLOAD_LINK = 'downloadLink',

	THUMBNAIL_CONTAINER = 'thumbnailContainer',
	DELETE_ICON = 'deleteImage',
	THUMBNAIL_TEMPLATE = 'thumbnailTemplate',

	HIDE_CLASS = 'hide',

	UPLOAD_FILE_URL = 'fileUpload/saveFile',
	DELETE_FILE_URL = 'fileUpload/deleteFile',
	LOAD_PICTURES_URL = 'fileUpload/loadPictures',
	LOAD_DRAWINGS_URL = 'fileUpload/loadDrawings',
	LOAD_FILES_URL = 'fileUpload/loadFiles',

	DELETE_FILE_MESSAGE = 'Are you sure you want to delete this file? Once you delete this file, it will be gone' +
		' for good.',
	FILE_DISPLAY_HTML = '<img src=\'::imageSrc\' alt="Order Images" />',
	THUMBNAIL_TITLE_BAR = '<span class=\'thumbnailTitleBar-modal\'>::imageTitle</span>',
	FILE_SOURCE_PLACEHOLDER = '::imageSrc',
	THUMBNAIL_TITLE_PLACEHOLDER = '::imageTitle',
	FILE_UPLOAD_FAILED = 'Your file upload failed. If it\'s an unusual file, that may be why the upload is failing.' +
		' Consult Rickin for assistance.',
	FILE_DOWNLOAD_FAILED = 'The file cannot be downloaded. The server\'s acting up...contact Rickin for assistance.',

	FILETYPES =
	{
		IMAGE : 'picture',
		DRAWING : 'drawing',
		FILE : 'file'
	};


// ----------------- HANDLEBAR TEMPLATES --------------------------

/**
 * The partial to load thumbnails into view
 */
const thumbnailTemplate = Handlebars.compile(document.getElementById(THUMBNAIL_TEMPLATE).innerHTML);

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
		uploadForm = filesContainer.getElementsByClassName(UPLOAD_FORM)[0],
		fileTypeSelect = filesContainer.getElementsByClassName(UPLOAD_FILE_SELECT)[0],
		fileInput = filesContainer.getElementsByClassName(UPLOAD_FILE_INPUT)[0],
		uploadingIndicators = filesContainer.getElementsByClassName(UPLOADING_INDICATORS)[0],
		picturesListing = filesContainer.getElementsByClassName(PICTURES_LISTING)[0],
		drawingsListing = filesContainer.getElementsByClassName(DRAWINGS_LISTING)[0],
		fileListing = filesContainer.getElementsByClassName(FILES_LISTING)[0],
		loadPicturesLink = filesContainer.getElementsByClassName(LOAD_PICTURES_LINK)[0],
		loadDrawingsLink = filesContainer.getElementsByClassName(LOAD_DRAWINGS_LINK)[0],
		loadFilesLink = filesContainer.getElementsByClassName(LOAD_FILES_LINK)[0],
		thumbnails = filesContainer.getElementsByTagName('img'),
		fileDownloadLink = filesContainer.getElementsByClassName(DOWNLOAD_LINK)[0],

		// If the section to upload files is not present, the user is not allowed to upload files
		areChangesAllowed = !!(uploadForm),

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
				imgMetadata, sectionHostingNewFiles;

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

				// Add the thumbnails for the new files to the section where they belong
				for (let i = 0; i < imgMetadata.length; i += 1)
				{
					if (vm.type === FILETYPES.IMAGE)
					{
						sectionHostingNewFiles = picturesListing;
						picturesListing.classList.remove(HIDE_CLASS);
					}
					else if (vm.type === FILETYPES.DRAWING)
					{
						sectionHostingNewFiles = drawingsListing;
						drawingsListing.classList.remove(HIDE_CLASS);
					}
					else
					{
						sectionHostingNewFiles = fileListing;
						fileListing.classList.remove(HIDE_CLASS);
					}

					createThumbnail(imgMetadata[i], sectionHostingNewFiles);
				}
			}
			catch(error)
			{
				notifier.showSpecializedServerError(FILE_UPLOAD_FAILED);
			}
			finally
			{
				uploadForm.classList.remove(HIDE_CLASS);
				uploadingIndicators.classList.add(HIDE_CLASS);
			}
		},

		viewImage = (event) =>
		{
			let target = event.currentTarget,
				files = filesContainer.getElementsByTagName('img'),
				indexToStart = -1, imageIndex = -1,
				imageURLs = [];

			for (let i = 0; i < files.length; i += 1)
			{
				// Only add a file to the gallery if it's an image (and not a PDF)
				if (files[i].dataset.isImage)
				{
					imageURLs.push(files[i].dataset.fullSrc);
					imageIndex += 1;

					// Mark the index at which the image that was clicked upon resides in the gallery list
					if (target.dataset.fullSrc === files[i].dataset.fullSrc)
					{
						indexToStart = imageIndex;
					}
				}
			}

			// Open up the gallery with the images that need to be shown
			gallery.open(imageURLs, indexToStart);
		},

		downloadFile = async function(event)
		{
			let target = event.currentTarget;

			// Download the file from Dropbox
			try
			{
				fileDownloadLink.download = target.dataset.shortname;
				fileDownloadLink.href = target.dataset.fullSrc;
				fileDownloadLink.click();
			}
			catch(error)
			{
				notifier.showSpecializedServerError(FILE_DOWNLOAD_FAILED);
			}
		},

		deleteFile = (event) =>
		{
			let target = event.currentTarget.previousElementSibling,
				imgSrc = FILE_DISPLAY_HTML.replace(FILE_SOURCE_PLACEHOLDER, target.src),
				imgTitle = target.dataset.isImage ? '' : THUMBNAIL_TITLE_BAR.replace(THUMBNAIL_TITLE_PLACEHOLDER, target.dataset.shortname),
				name = target.dataset.name;

			// Show that modal to confirm that the user does want to delete this picture
			confirmationModal.open(['<span>' + DELETE_FILE_MESSAGE + '</span>' + imgSrc + imgTitle], () => { deleteFileConfirmed(name, target); }, () => {});
		},

		deleteFileConfirmed = async function(name, imgElement)
		{
			// Call the server to delete the image from two different sources
			await axios.post(DELETE_FILE_URL, { id : vm.orderId, filename : name }, true);

			// Remove the corresponding thumbnail and its associate icons from view
			imgElement.parentElement.remove();
		},

		loadPictures = async function()
		{
			try
			{
				let pictures = await axios.post(LOAD_PICTURES_URL, { id : loadPicturesLink.dataset.orderId }, true),
					existingImgs = picturesListing.getElementsByClassName(THUMBNAIL_CONTAINER);

				// First clear out all the thumbnails in the container
				for (let j = 0; j < existingImgs.length; j += 1)
				{
					existingImgs[j].remove();
				}

				// Then populate the container anew with new pictures
				pictures = pictures.data;
				for (let i = 0; i < pictures.length; i += 1)
				{
					createThumbnail(pictures[i], picturesListing);
				}

				// Don't forget to remove the link as well
				loadPicturesLink.remove();
			}
			catch(error)
			{
				notifier.showGenericServerError();
			}
		},

		loadDrawings = async function()
		{
			try
			{
				let drawings = await axios.post(LOAD_DRAWINGS_URL, { id : loadDrawingsLink.dataset.orderId }, true),
					existingImgs = drawingsListing.getElementsByClassName(THUMBNAIL_CONTAINER);

				// First clear out all the thumbnails in the container
				for (let j = 0; j < existingImgs.length; j += 1)
				{
					existingImgs[j].remove();
				}

				// Then populate the container anew with new files
				drawings = drawings.data;
				for (let i = 0; i < drawings.length; i += 1)
				{
					createThumbnail(drawings[i], drawingsListing);
				}

				// Don't forget to remove the link as well
				loadDrawingsLink.remove();
			}
			catch(error)
			{
				notifier.showGenericServerError();
			}
		},

		loadFiles = async function()
		{
			try
			{
				let files = await axios.post(LOAD_FILES_URL, { id : loadFilesLink.dataset.orderId }, true),
					existingImgs = fileListing.getElementsByClassName(THUMBNAIL_CONTAINER);

				// First clear out all the thumbnails in the container
				for (let j = 0; j < existingImgs.length; j += 1)
				{
					existingImgs[j].remove();
				}

				// Then populate the container anew with new files
				files = files.data;
				for (let i = 0; i < files.length; i += 1)
				{
					createThumbnail(files[i], fileListing);
				}

				// Don't forget to remove the link as well
				loadFilesLink.remove();
			}
			catch(error)
			{
				notifier.showGenericServerError();
			}
		},

		/**
		 * Function responsible for loading a new thumbnail into view inside whatever section it belongs to
		 *
		 * @param {Object} file - the file that will be represented by the thumbnail
		 * @param {HTMLElement} fileContainer - the thumbnail listing in which to include the new thumbnail
		 *
		 * @author kinsho
		 */
		createThumbnail = (file, fileContainer) =>
		{
			let newHTML = document.createElement('template'),
				container, newImg, deleteIcon;

			newHTML.innerHTML = thumbnailTemplate(
			{
				shareLink : file.shareLink,
				thumbnail : file.thumbnail,
				name : file.name,
				isImage : file.isImage,
				shortname : file.shortname,
				showDeleteIcon: areChangesAllowed // If changes are not allowed, then hide the delete icon
			});
			container = fileContainer.appendChild(newHTML.content.children[0]);
			newImg = container.getElementsByTagName('img')[0];
			deleteIcon = container.getElementsByClassName(DELETE_ICON)[0];

			// Attach listeners to this thumbnail, depending on the type of file
			if (newImg.dataset.isImage)
			{
				newImg.addEventListener('click', viewImage);
			}
			else
			{
				newImg.addEventListener('click', downloadFile);
			}

			// Attach a listener to the icon that would allow us to delete the file, if needed
			if (deleteIcon)
			{
				deleteIcon.addEventListener('click', deleteFile);
			}
		};

	// Initialize the listeners, but keep in mind that some listeners cannot be properly set if the user is not
	// allowed to upload or delete files...
	if (areChangesAllowed)
	{
		fileTypeSelect.addEventListener('change', startUploadProcess);
		fileInput.addEventListener('change', uploadFile);
	}

	// Set up all thumbnails with the appropriate listeners
	for (let i = 0; i < thumbnails.length; i += 1)
	{
		if (thumbnails[i].dataset.isImage)
		{
			thumbnails[i].addEventListener('click', viewImage);
		}
		else
		{
			thumbnails[i].addEventListener('click', downloadFile);
		}

		// Attach the listener to delete the files, if needed and if the user is allowed to delete files
		if (areChangesAllowed)
		{
			thumbnails[i].nextElementSibling.addEventListener('click', deleteFile);
		}
	}

	// If any loader links are present, attach click listeners to them
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