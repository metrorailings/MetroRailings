/**
 * The view model for the powder coating order creation flow
 */

// ----------------- EXTERNAL MODULES --------------------------

import formValidator from 'shared/formValidator';

import rQueryClient from 'client/scripts/utility/rQueryClient';
import scrollDown from 'client/scripts/utility/scrollDown';
import tooltipManager from 'client/scripts/utility/tooltip';

// ----------------- ENUM/CONSTANTS -----------------------------

var WHEELS_CHECKBOX = 'wheelsCheckbox',
	MOTORCYCLE_CHECKBOX = 'motorcycleCheckbox',
	ATV_CHECKBOX = 'atvCheckbox',
	OTHER_METALS_CHECKBOX = 'otherCheckbox',
	TYPE_LABEL = 'powderCoatingType',
	OTHER_METAL_DESCRIPTION_FIELD = 'otherMetalDescription',
	SUBMIT_BUTTON = 'submissionButton',

	OTHER_METAL_SECTION = 'otherMetalSection',
	SUBMISSION_SECTION = 'submissionSection',

	ROLL_DOWN_SECTION_CLASS = 'rollDownSection',

	WHEELS_TYPE = 'wheels',
	MOTORCYCLE_TYPE = 'motorcycle',
	ATV_TYPE = 'atv',
	OTHER_METALS_TYPE = 'other',

	WHEELS_LABEL = 'wheels',
	MOTORCYCLE_LABEL = 'motorcycle components',
	ATV_LABEL = 'atv components',
	OTHER_METALS_LABEL = 'pieces of metal',

	ERROR =
	{
		DESCRIPTION_INVALID: 'We can only tolerate alphabetical characters, numbers, spaces, periods, and periods here.',
	},

	SUBMISSION_INSTRUCTIONS = 'Please put a proper length in the section where we ask you how many feet of railing you need.';

// ----------------- PRIVATE VARIABLES -----------------------------

var _validationSet = new Set(),

	// Elements
	_otherMetalSection = document.getElementById(OTHER_METAL_SECTION),
	_submissionSection = document.getElementById(SUBMISSION_SECTION),

	_typeCheckboxes = [document.getElementById(WHEELS_CHECKBOX), document.getElementById(OTHER_METALS_CHECKBOX)],
	_typeLabel = document.getElementById(TYPE_LABEL),
	_otherMetalDescriptionField = document.getElementById(OTHER_METAL_DESCRIPTION_FIELD),
	_submitButton = document.getElementById(SUBMIT_BUTTON);

// ----------------- PRIVATE FUNCTIONS -----------------------------

/**
 * A function designed to unveil or hide certain sections of the order form depending on the user's input so far
 *
 * @param {Number} progress - an index value indicating the number of sections to reveal on the order form
 *
 * @author kinsho
 */
function _toggleSections(progress)
{
	if (progress >= 2)
	{
		_otherMetalSection.classList.add(ROLL_DOWN_SECTION_CLASS);
	}
	else
	{
		_otherMetalSection.classList.remove(ROLL_DOWN_SECTION_CLASS);
	}

	if (progress >= 5)
	{
		_submissionSection.classList.add(ROLL_DOWN_SECTION_CLASS);
	}
	else
	{
		_submissionSection.classList.remove(ROLL_DOWN_SECTION_CLASS);
	}
}

/**
 * A function designed to switch around certain bits of text on the page depending on what exactly the user
 * needs powder-coated.
 *
 * @author kinsho
 */
function _toggleLabels()
{
	if (viewModel.__orderType === WHEELS_TYPE)
	{
		_typeLabel.innerHTML = WHEELS_LABEL;
	}
	else if (viewModel.__orderType === MOTORCYCLE_TYPE)
	{
		_typeLabel.innerHTML = MOTORCYCLE_LABEL;
	}
	else if (viewModel.__orderType === ATV_TYPE)
	{
		_typeLabel.innerHTML = ATV_LABEL;
	}
	else if (viewModel.__orderType === OTHER_METALS_TYPE)
	{
		_typeLabel.innerHTML = OTHER_METALS_LABEL;
	}
}

/**
 * A function designed to reveal the scroll alert programmatically
 *
 * @author kinsho
 */
