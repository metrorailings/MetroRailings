// ----------------- EXTERNAL MODULES --------------------------

import slider from 'client/scripts/designRailings/sectionSlider';

import categories from 'shared/designs/categoryClassifications';

// ----------------- ENUMS/CONSTANTS ---------------------------

var SELECTED_OPTIONS_TEMPLATE = 'selectionsTemplate',
	SELECTED_OPTIONS_CONTAINER = 'selectedOptionsContainer',

	OPTION_CLASS = 'selectedOption',
	HIGHLIGHTED_OPTION_CLASS = 'highlight',
	ACTIVE_CLASS = 'activeSection',

	FINISH_SECTION_TRANSITION_LISTENER = 'finishSectionTransition';

// ----------------- HANDLEBAR TEMPLATES ---------------------------

/**
 * The partial that will be used to render/update the list of selected options
 */
var selectionsTemplate = Handlebars.compile(document.getElementById(SELECTED_OPTIONS_TEMPLATE).innerHTML);

// ----------------- PRIVATE MEMBERS ---------------------------

var _selections = [], // The object we will be using to log metadata about all selections

	_selectedOptionsContainer = document.getElementById(SELECTED_OPTIONS_CONTAINER);

// ----------------- PRIVATE MEMBERS ---------------------------

/**
 * Function responsible for attaching listeners to all listed options so far
 *
 * @author kinsho
 */
function _attachListeners()
{
	var optionElements = _selectedOptionsContainer.getElementsByClassName(OPTION_CLASS);

	for (let i = optionElements.length - 1; i >= 0; i--)
	{
		optionElements[i].addEventListener('click', navigateToSection);
	}
}

// ----------------- LISTENERS ---------------------------

/**
 * Function responsible for showing another section
 *
 * @param {Event} event - the event object associated with the firing of this listener
 *
 * @author kinsho
 */
function navigateToSection(event)
{
	var optionElement = event.target.parentNode,
		newOptionIndex = window.parseInt(optionElement.dataset.index, 10),
		newOptionElement = document.getElementById(optionElement.dataset.associatedSection),
		currentOptionElement = _selectedOptionsContainer.getElementsByClassName(HIGHLIGHTED_OPTION_CLASS)[0],
		oldOptionIndex = (currentOptionElement ? currentOptionElement.dataset.index : newOptionIndex + 1);

	// If the new selection is the current selection, we don't need to do any navigation
	if (optionElement.classList.contains(HIGHLIGHTED_OPTION_CLASS))
	{
		return;
	}

	// Start the logic that needs to be invoked to travel to a different section
	slider.followingSection = newOptionElement;
	slider.slideSections(newOptionIndex, oldOptionIndex);

	// After initiating a section change, set a marker to indicate that which slide is associated with the section
	// being traveled to
	highlightIfNecessary();
}

/**
 * Function responsible for finishing the rendering of the selections section once a new design section has rolled
 * into place
 *
 * @author kinsho
 */
function finishRender()
{
	// Remove this event listener as we only need this logic in select moments
	document.body.removeEventListener(FINISH_SECTION_TRANSITION_LISTENER, finishRender);

	// Render the selections onto the page
	_selectedOptionsContainer.innerHTML = selectionsTemplate({ selectedOptions: _selections });

	// Attach all the listeners that need to be pinned to the elements in the section
	_attachListeners();
}

/**
 * Function designed to highlight a selected option if we are currently on a section where that selected option was
 * enforced
 *
 * @author kinsho
 */
function highlightIfNecessary()
{
	var currentSection = document.getElementsByClassName(ACTIVE_CLASS)[0],
		optionElements = _selectedOptionsContainer.getElementsByClassName(OPTION_CLASS);

	if (optionElements.length)
	{
		for (let i = _selections.length - 1; i >= 0; i--)
		{
			if (currentSection.id === optionElements[i].dataset.associatedSection)
			{
				optionElements[i].classList.add(HIGHLIGHTED_OPTION_CLASS);
			}
			else
			{
				optionElements[i].classList.remove(HIGHLIGHTED_OPTION_CLASS);
			}
		}
	}
}

// ----------------- MODULE ---------------------------

var selectedOptionsModule =
{
	/**
	 * Function that can render the HTML needed to display the selected options at any time
	 *
	 * @param {Object} [option] - the new design option which to add to the list of selected options. If one is not
	 * 		provided, use a placeholder option then
	 *
	 * @author kinsho
	 */
	renderTemplate: function(option)
	{
		var categoryCode = option.id.split('-')[0];

		// Ensure that the option is not yet recorded in the selections section
		for (let i = _selections.length - 1; i >= 0; i--)
		{
			// If the option is already listed, break out of this function
			if (_selections[i].id === option.id)
			{
				return;
			}
		}

		// Append the category text to the option
		option.optionCategory = categories.findCategoryTextByCode(categoryCode);

		// Append the ID of the HTML section where the option was selected
		option.sectionID = document.getElementsByClassName(ACTIVE_CLASS)[0].id;

		// Append the option to the list of selected options
		_selections.push(option);

		// Finish rendering the rest of the template once we have shifted in a new section
		document.body.addEventListener(FINISH_SECTION_TRANSITION_LISTENER, finishRender);
	},

	/**
	 * Function meant to wipe out all selections that were recorded after a given point
	 *
	 * @param { Number } fromPoint - the point from which we should drop all history that was recorded
	 * 		afterwards
	 *
	 * @author kinsho
	 */
	removeSomeHistory: function(fromPoint)
	{
		_selections.splice(fromPoint);
	}
};

// ----------------- LISTENER INITIALIZATION ---------------------------

document.body.addEventListener(FINISH_SECTION_TRANSITION_LISTENER, highlightIfNecessary);

// ----------------- PAGE INITIALIZATION ---------------------------

// Render the initial template for the selections
_selectedOptionsContainer.innerHTML = selectionsTemplate({ selectedOptions: [] });

// ----------------- EXPORT MODULE ---------------------------

export default selectedOptionsModule;