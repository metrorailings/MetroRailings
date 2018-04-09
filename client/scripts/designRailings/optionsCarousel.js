// ----------------- ENUMS/CONSTANTS ---------------------------

var OPTIONS_CAROUSEL_TEMPLATE = 'optionsCarouselTemplate',
	CAROUSEL_PANEL_TEMPLATE = 'carouselPanelTemplate',

	RESET_CAROUSEL_LISTENER = 'resetCarousel',
	SELECTION_MADE_LISTENER = 'selectionMade',
	FINISH_SECTION_TRANSITION_LISTENER = 'finishSectionTransition',

	CAROUSEL_SHIFT_TRIGGER = 'shiftTrigger',
	OPTION_VIEWER_CLASS = 'optionViewer',
	IMAGE_PREVIEW_CLASS = 'designPreview',
	MAIN_PANEL_PICTURE = 'enlargedCarouselPicture',
	SELECTED_CLASS = 'selected',
	FADE_CLASS = 'fade',

	SHIFT_CLASSES =
	{
		OUT_LEFT: 'shiftOutLeft',
		OUT_RIGHT: 'shiftOutRight',
		IN_LEFT: 'shiftInLeft',
		IN_RIGHT: 'shiftInRight'
	};

// ----------------- HANDLEBAR TEMPLATES ---------------------------

/**
 * The partial to load new option carousels as well as the panels that will be shifted into and out of place
 */
var optionsCarouselTemplate = Handlebars.compile(document.getElementById(OPTIONS_CAROUSEL_TEMPLATE).innerHTML),
	carouselPanelTemplate = Handlebars.compile(document.getElementById(CAROUSEL_PANEL_TEMPLATE).innerHTML);

// ----------------- PRIVATE FUNCTION -----------------------------

/**
 * A listener designed to switch out whatever picture is in focus in the given carousel panel
 *
 * @param {Event} event - the event that triggered this function
 *
 * @author kinsho
 */
function _setMainPanelPic(event)
{
	var selectedImage = event.currentTarget,
		designPreviewPics = this.optionViewer.getElementsByClassName(IMAGE_PREVIEW_CLASS),
		enlargedPic = this.optionViewer.getElementsByClassName(MAIN_PANEL_PICTURE)[0];


	// Mark which preview picture is currently in greater focus
	for (let j = designPreviewPics.length - 1; j >= 0; j--)
	{
		if (designPreviewPics[j].src === selectedImage.src)
		{
			designPreviewPics[j].classList.add(SELECTED_CLASS);
		}
		else
		{
			designPreviewPics[j].classList.remove(SELECTED_CLASS);
		}
	}

	// Fade out the headline picture, and then switch it out
	enlargedPic.classList.add(FADE_CLASS);
	window.setTimeout(() =>
	{
		enlargedPic.src = selectedImage.src;
		enlargedPic.classList.remove(FADE_CLASS);
	}, 500);
}

// ----------------- CLASS DEFINITION -----------------------------

class optionsCarousel
{
	/**
	 * Constructor responsible for generating a new options carousel to display on page
	 *
	 * @param {HTMLElement} element - the element in which to load the HTML of the newly generated carousel
	 * @param {Array<Object>} options - a list of options that will be used to populate the carousel
	 * @param {Object} viewModel - the view model in which we would need to register whatever the user selects
	 * @param {String} property - the view model property in which we will store whatever the user selects
	 *
	 * @author kinsho
	 */
	constructor(element, options, viewModel, property)
	{
		// Store references to some of the parameters being passed into the constructor
		this.currentIndex = -1; // The index of the option currently in context
		this.options = options;
		this.viewModel = viewModel;
		this.property = property;
		this.element = element;

		// Place a new carousel into the document
		element.innerHTML = optionsCarouselTemplate(this.options);

		// Grab references to the important elements in the carousel now that it has been placed inside the document
		this.optionViewer = element.getElementsByClassName(OPTION_VIEWER_CLASS)[0];
		this.carouselPreviewPics = element.getElementsByClassName(CAROUSEL_SHIFT_TRIGGER);

		// Set up a listener on each carousel thumbnail so that the user can navigate around any part of the
		// carousel at will
		for (let i = this.carouselPreviewPics.length - 1; i >= 0; i--)
		{
			this.carouselPreviewPics[i].addEventListener('click', this.registerSelection.bind(this));
		}

		// Load the initial panel into the carousel
		this.optionViewer.innerHTML = carouselPanelTemplate({ isDefaultPanel: true });

		// Initialize a listener that will reset the carousel back to its starting position when summoned to do so
		element.addEventListener(RESET_CAROUSEL_LISTENER, this.reset.bind(this));

		// Initialize a listener that would allow us to update the main controller at any time with a selected value
		element.parentNode.addEventListener(FINISH_SECTION_TRANSITION_LISTENER, this.updateControllerScript.bind(this));
	}

	// ----------------- LISTENERS -----------------------------

	/**
	 * Function responsible for resetting the viewer
	 *
	 * @author kinsho
	 */
	reset()
	{
		// Reset the current index for bookkeeping's sake
		this.currentIndex = -1;

		// Have the template itself render the initial viewer back
		this.optionViewer.innerHTML = carouselPanelTemplate({ isDefaultPanel: true });

		// Unselect any preview pictures that may have been marked as currently in context
		for (var i = this.carouselPreviewPics.length - 1; i >= 0; i--)
		{
			this.carouselPreviewPics[i].classList.remove(SELECTED_CLASS);
		}

		// Reset the corresponding property inside the view model as well
		this.viewModel[this.property] = '';
	}

