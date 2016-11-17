/**
 * The view model for the order creation process flow
 */

// ----------------- EXTERNAL MODULES --------------------------

import rQuery from 'utility/rQuery';
import rQueryClient from 'client/scripts/utility/rQueryClient';

// ----------------- ENUM/CONSTANTS -----------------------------

var STAIRS_CHECKBOX = 'stairsCheckbox',
	DECK_CHECKBOX = 'deckCheckbox',
	CURVES_YES_RADIO = 'curvesYes',
	CURVES_NO_RADIO = 'curvesNo',
	CURVES_YES_MESSAGE = 'curvesYesMessage',
	ENCLOSURE_HELP_MESSAGE = 'enclosureHelp',
	STAIRS_HELP_MESSAGE = 'stairsHelp',
	RAILINGS_LENGTH_TEXTFIELD = 'railingsLength',
	RAILINGS_LENGTH_CONTAINER = 'railingsLengthInputContainer',
	BARS_CHECKBOX = 'barsCheckbox',
	COLLARS_CHECKBOX = 'collarsCheckbox',
	CUSTOM_STYLING_CHECKBOX = 'customStylingCheckbox',
	SUBMIT_BUTTON = 'orderSubmissionButton',
	SCROLL_DOWN_ALERT = 'scrollDownLabel',

	LENGTH_SECTION = 'lengthSection',
	STYLE_SECTION = 'styleSection',
	CURVES_SECTION = 'curvesSection',
	COLOR_SECTION = 'colorSection',
	SUBMISSION_SECTION = 'submissionSection',

	RAILINGS_TYPE_FILLER_CLASS = 'railingsTypeFillIn',
	ROLL_DOWN_SECTION_CLASS = 'rollDownSection',
	INVALID_FLAG_CLASS = 'invalid',
	REVEAL_CLASS = 'reveal',
	SELECTED_ARROW_CLASS = 'selectedArrow',
	DISABLED_CLASS = 'disabled',

	STAIRS_TYPE = 'stairs',
	DECK_TYPE = 'deck',
	STAIRCASE_KEYWORD = 'staircase',
	ENCLOSURE_KEYWORD = 'enclosure',

	BARS_STYLE = 'bars',
	COLLARS_STYLE = 'collars',
	CUSTOM_STYLE = 'custom',

	LENGTH_ERROR_HINT = "You can only put numbers here.",
	SUBMISSION_BUTTON_LENGTH_ERROR_HINT = 'Please scroll above and put a proper length in the section where we ask you how much feet of railing you need.';

// ----------------- PRIVATE VARIABLES -----------------------------

// Elements
var _curvesSection = document.getElementById(CURVES_SECTION),
	_styleSection = document.getElementById(STYLE_SECTION),
	_lengthSection = document.getElementById(LENGTH_SECTION),
	_colorSection = document.getElementById(COLOR_SECTION),
	_submissionSection = document.getElementById(SUBMISSION_SECTION),
	_typeCheckboxes = [document.getElementById(STAIRS_CHECKBOX), document.getElementById(DECK_CHECKBOX)],
	_curvesYesRadio = document.getElementById(CURVES_YES_RADIO),
	_curvesNoRadio = document.getElementById(CURVES_NO_RADIO),
	_curvesYesMessage = document.getElementById(CURVES_YES_MESSAGE),
	_railingsTypeFillInSpots = document.getElementsByClassName(RAILINGS_TYPE_FILLER_CLASS),
	_enclosureHelpSection = document.getElementById(ENCLOSURE_HELP_MESSAGE),
	_stairsHelpSection = document.getElementById(STAIRS_HELP_MESSAGE),
	_lengthField = document.getElementById(RAILINGS_LENGTH_TEXTFIELD),
	_lengthFieldContainer = document.getElementById(RAILINGS_LENGTH_CONTAINER),
	_styleCheckboxes = [document.getElementById(BARS_CHECKBOX), document.getElementById(COLLARS_CHECKBOX), document.getElementById(CUSTOM_STYLING_CHECKBOX)],
	_selectedArrows = document.getElementsByClassName(SELECTED_ARROW_CLASS),
	_submitButton = document.getElementById(SUBMIT_BUTTON),
	_scrollDownAlert = document.getElementById(SCROLL_DOWN_ALERT);

// ----------------- PRIVATE FUNCTIONS -----------------------------

/**
 * A function to validate the value entered into the length field
 *
 * @author kinsho
 */
function _validateLength()
{
	// Validate the value. If the value is illegitimate, alert the user as to why
	var rawValue = _lengthField.value,
		length = window.parseInt(rawValue, 10);

	if ( !(Number.isNaN(length)) &&
		(rQuery.isStringEntirelyNumeric(rawValue)) &&
		(length > 0) )
	{
		_lengthField.value = length;
		_lengthField.classList.remove(INVALID_FLAG_CLASS);
		_lengthFieldContainer.dataset.hint = '';

		viewModel.isFormSubmissible = true;
	}
	else
	{
		_lengthField.classList.add(INVALID_FLAG_CLASS);
		_lengthFieldContainer.dataset.hint = LENGTH_ERROR_HINT;

		viewModel.isFormSubmissible = false;
	}
}

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
		_curvesSection.classList.add(ROLL_DOWN_SECTION_CLASS);
	}
	else
	{
		_curvesSection.classList.remove(ROLL_DOWN_SECTION_CLASS);
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
		_styleSection.classList.add(ROLL_DOWN_SECTION_CLASS);
	}
	else
	{
		_styleSection.classList.remove(ROLL_DOWN_SECTION_CLASS);
	}

	if (progress >= 5)
	{
		_colorSection.classList.add(ROLL_DOWN_SECTION_CLASS);
		_submissionSection.classList.add(ROLL_DOWN_SECTION_CLASS);
	}
	else
	{
		_colorSection.classList.remove(ROLL_DOWN_SECTION_CLASS);
		_submissionSection.classList.remove(ROLL_DOWN_SECTION_CLASS);
	}
}

