/**
 * Module responsible for sliding design sections around on the page
 */

// ----------------- ENUMS/CONSTANTS ---------------------------

var SHIFT_CLASSES =
	{
		OUT_LEFT: 'shiftOutLeft',
		OUT_RIGHT: 'shiftOutRight',
		IN_LEFT: 'shiftInLeft',
		IN_RIGHT: 'shiftInRight'
	},

	ACTIVE_CLASS = 'activeSection',
	EXTEND_CLASS = 'extend',
	OPTIONS_CAROUSEL = 'carouselContainer',

	NEXT_BUTTON = 'nextButton',
	PREV_BUTTON = 'prevButton',
	DESIGN_AREA = 'designArea',

	FINISH_SECTION_TRANSITION_LISTENER = 'finishSectionTransition';

// ----------------- PRIVATE VARIABLES ---------------------------

var _nextButton = document.getElementById(NEXT_BUTTON),
	_prevButton = document.getElementById(PREV_BUTTON),
	_designArea = document.getElementById(DESIGN_AREA);

// ----------------- PRIVATE FUNCTIONS ---------------------------

// Use the following listeners to manage the transition of design sections
function _shiftOutLeft()
{
	sliderModule.currentSection.addEventListener('animationend', _shiftInLeft);

	sliderModule.currentSection.classList.add(SHIFT_CLASSES.OUT_LEFT);
}

function _shiftOutRight()
{
	sliderModule.currentSection.addEventListener('animationend', _shiftInRight);

	sliderModule.currentSection.classList.add(SHIFT_CLASSES.OUT_RIGHT);
}

function _shiftInLeft()
{
	sliderModule.currentSection.removeEventListener('animationend', _shiftInLeft);

	// Attach the animation clean-up logic as an animationend listener
	sliderModule.followingSection.addEventListener('animationend', _endShift);

	// Determine whether to heighten the design area depending on whether we are showing a carousel or list
	if (sliderModule.followingSection.getElementsByClassName(OPTIONS_CAROUSEL).length)
	{
		_designArea.classList.add(EXTEND_CLASS);
	}
	else
	{
		_designArea.classList.remove(EXTEND_CLASS);
	}

	sliderModule.followingSection.classList.add(ACTIVE_CLASS);
	sliderModule.followingSection.classList.add(SHIFT_CLASSES.IN_LEFT);
}

function _shiftInRight()
{
	sliderModule.currentSection.removeEventListener('animationend', _shiftInRight);

	// Attach the animation clean-up logic as an animationend listener
	sliderModule.followingSection.addEventListener('animationend', _endShift);

	// Determine whether to heighten the design area depending on whether we are showing a carousel or list
	if (sliderModule.followingSection.getElementsByClassName(OPTIONS_CAROUSEL).length)
	{
		_designArea.classList.add(EXTEND_CLASS);
	}
	else
	{
		_designArea.classList.remove(EXTEND_CLASS);
	}

	sliderModule.followingSection.classList.add(ACTIVE_CLASS);
	sliderModule.followingSection.classList.add(SHIFT_CLASSES.IN_RIGHT);
}

function _endShift()
{
	sliderModule.followingSection.removeEventListener('animationend', _endShift);

	sliderModule.currentSection.classList.remove(ACTIVE_CLASS);

	// Clean out any classes that were added to trigger the sliding animations
	sliderModule.currentSection.classList.remove(SHIFT_CLASSES.OUT_LEFT);
	sliderModule.currentSection.classList.remove(SHIFT_CLASSES.OUT_RIGHT);
	sliderModule.followingSection.classList.remove(SHIFT_CLASSES.IN_RIGHT);
	sliderModule.followingSection.classList.remove(SHIFT_CLASSES.IN_LEFT);

	// Update the section trackers
	sliderModule.currentSection = sliderModule.followingSection;

	// Trigger logic to determine whether an option has already been selected from the newly inserted section
	sliderModule.currentSection.dispatchEvent(new CustomEvent(FINISH_SECTION_TRANSITION_LISTENER, { bubbles: true }));
}

