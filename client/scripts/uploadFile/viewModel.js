/**
 * The view model for a new file being uploaded to an order
 */

// ----------------- EXTERNAL MODULES --------------------------

import rQuery from 'client/scripts/utility/rQueryClient';

// ----------------- ENUMS/CONSTANTS --------------------------

const UPLOAD_FILE_SECTION = 'fileUploadSection',
	UPLOAD_FILE_SELECT = 'uploadFileType';

// ----------------- CONSTRUCTOR --------------------------

/**
 * The construction function
 *
 * @param {HTMLElement} uploadSection - the container wrapping the section where a user can upload/view files
 *
 * @author kinsho
 */
function generateViewModel(uploadSection)
{
	let viewModel = {},
		fileUploadSection = uploadSection.getElementsByClassName(UPLOAD_FILE_SECTION)[0],
		fileTypeSelect = uploadSection.getElementsByClassName(UPLOAD_FILE_SELECT)[0];

	// Order ID
	Object.defineProperty(viewModel, 'orderId',
	{
		configurable: true,
		enumerable: true,

		get: () =>
		{
			return viewModel.__orderId;
		},

		set: (value) =>
		{
			viewModel.__orderId = value;
		}
	});

	// Type
	Object.defineProperty(viewModel, 'type',
	{
		configurable: true,
		enumerable: true,

		get: () =>
		{
			return viewModel.__type;
		},

		set: (value) =>
		{
			viewModel.__type = value;

			rQuery.setField(fileTypeSelect, '');
		}
	});

	// Set values into this view model depending on the values that are present in the HTML
	viewModel.orderId = fileUploadSection.dataset.orderId;

	return viewModel;
}

// ----------------- EXPORT -----------------------------

export default generateViewModel;