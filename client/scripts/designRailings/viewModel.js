/**
 * The view model for the order creation process flow
 */

// ----------------- EXTERNAL MODULES --------------------------

import scrollDown from 'client/scripts/utility/scrollDown';

import restrictions from 'client/scripts/designRailings/restrictions';

// ----------------- ENUM/CONSTANTS -----------------------------

var	POST_SECTION = 'postSection',
	POST_END_SECTION = 'postEndSection',
	POST_CAP_SECTION = 'postCapSection',
	CENTER_DESIGN_SECTION = 'centerDesignSection',
	COLOR_SECTION = 'colorSection',
	SUBMISSION_SECTION = 'submissionSection',

	ROLL_DOWN_SECTION_CLASS = 'rollDownSection',
	REVEAL_CLASS = 'reveal',
	DESIGN_SECTION_CLASS = 'designSection',
	DESIGN_CAROUSEL_CLASS = 'designCarousel',
	SELECTED_ARROW_CLASS = 'selectedArrow',
	OPTION_SELECTED_CLASS = 'optionSelected',

	RESET_CAROUSEL_LISTENER = 'resetCarousel';

// ----------------- PRIVATE VARIABLES -----------------------------

	// Elements
var _postSection = document.getElementById(POST_SECTION),
	_postEndSection = document.getElementById(POST_END_SECTION),
	_postCapSection = document.getElementById(POST_CAP_SECTION),
	_centerDesignSection = document.getElementById(CENTER_DESIGN_SECTION),
	_colorSection = document.getElementById(COLOR_SECTION),
	_submissionSection = document.getElementById(SUBMISSION_SECTION),

	_designSections = document.getElementsByClassName(DESIGN_SECTION_CLASS),
	_colorSelectionArrows = document.getElementsByClassName(SELECTED_ARROW_CLASS);

// ----------------- PRIVATE FUNCTIONS -----------------------------

/**
 * A function designed to unveil or hide certain sections of the order form depending on the user's input so far
 *
 * @author kinsho
 */
function _revealNextSection()
{
	var restrictionsData,
		restriction,
		propertiesToExamine,
		examinationResult,
		doShow, // Flag ensuring that a section should not be revealed if restrictions mandate the section not be shown
		i, j;

	for (i = 0; i < _designSections.length; i++)
	{
		doShow = true;
		restrictionsData = restrictions.sections[_designSections[i].id].restrictions;

		// Should restrictions be found, go over each restriction to determine whether to show this section
		if (restrictionsData)
		{
			propertiesToExamine = Object.keys(restrictionsData);

			// Loop over each restriction and test properties within the view model
			for (j = 0; j < propertiesToExamine.length; j++)
			{
				restriction = restrictionsData[propertiesToExamine[j]];
				examinationResult = restriction[ viewModel[propertiesToExamine[j]] ];

				if (!(examinationResult))
				{
					doShow = false;
					break;
				}
			}
		}

		if (doShow)
		{
			if (_designSections[i].classList.contains(ROLL_DOWN_SECTION_CLASS))
			{
				if (_designSections[i].classList.contains(OPTION_SELECTED_CLASS))
				{
					continue;
				}
				// Exit this logic should an option not yet be selected for the section currently in context
				else
				{
					break;
				}
			}
			else
			{
				// Reset the section prior to its reveal
				_resetDesignCarousel(i);

				_designSections[i].classList.add(ROLL_DOWN_SECTION_CLASS);

				// Show the scrolling label to alert the user to go to the next section to be completed
				_scrollDown();

				// Hide all sections below this one, as the user needs to complete these sections in sequential order
				_hideSections(_designSections[i].id);

				break;
			}
		}
		else
		{
			_designSections[i].classList.remove(ROLL_DOWN_SECTION_CLASS);
		}
	}

	// If we have cycled through all the design-oriented sections, show the last remaining sections and shuffle off
	if (i === _designSections.length)
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
 * A function designed to reset the carousel back to its initial state
 *
 * @param {Number} index - the index of the section that houses the carousel that needs to be reset
 *
 * @author kinsho
 */
function _resetDesignCarousel(index)
{
	// Ensure that setter logic is avoided here
	viewModel[_designSections[index].dataset.vmProp] = '';

	// Reset the carousel now that it is to be hidden
	// Set up a timeout here to reset the carousel after it is rolled up from view
	window.setTimeout(() =>
	{
		_designSections[index].querySelector('.' + DESIGN_CAROUSEL_CLASS).dispatchEvent(new Event(RESET_CAROUSEL_LISTENER));
	}, 300);
}

/**
 * A function designed to hide all sections that come after the section indicated by the passed ID
 *
 * @param {String} sectionID - the ID of the section from which we will begin hiding sections
 *
 * @author kinsho
 */
function _hideSections(sectionID)
{
	var enterHidingPhase = false;

	for (var i = 0; i < _designSections.length; i++)
	{
		if (enterHidingPhase)
		{
			_designSections[i].classList.remove(ROLL_DOWN_SECTION_CLASS);
		}

		if (_designSections[i].id === sectionID)
		{
			enterHidingPhase = true;
		}
	}
}

/**
 * A function designed to scroll down to the next section to be completed
 *
 * @author kinsho
 */
function _scrollDown()
{
	var revealedSections = document.getElementsByClassName(ROLL_DOWN_SECTION_CLASS),
		nextSection = revealedSections[revealedSections.length - 1];

	// Set this animation on a timeout to prevent browser lag
	window.setTimeout(() =>
	{
		scrollDown.showAlert(nextSection);
	}, 250);
}

// ----------------- VIEW MODEL DEFINITION -----------------------------

var viewModel = {};

// Railings Type
Object.defineProperty(viewModel, 'railingType',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__railingType;
	},

	set: (value) =>
	{
		viewModel.__railingType = value;
	}
});