/**
 * A function that changes some text and adjust the visibility of certain paragraphs in accordance to the type of railings
 * that a customer needs
 *
 * @author kinsho
 */
function _toggleRailingTypeSpots()
{
	var i;

	for (i = _railingsTypeFillInSpots.length - 1; i >= 0; i--)
	{
		_railingsTypeFillInSpots[i].innerHTML = (viewModel.orderType === STAIRS_TYPE ? STAIRCASE_KEYWORD : ENCLOSURE_KEYWORD);
	}

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
 * A function designed to reveal the scroll alert on a delay in order to prevent browser lag
 *
 * @author kinsho
 */
function _revealScrollAlert()
{
	// Set this animation on a timeout to prevent browser lag
	window.setTimeout(() =>
	{
		_scrollDownAlert.classList.add(REVEAL_CLASS);
	}, 250);
}

/**
 * A function designed to hide the scroll alert on a delay in order to prevent browser lag
 *
 * @author kinsho
 */
function _hideScrollAlert()
{
	// Set this animation on a timeout to prevent browser lag
	window.setTimeout(() =>
	{
		_scrollDownAlert.classList.remove(REVEAL_CLASS);
	}, 250);
}

// ----------------- VIEW MODEL DEFINITION -----------------------------

var viewModel = {};

// Railings Type
Object.defineProperty(viewModel, 'orderType',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return this.__orderType;
	},

	set: (value) =>
	{
		this.__orderType = value;

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

			viewModel.userProgress = 2;
		}
		else
		{
			rQueryClient.setCheckboxSets(_typeCheckboxes);
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
		return this.__orderLength;
	},

	set: (value) =>
	{
		this.__orderLength = value;

		// Empty out the input field when the order length is initialized
		if (value === '')
		{
			_lengthField.value = '';
			return;
		}

		_validateLength();

		if (this.__userProgress <= 3)
		{
			// For a better user experience, unveil the next section after a bit of a delay, provided that the value in
			// the length field is still valid
			window.setTimeout(() =>
			{
				_validateLength();
				if (viewModel.isFormSubmissible)
				{
					viewModel.userProgress = 4;
				}
			}, 1000);
		}
	}
});

// Railings Style
Object.defineProperty(viewModel, 'orderStyle',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return this.__orderStyle;
	},

	set: (value) =>
	{
		this.__orderStyle = value;

		// Adjust the style checkboxes on the page accordingly
		if (value === BARS_STYLE)
		{
			rQueryClient.setCheckboxSets(_styleCheckboxes, BARS_CHECKBOX);

			viewModel.userProgress = 5;
		}
		else if (value === COLLARS_STYLE)
		{
			rQueryClient.setCheckboxSets(_styleCheckboxes, COLLARS_CHECKBOX);

			viewModel.userProgress = 5;
		}
		else if (value === CUSTOM_STYLE)
		{
			rQueryClient.setCheckboxSets(_styleCheckboxes, CUSTOM_STYLING_CHECKBOX);

			viewModel.userProgress = 5;
		}
		else
		{
			rQueryClient.setCheckboxSets(_styleCheckboxes);
		}
	}
});

// Curves Flag
Object.defineProperty(viewModel, 'curvesNecessary',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return this.__curvesNecessary;
	},

	set: (value) =>
	{
		this.__curvesNecessary = value;

		if (value === 'y')
		{
			_toggleSections(2);
			_curvesSection.classList.add(REVEAL_CLASS);
			_curvesYesMessage.classList.add(REVEAL_CLASS);
			_hideScrollAlert();
		}
		else if (value === 'n')
		{
			_curvesSection.classList.remove(REVEAL_CLASS);
			_curvesYesMessage.classList.remove(REVEAL_CLASS);

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
		else
		{
			_curvesYesRadio.checked = false;
			_curvesNoRadio.checked = false;
		}
	}
});

// Railings Color
Object.defineProperty(viewModel, 'orderColor',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return this.__orderColor;
	},

	set: (value) =>
	{
		var i;

		this.__orderColor = value;

		// Mark which color the user selected
		for (i = _selectedArrows.length - 1; i >= 0; i--)
		{
			if (_selectedArrows[i].dataset.color === value)
			{
				_selectedArrows[i].classList.add(REVEAL_CLASS);
			}
			else
			{
				_selectedArrows[i].classList.remove(REVEAL_CLASS);
			}
		}
	}
});

// Validation Flag
Object.defineProperty(viewModel, 'isFormSubmissible',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return this.__isFormSubmissible;
	},

	set: (value) =>
	{
		this.__isFormSubmissible = value;

		if (value)
		{
			_submitButton.classList.remove(DISABLED_CLASS);
			_submitButton.dataset.hint = '';
		}
		else
		{
			_submitButton.classList.add(DISABLED_CLASS);
			_submitButton.dataset.hint = SUBMISSION_BUTTON_LENGTH_ERROR_HINT;
		}
	}
});

// The progress the user has made so far in filling out the order
Object.defineProperty(viewModel, 'userProgress',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return this.__userProgress;
	},

	set: (value) =>
	{
		if ((this.__userProgress < value) || (value === 1))
		{
			this.__userProgress = value;

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