function _revealScrollAlert()
{
	var revealedSections = document.getElementsByClassName(ROLL_DOWN_SECTION_CLASS),
		lastSection = revealedSections[revealedSections.length - 1];

	// Set this animation on a timeout to prevent browser lag
	window.setTimeout(() =>
	{
		scrollDown.showAlert(lastSection);
	}, 250);
}

/**
 * A function designed to hide the scroll alert programmatically
 *
 * @author kinsho
 */
function _hideScrollAlert()
{
	// Set this animation on a timeout to prevent browser lag
	window.setTimeout(() =>
	{
		scrollDown.hideAlert();
	}, 250);
}

/**
 * Generic function for invoking the logic that briefly validates this view model
 *
 * @returns {boolean} - indicating whether this view model has been validated
 *
 * @author kinsho
 */
function _validate()
{
	viewModel.isFormSubmissible = rQueryClient.validateModel(viewModel, _validationSet);
}

// ----------------- VIEW MODEL DEFINITION -----------------------------

var viewModel = {};

// Railings Type
Object.defineProperty(viewModel, 'orderType',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__orderType;
	},

	set: (value) =>
	{
		viewModel.__orderType = value;

		// Change some of the text on the page to reflect the user's latest choice
		_toggleLabels();

		// Adjust the type checkboxes on the page accordingly
		if (value === WHEELS_TYPE)
		{
			rQueryClient.setCheckboxSets(_typeCheckboxes, WHEELS_CHECKBOX);

			viewModel.userProgress = 3;
		}
		else if (value === MOTORCYCLE_TYPE)
		{
			rQueryClient.setCheckboxSets(_typeCheckboxes, MOTORCYCLE_CHECKBOX);

			viewModel.userProgress = 3;
		}
		else if (value === ATV_TYPE)
		{
			rQueryClient.setCheckboxSets(_typeCheckboxes, ATV_CHECKBOX);

			viewModel.userProgress = 3;
		}
		else if (value === OTHER_METALS_TYPE)
		{
			rQueryClient.setCheckboxSets(_typeCheckboxes, OTHER_METALS_CHECKBOX);

			// Reset any values that may have been put into the 'Other Metal' textfield
			viewModel.otherTypeDescription = '';

			viewModel.userProgress = 2;
		}
		else
		{
			rQueryClient.setCheckboxSets(_typeCheckboxes);
		}
	}
});

// Explanation of what needs to be powder coated should the user have selected 'Other' under orderType
Object.defineProperty(viewModel, 'otherTypeDescription',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__otherTypeDescription;
	},

	set: (value) =>
	{
		viewModel.__otherTypeDescription = value;

		// Make sure a valid value is put into the field
		rQueryClient.updateValidationOnField(!(formValidator.isAlphabetical(value, ' \'-')), _otherMetalDescriptionField, ERROR.DESCRIPTION_INVALID, _validationSet);
		rQueryClient.setField(_otherMetalDescriptionField, value);
		_validate();

		if (viewModel.__userProgress <= 3)
		{
			// For a better user experience, unveil the next section after a bit of a delay, provided that the value in
			// the description field is still valid
			window.setTimeout(function()
			{
				if (formValidator.isAlphabetical(viewModel.__otherTypeDescription, ' \'-'))
				{
					viewModel.userProgress = 4;
				}
			}, 1000);
		}
	}
});

// The progress the user has made so far in filling out the order
Object.defineProperty(viewModel, 'userProgress',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__userProgress;
	},

	set: (value) =>
	{
		if ((viewModel.__userProgress < value) || (value === 1))
		{
			viewModel.__userProgress = value;

			// Unveil the next section of the order form
			_toggleSections(value);

			// Pull up the scroll alert when new sections are revealed
			if (value !== 1)
			{
				_revealScrollAlert();
			}
		}
	}
});


// Validation Flag
Object.defineProperty(viewModel, 'isFormSubmissible',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__isFormSubmissible;
	},

	set: (value) =>
	{
		viewModel.__isFormSubmissible = value;

		if (!(value))
		{
			// Set up a tooltip indicating why the button is disabled
			tooltipManager.setTooltip(_submitButton, SUBMISSION_INSTRUCTIONS);
		}
		else
		{
			tooltipManager.closeTooltip(_submitButton, true);
		}
	}
});

// ----------------- EXPORT -----------------------------

export default viewModel;