/**
 * The view model for the convention contact page
 */

// ----------------- EXTERNAL MODULES --------------------------

import tooltipManager from 'client/scripts/utility/tooltip';

// ----------------- ENUM/CONSTANTS -----------------------------

var SUBMISSION_BUTTON = 'conventionSubmissionButton',

	DISABLED_CLASS = 'disabled',

	SUBMISSION_INSTRUCTIONS =
	{
		NAME_NEEDED: 'At least give us your name!'
	};

// ----------------- PRIVATE VARIABLES -----------------------------

	// Elements
var _submitButton = document.getElementById(SUBMISSION_BUTTON);

// ----------------- VIEW MODEL DEFINITION -----------------------------

var viewModel = {};

// Customer's name
Object.defineProperty(viewModel, 'name',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__name;
	},

	set: (value) =>
	{
		// Ensure that the value does not simply consist of spaces
		value = (value.trim() ? value : '');
		viewModel.__name = value;

		// Enable the submission button should a legitimate name be provided
		if (value)
		{
			_submitButton.classList.remove(DISABLED_CLASS);

			tooltipManager.closeTooltip(_submitButton, true);
		}
		else
		{
			_submitButton.classList.add(DISABLED_CLASS);

			// Set up a tooltip indicating why the button is disabled
			tooltipManager.setTooltip(_submitButton, SUBMISSION_INSTRUCTIONS.NAME_NEEDED);
		}
	}
});

// Customer's e-mail address
Object.defineProperty(viewModel, 'email',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__email;
	},

	set: (value) =>
	{
		viewModel.__email = value;
	}
});

// Customer's area code
Object.defineProperty(viewModel, 'areaCode',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__areaCode;
	},

	set: (value) =>
	{
		viewModel.__areaCode = value;
	}
});

// Customer's phone number (first three digits)
Object.defineProperty(viewModel, 'phoneOne',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__phoneOne;
	},

	set: (value) =>
	{
		viewModel.__phoneOne = value;
	}
});

// Customer's phone number (last four digits)
Object.defineProperty(viewModel, 'phoneTwo',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__phoneTwo;
	},

	set: (value) =>
	{
		viewModel.__phoneTwo = value;
	}
});

// Company
Object.defineProperty(viewModel, 'company',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__company;
	},

	set: (value) =>
	{
		viewModel.__company = value;
	}
});

// Role in Company
Object.defineProperty(viewModel, 'companyRole',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__companyRole;
	},

	set: (value) =>
	{
		viewModel.__companyRole = value;
	}
});

// Interests
Object.defineProperty(viewModel, 'interests',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__interests;
	},

	set: (value) =>
	{
		// If the interests set already contains the passed value, then remove the value from the set
		if (viewModel.__interests.has(value))
		{
			viewModel.__interests.delete(value);
		}
		else
		{
			viewModel.__interests.add(value);
		}
	}
});

// Initialize the view model
viewModel.name = '';
viewModel.email = '';
viewModel.areaCode = '';
viewModel.phoneOne = '';
viewModel.phoneTwo = '';
viewModel.company = '';
viewModel.companyRole = '';
viewModel.__interests = new Set();

// ----------------- EXPORT -----------------------------

export default viewModel;