// ----------------- MODULE ---------------------------

var sliderModule =
{
	currentSection: document.body, // The reference to the HTML design section that's currently in focus
	followingSection: document.body, // The reference to the next HTMl design section to bring into focus
	sectionsTraversed: [], // The list of all sections which we have navigated to, listed in sequential order

	/**
	 * Function responsible for triggering the code responsible for sliding sections into and out of view
	 *
	 * @param {Number} [followingSectionIndex]- if provided, it will tell us how far back we are traveling in the
	 * 		design process
	 * @param {Number} [currentSectionIndex]- if provided, it will tell us how far back we are traveling in the
	 * 		design process
	 *
	 * @author kinsho
	 */
	slideSections: function(followingSectionIndex, currentSectionIndex)
	{
		var followingSectionName = this.followingSection.id.substring(0, this.followingSection.id.indexOf('-')),
			currentSectionName = this.currentSection.id.substring(0, this.currentSection.id.indexOf('-'));

		followingSectionIndex = followingSectionIndex || this.findSectionIndex(followingSectionName);
		currentSectionIndex = currentSectionIndex || this.findSectionIndex(currentSectionName);

		// If the current section has not been recorded yet in our traversed register, take time out to record it
		if (currentSectionIndex === -1)
		{
			this.sectionsTraversed.push(currentSectionName);

			// Update the index of the section we are going away from
			currentSectionIndex = this.sectionsTraversed.length - 1;
		}
		// If the next section is not a part of our traversed register, assume that we are going to a new section
		if (followingSectionIndex === -1)
		{
			// Log the new section being traveled to
			this.sectionsTraversed.push(followingSectionName);

			// Update the index of the section about to be shown
			followingSectionIndex = this.sectionsTraversed.length - 1;

			// Now shift out
			_shiftOutLeft();
		}
		else if (followingSectionIndex > currentSectionIndex)
		{
			_shiftOutLeft();
		}
		else
		{
			_shiftOutRight();
		}

		// Now execute logic to disable or enable the buttons that we use to navigate back and forth between sections
		if (followingSectionIndex > currentSectionIndex)
		{
			_prevButton.disabled = false;
		}
		else if (followingSectionIndex === 0)
		{
			_prevButton.disabled = true;
		}
		if ((followingSectionIndex === this.sectionsTraversed.length - 1) || (followingSectionIndex === -1))
		{
			_nextButton.disabled = true;
		}
		else
		{
			_nextButton.disabled = false;
		}
	},

	/**
	 * See if the section name passed into the function represents a design section that the user has already traveled to
	 *
	 * @param {String} sectionName - the HTML ID of the section to test
	 *
	 * @return {Number} - either the index of the section within our sectionsTraversed array or a -1 indicating that the
	 * 		we have not yet found our way to the section
	 *
	 * @author kinsho
	 */
	findSectionIndex: function(sectionName)
	{
		for (var i = sliderModule.sectionsTraversed.length - 1; i >= 0; i--)
		{
			if (sliderModule.sectionsTraversed[i] === sectionName)
			{
				break;
			}
		}

		return i;
	},

	/**
	 * Function meant to wipe out all history that was recorded after a given point
	 *
	 * @param {String | Number } fromPoint - the point from which we should drop all history that was recorded
	 * 		afterwards
	 *
	 * @author kinsho
	 */
	removeSomeHistory: function(fromPoint)
	{
		// Find out from where we should begin deleting history if a section name has been passed instead of an index
		if (isNaN(fromPoint))
		{
			for (let i = 0; i < this.sectionsTraversed.length; i++)
			{
				if (this.sectionsTraversed[i] === fromPoint)
				{
					fromPoint = i;
				}
			}
		}

		this.sectionsTraversed.splice(fromPoint);
	}
};

// ----------------- DATA INITIALIZATION ---------------------------

// Mark whatever section is marked active by default as the current section
sliderModule.currentSection = document.getElementsByClassName(ACTIVE_CLASS)[0];

// ----------------- EXPORT ---------------------------

export default sliderModule;