// Post Design
Object.defineProperty(viewModel, 'postDesign',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__postDesign;
	},

	set: (value) =>
	{
		viewModel.__postDesign = value;

		if (value)
		{
			_postSection.classList.add(OPTION_SELECTED_CLASS);
			_revealNextSection();
		}
		else
		{
			_postSection.classList.remove(OPTION_SELECTED_CLASS);
			_hideSections(POST_SECTION);
		}
	}
});

// Post End Design
Object.defineProperty(viewModel, 'postEndDesign',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__postEndDesign;
	},

	set: (value) =>
	{
		viewModel.__postEndDesign = value;

		if (value)
		{
			_postEndSection.classList.add(OPTION_SELECTED_CLASS);
			_revealNextSection();
		}
		else
		{
			_postEndSection.classList.remove(OPTION_SELECTED_CLASS);
			_hideSections(POST_END_SECTION);
		}
	}
});

// Post Cap Design
Object.defineProperty(viewModel, 'postCapDesign',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__postCapDesign;
	},

	set: (value) =>
	{
		viewModel.__postCapDesign = value;

		if (value)
		{
			_postCapSection.classList.add(OPTION_SELECTED_CLASS);
			_revealNextSection();
		}
		else
		{
			_postCapSection.classList.remove(OPTION_SELECTED_CLASS);
			_hideSections(POST_CAP_SECTION);
		}
	}
});

// Center Design
Object.defineProperty(viewModel, 'centerDesign',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__centerDesign;
	},

	set: (value) =>
	{
		viewModel.__centerDesign = value;

		if (value)
		{
			_centerDesignSection.classList.add(OPTION_SELECTED_CLASS);
			_revealNextSection();
		}
		else
		{
			_centerDesignSection.classList.remove(OPTION_SELECTED_CLASS);
			_hideSections(CENTER_DESIGN_SECTION);
		}
	}
});

// Railings Color
Object.defineProperty(viewModel, 'orderColor',
{
	configurable: false,
	enumerable: false,

	get: () =>
	{
		return viewModel.__orderColor;
	},

	set: (value) =>
	{
		var i;

		viewModel.__orderColor = value;

		// Mark which color the user selected
		for (i = _colorSelectionArrows.length - 1; i >= 0; i--)
		{
			if (_colorSelectionArrows[i].dataset.color === value)
			{
				_colorSelectionArrows[i].classList.add(REVEAL_CLASS);
			}
			else
			{
				_colorSelectionArrows[i].classList.remove(REVEAL_CLASS);
			}
		}
	}
});

// ----------------- EXPORT -----------------------------

export default viewModel;