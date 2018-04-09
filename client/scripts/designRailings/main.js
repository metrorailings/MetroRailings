// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/designRailings/viewModel';
import carousel from 'client/scripts/designRailings/optionsCarousel';
import list from 'client/scripts/designRailings/optionsList';
import slider from 'client/scripts/designRailings/sectionSlider';
import selections from 'client/scripts/designRailings/selectedOptions';

// ----------------- ENUMS/CONSTANTS ---------------------------

var LIST_SECTION_CLASS = 'listContainer',
	CAROUSEL_CLASS = 'carouselContainer',

	NEXT_BUTTON = 'nextButton',
	PREV_BUTTON = 'prevButton',
	DESIGN_SECTION_SUFFIX = '-DesignSection',

	ACTIVE_CLASS = 'activeSection',

	SELECTION_MADE_LISTENER = 'selectionMade',
	FINISH_SECTION_TRANSITION_LISTENER = 'finishSectionTransition',

	VIEW_MODEL_DESIGN_PROPERTIES =
	{
		TYPE: 'type',
		POST: 'postDesign',
		POST_END: 'postEndDesign',
		POST_CAP: 'postCapDesign',
		CENTER: 'centerDesign'
	};

// ----------------- PRIVATE VARIABLES ---------------------------

var _selectedOption, // A reference to whatever option is currently selected
	_currentVMProp, // A reference to the view model property we are looking to currently set

	// Elements
	_optionLists = document.getElementsByClassName(LIST_SECTION_CLASS),
	_carousels = document.getElementsByClassName(CAROUSEL_CLASS),
	_nextButton = document.getElementById(NEXT_BUTTON),
	_prevButton = document.getElementById(PREV_BUTTON);


// ----------------- HANDLEBARS HELPERS ---------------------------

Handlebars.registerHelper('if_more_than_one_image', function(collection, block)
{
	return (collection.length > 1 ? block.fn(this) : block.inverse(this));
});

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

var propKeys = Object.keys(VIEW_MODEL_DESIGN_PROPERTIES);

for (let i = propKeys.length - 1; i >= 0; i--)
{
	vm[propKeys[i]] = '';
}

// ----------------- LISTENERS -----------------------------

/**
 * Function that notes that an option has been selected
 *
 * @param {Event} event - the event object associated with the firing of this listener. Note the event object
 * 		contains a detail parameter that houses data about the option that was recently selected
 *
 * @author kinsho
 */
function registerSelection(event)
{
	var option = event.detail.option;

	// Enable the next button depending on whether an actual selection was made or whether the section was merely reset
	if (option && option.id)
	{
		_nextButton.disabled = false;
	}
	else
	{
		_nextButton.disabled = true;
	}

	// Record the option that's currently selected
	_selectedOption = option;
console.log('SET _selectedOption');
console.log(_selectedOption);
}

/**
 * Function responsible for taking the user to the next section
 *
 * @author kinsho
 */
function goToNextSection()
{
	var currentSectionIndex,
		nextSectionIndex;

	slider.followingSection = document.getElementById(_selectedOption.nextSection + DESIGN_SECTION_SUFFIX);

	// Set a value in the view model
	if (_selectedOption)
	{
		vm[_currentVMProp] = _selectedOption.id;
	}

	// Find out if we are traveling to a new section not recorded in current history
	nextSectionIndex = slider.findSectionIndex(slider.followingSection);
	currentSectionIndex = slider.findSectionIndex(slider.currentSection);
	if ((nextSectionIndex === -1) || (nextSectionIndex !== currentSectionIndex + 1))
	{
		slider.removeSomeHistory(currentSectionIndex + 1);
		selections.removeSomeHistory(currentSectionIndex + 1);
	}

	// Prepare to modify the selections section to account for the newly selected option, if one was made
	selections.renderTemplate(_selectedOption);

	// Discard whatever has been noted as the currently selected option
	_selectedOption = null;
console.log('RESET _selectedOption');

	// Now shift through everything
	slider.slideSections();
}

/**
 * Function responsible for taking the user to the previous section
 *
 * @author kinsho
 */
function goToPrevSection()
{
	var activeSection = slider.currentSection.id.substring(0, slider.currentSection.id.indexOf('-')),
		prevSectionIndex = slider.findSectionIndex(activeSection) - 1;

	// Only travel to a previous section should we not be on the first section
	if (prevSectionIndex >= 0)
	{
		// Discard whatever has been noted as the currently selected option
		_selectedOption = null;

		// Note the section we will soon travel to
		slider.followingSection = document.getElementById(slider.sectionsTraversed[prevSectionIndex] + DESIGN_SECTION_SUFFIX);

		// Discard whatever has been noted as the currently selected option
		_selectedOption = null;
console.log('RESET _selectedOption');
		// Now shift, noting that we are traveling one step backward
		slider.slideSections(prevSectionIndex, prevSectionIndex + 1);
	}
}

/**
 * Function responsible for examining the current section in place and figuring out to which view model property it
 * correlates to
 *
 * @author kinsho
 */
function setCurrentVMProperty()
{
	_currentVMProp = document.getElementsByClassName(ACTIVE_CLASS)[0].dataset.vmProp;
console.log('SET vmProp - ' + _currentVMProp);
}

// ----------------- PAGE INITIALIZATION -----------------------------

// Instantiate all the design panels
for (let i = _optionLists.length - 1; i >= 0; i--)
{
	// Pull the data that will need to be loaded into this particular panel
	System.import(_optionLists[i].dataset.dataFile).then((options) =>
	{
		// Load the list instance
		new list(_optionLists[i], options.default, vm, _optionLists[i].parentNode.dataset.vmProp);
	});
}
for (let i = _carousels.length - 1; i >= 0; i--)
{
	// Pull the data that will need to be loaded into this particular panel
	System.import(_carousels[i].dataset.dataFile).then((options) =>
	{
		// Load the carousel instance
		new carousel(_carousels[i], options.default, vm, _carousels[i].parentNode.dataset.vmProp);
	});
}

// Note whatever view model property belongs to the first section currently visible
setCurrentVMProperty();

// ----------------- LISTENER INITIALIZATION -----------------------------

_nextButton.addEventListener('click', goToNextSection);
_prevButton.addEventListener('click', goToPrevSection);

document.body.addEventListener(SELECTION_MADE_LISTENER, registerSelection);
document.body.addEventListener(FINISH_SECTION_TRANSITION_LISTENER, setCurrentVMProperty);