/**
 * The view model for the first step of the order creation process flow
 */

// ----------------- EXTERNAL MODULES --------------------------

import formValidator from 'shared/formValidator';

import rQueryClient from 'client/scripts/utility/rQueryClient';
import scrollDown from 'client/scripts/utility/scrollDown';
import tooltipManager from 'client/scripts/utility/tooltip';

// ----------------- ENUM/CONSTANTS -----------------------------

var STAIRS_CHECKBOX = 'stairsCheckbox',
	DECK_CHECKBOX = 'deckCheckbox',
	CURVES_YES_RADIO = 'curvesYes',
	CURVES_NO_RADIO = 'curvesNo',
	BIG_ORDER_YES_RADIO = 'bigOrderYes',
	BIG_ORDER_NO_RADIO = 'bigOrderNo',
	CURVES_YES_MESSAGE = 'curvesYesMessage',
	BIG_ORDER_YES_MESSAGE = 'bigOrderYesMessage',
	ENCLOSURE_HELP_MESSAGE = 'enclosureHelp',
	STAIRS_HELP_MESSAGE = 'stairsHelp',
	RAILINGS_LENGTH_TEXTFIELD = 'railingsLength',
	SUBMIT_BUTTON = 'submissionButton',

	CUSTOM_SECTION = 'customOrderRequiredSection',
	LENGTH_SECTION = 'lengthSection',
	SUBMISSION_SECTION = 'submissionSection',

	ROLL_DOWN_SECTION_CLASS = 'rollDownSection',
	REVEAL_CLASS = 'reveal',

	STAIRS_TYPE = 'stairs',
	DECK_TYPE = 'deck',

	ERROR =
	{
		LENGTH_INVALID: 'Please enter a non-zero length here.'
	},

	SUBMISSION_INSTRUCTIONS = 'Please put a proper length in the section where we ask you how many feet of railing you need.';

// ----------------- PRIVATE VARIABLES -----------------------------

var _validationSet = new Set(),

	// Elements
	_customSection = document.getElementById(CUSTOM_SECTION),
	_lengthSection = document.getElementById(LENGTH_SECTION),
	_submissionSection = document.getElementById(SUBMISSION_SECTION),

	_typeCheckboxes = [document.getElementById(STAIRS_CHECKBOX), document.getElementById(DECK_CHECKBOX)],
	_curvesYesRadio = document.getElementById(CURVES_YES_RADIO),
	_curvesNoRadio = document.getElementById(CURVES_NO_RADIO),
	_bigOrderYesRadio = document.getElementById(BIG_ORDER_YES_RADIO),
	_bigOrderNoRadio = document.getElementById(BIG_ORDER_NO_RADIO),
	_curvesYesMessage = document.getElementById(CURVES_YES_MESSAGE),
	_bigOrderYesMessage = document.getElementById(BIG_ORDER_YES_MESSAGE),
	_enclosureHelpSection = document.getElementById(ENCLOSURE_HELP_MESSAGE),
	_stairsHelpSection = document.getElementById(STAIRS_HELP_MESSAGE),
	_lengthField = document.getElementById(RAILINGS_LENGTH_TEXTFIELD),
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
		_customSection.classList.add(ROLL_DOWN_SECTION_CLASS);
	}
	else
	{
		_customSection.classList.remove(ROLL_DOWN_SECTION_CLASS);
	}

	if (progress >= 3)
	{
		_lengthSection.classList.add(ROLL_DOWN_SECTION_CLASS);
	}
	else
	{
		_lengthSection.classList.remove(ROLL_DOWN_SECTION_CLASS);
	}

	if (progress >= 4)
	{
		_submissionSection.classList.add(ROLL_DOWN_SECTION_CLASS);
	}
	else
	{
		_submissionSection.classList.remove(ROLL_DOWN_SECTION_CLASS);
	}
}

/**
 * A function that changes some text and adjust the visibility of certain paragraphs in accordance to the
 * type of railings that a customer needs
 *
 * @author kinsho
 */
