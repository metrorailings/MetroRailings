/**
 * The view model for the shop schedule page
 */

// ----------------- ENUMS/CONSTANTS ---------------------------

const STATUS_FIELDS = 'statusIcon',

	SELECTED_CLASS = 'selected';

// ----------------- PRIVATE VARIABLES ---------------------------

let _statusFields = document.getElementsByClassName(STATUS_FIELDS);

// ----------------- CONSTRUCTOR --------------------------

let viewModel = {};

// New status to log into the system
Object.defineProperty(viewModel, 'newStatus',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__status;
	},

	set: (value) =>
	{
		viewModel.__status = value;

		// Highlight the option that was selected
		for (let i = 0; i < _statusFields.length; i += 1)
		{
			if (_statusFields[i].dataset.status === value)
			{
				_statusFields[i].getElementsByTagName('img')[0].classList.add(SELECTED_CLASS);
			}
			else
			{
				_statusFields[i].getElementsByTagName('img')[0].classList.remove(SELECTED_CLASS);
			}
		}
	}
});

// Status currently in effect when the status modal is opened
Object.defineProperty(viewModel, 'oldStatus',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__oldStatus;
	},

	set: (value) =>
	{
		viewModel.__oldStatus = value;
	}
});

// ----------------- EXPORT -----------------------------

export default viewModel;