	/**
	 * Set the listeners on any preview pictures that are present
	 *
	 * @author kinsho
	 */
	initializePreviewPictures()
	{
		var previewImages = this.optionViewer.getElementsByClassName(IMAGE_PREVIEW_CLASS);

		for (let i = previewImages.length - 1; i >= 0; i--)
		{
			previewImages[i].addEventListener('click', _setMainPanelPic.bind(this));
		}
	}

	/**
	 * A function that updates the main script so as to indicate whether a value has already been selected for this
	 * section upon navigating to it. If so, the main script should update its internal register and enable the
	 * navigation buttons then
	 *
	 * @author kinsho
	 */
	updateControllerScript()
	{
		if (this.currentIndex === -1)
		{
			// Dispatch an event that would allow us to update data in the main controller
			this.element.dispatchEvent(new CustomEvent(SELECTION_MADE_LISTENER,
			{
				bubbles: true,
				detail:
				{
					// Send over option data
					option: this.options[this.currentIndex],
					// Send over view model property data
					vmProp: this.property
				}
			}));
		}
	}

	/**
	 * The listener responsible for moving the carousel around, letting the user examine different options, and
	 * ultimately letting users select an option from the carousel
	 *
	 * @param {Event} event - the event object associated with the firing of this listener
	 *
	 * @author kinsho
	 */
	registerSelection(event)
	{
		var element = event.currentTarget,
			nextIndex = element.dataset.index;

		// Change the look of the picture corresponding to the option currently in context
		for (let i = this.carouselPreviewPics.length - 1; i >= 0; i--)
		{
			if (this.carouselPreviewPics[i].dataset.index === nextIndex)
			{
				this.carouselPreviewPics[i].classList.add(SELECTED_CLASS);
			}
			else
			{
				// Don't forget to deselect any preview pictures that were previously highlighted
				this.carouselPreviewPics[i].classList.remove(SELECTED_CLASS);
			}
		}

		// Now convert the index of the option to be shown into a number so that we can perform some inequality
		// operations
		nextIndex = window.parseInt(nextIndex, 10);

		// We need animations to shift things to the left
		if (nextIndex > this.currentIndex)
		{
			this.shiftOutLeft();
		}
		// Otherwise, we need animations to shift things to the right
		else if (nextIndex < this.currentIndex)
		{
			this.shiftOutRight();
		}
		// Update the index being tracked as the animation begins
		this.currentIndex = nextIndex;

		// Update the index being tracked
		this.currentIndex = nextIndex;

		// Dispatch an event that would allow us to execute logic outside the scope of this directive after an
		// option has been selected
		element.dispatchEvent(new CustomEvent(SELECTION_MADE_LISTENER,
		{
			bubbles: true,
			detail:
			{
				// Send over option data
				option: this.options.options[this.currentIndex],
				// Send over view model property data
				vmProp: this.property
			}
		}));
	}

	// Use the following listeners to manage the transition of option panels inside the carousel
	shiftOutRight()
	{
		this.boundShift = this.shiftInRight.bind(this);
		this.optionViewer.addEventListener('animationend', this.boundShift);

		this.optionViewer.classList.add(SHIFT_CLASSES.OUT_RIGHT);
	}

	shiftOutLeft()
	{
		this.boundShift = this.shiftInLeft.bind(this);
		this.optionViewer.addEventListener('animationend', this.boundShift);

		this.optionViewer.classList.add(SHIFT_CLASSES.OUT_LEFT);
	}

	shiftInLeft()
	{
		// Remember that we bound this method to the object instance earlier, resulting in a new function reference
		this.optionViewer.removeEventListener('animationend', this.boundShift);

		// Switch out the HTML before shifting the viewer back into view
		this.optionViewer.innerHTML = carouselPanelTemplate(this.options.designMetadata[this.currentIndex]);

		// Attach the animation clean-up logic as an animationend listener
		this.boundShift = this.endShift.bind(this);
		this.optionViewer.addEventListener('animationend', this.boundShift);
		this.optionViewer.classList.add(SHIFT_CLASSES.IN_LEFT);
	}

	shiftInRight()
	{
		// Remember that we bound this method to the object instance earlier, resulting in a new function reference
		this.optionViewer.removeEventListener('animationend', this.boundShift);

		// Switch out the HTML before shifting the viewer back into view
		this.optionViewer.innerHTML = carouselPanelTemplate(this.options.designMetadata[this.currentIndex]);

		// Attach the animation clean-up logic as an animationend listener
		this.boundShift = this.endShift.bind(this);
		this.optionViewer.addEventListener('animationend', this.boundShift);
		this.optionViewer.classList.add(SHIFT_CLASSES.IN_RIGHT);
	}

	endShift()
	{
		// Remember that we bound this method to the object instance earlier, resulting in a new function reference
		this.optionViewer.removeEventListener('animationend', this.boundShift);

		// Clean out any classes that were added to fade the new carousel panel into view
		this.optionViewer.classList.remove(SHIFT_CLASSES.IN_LEFT);
		this.optionViewer.classList.remove(SHIFT_CLASSES.IN_RIGHT);
		this.optionViewer.classList.remove(SHIFT_CLASSES.OUT_LEFT);
		this.optionViewer.classList.remove(SHIFT_CLASSES.OUT_RIGHT);

		// Set up listeners on the newly inserted panel
		this.initializePreviewPictures();
	}
}

// ----------------- EXPORT -----------------------------

export default optionsCarousel;