function _toggleRailingTypeSpots()
{
	if (viewModel.orderType === STAIRS_TYPE)
	{
		_enclosureHelpSection.classList.remove(REVEAL_CLASS);
		_stairsHelpSection.classList.add(REVEAL_CLASS);
	}
	else if (viewModel.orderType === DECK_TYPE)
	{
		_enclosureHelpSection.classList.add(REVEAL_CLASS);
		_stairsHelpSection.classList.remove(REVEAL_CLASS);
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

		// Adjust the type checkboxes on the page accordingly
		if (value === STAIRS_TYPE)
		{
			rQueryClient.setCheckboxSets(_typeCheckboxes, STAIRS_CHECKBOX);
			_toggleRailingTypeSpots();

			viewModel.userProgress = 2;
		}
		else if (value === DECK_TYPE)
		{
			rQueryClient.setCheckboxSets(_typeCheckboxes, DECK_CHECKBOX);
			_toggleRailingTypeSpots();

			// If the user is already in the midst of selecting designs, reset the designs they have selected so far
			// and display text alerting the users to select designs again
			if (viewModel.userProgress > 100)
			{
				viewModel.postDesign = '';
				viewModel.postEndDesign = '';
				viewModel.postCapDesign = '';
				viewModel.centerDesign = '';

				_toggleSections(4);
			}
			else
			{
				viewModel.userProgress = 2;
			}
		}
		else
		{
			rQueryClient.setCheckboxSets(_typeCheckboxes);
		}
	}
});

// Curves Flag
Object.defineProperty(viewModel, 'curvesNecessary',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__curvesNecessary;
	},

	set: (value) =>
	{
		viewModel.__curvesNecessary = value;

		if (value === 'y')
		{
			_curvesYesMessage.classList.add(REVEAL_CLASS);

			_toggleSections(2);
			_hideScrollAlert();
		}
		else if (value === 'n')
		{
			_curvesYesMessage.classList.remove(REVEAL_CLASS);
		}
		else
		{
			_curvesYesRadio.checked = false;
			_curvesNoRadio.checked = false;
		}

		// As long as all the questions have been answered no, show the next question then
		if (value === 'n' && viewModel.__bigOrder === 'n')
		{
			if (viewModel.userProgress === 2)
			{
				viewModel.userProgress = 3;
			}
			else
			{
				_toggleSections(viewModel.userProgress);
				_revealScrollAlert();
			}
		}
	}
});

// Big Order Flag
Object.defineProperty(viewModel, 'bigOrder',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__bigOrder;
	},

	set: (value) =>
	{
		viewModel.__bigOrder = value;

		if (value === 'y')
		{
			_bigOrderYesMessage.classList.add(REVEAL_CLASS);

			_toggleSections(2);
			_hideScrollAlert();
		}
		else if (value === 'n')
		{
			_bigOrderYesMessage.classList.remove(REVEAL_CLASS);
		}
		else
		{
			_bigOrderYesRadio.checked = false;
			_bigOrderNoRadio.checked = false;
		}

		// As long as all the questions have been answered no, show the next question then
		if (value === 'n' && viewModel.__curvesNecessary === 'n')
		{
			if (viewModel.userProgress === 2)
			{
				viewModel.userProgress = 3;
			}
			else
			{
				_toggleSections(viewModel.userProgress);
				_revealScrollAlert();
			}
		}
	}
});

// Railings Length
Object.defineProperty(viewModel, 'orderLength',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__orderLength;
	},

	set: (value) =>
	{
		viewModel.__orderLength = value;

		// Make sure a valid length is put into the field
		var isInvalid = ( !(formValidator.isNumeric(value)) ||
						( value.length && !(window.parseInt(value, 10)) ) );

		rQueryClient.updateValidationOnField(isInvalid, _lengthField, ERROR.LENGTH_INVALID, _validationSet);
		rQueryClient.setField(_lengthField, value);
		_validate();

		if (viewModel.__userProgress <= 3)
		{
			// For a better user experience, unveil the next section after a bit of a delay, provided that the value in
			// the length field is still valid
			window.setTimeout(() =>
			{
				if (window.parseInt(value, 10))
				{
					viewModel.userProgress = 4;
				}
			}, 1000);
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
		// A three-digit progress value signifies that the user is currently in the midst of selecting rail designs
		if ((viewModel.__userProgress < value) || (value === 1) || (value >= 100))
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

// ----------------- EXPORT -----------------------------

export default viewModel;