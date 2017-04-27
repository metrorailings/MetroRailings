// ----------------- ENUMS/CONSTANTS ---------------------------

var OPTIONS_CAROUSEL_TEMPLATE = 'optionsCarouselTemplate',

	RESET_CAROUSEL_LISTENER = 'resetCarousel',
	SET_SELECTED_ICON_LISTENER = 'setSelectedIcon',

	CAROUSEL_SHIFT_TRIGGER = 'shiftTrigger',
	SELECTED_ICON_CLASS = 'selectedIcon',
	OPTION_VIEWER_CLASS = 'optionViewer',
	CAROUSEL_CONTROL_CLASS = 'carouselControl',
	HIDE_CLASS = 'hide',
	SHOW_CLASS = 'show',
	SELECTED_CLASS = 'selected',

	SHIFT_CLASSES =
	{
		OUT_LEFT: 'shiftOutLeft',
		OUT_RIGHT: 'shiftOutRight',
		IN_LEFT: 'shiftInLeft',
		IN_RIGHT: 'shiftInRight'
	};

// ----------------- HANDLEBAR TEMPLATES ---------------------------

/**
 * The partial to load new option carousels
 */
var optionsCarouselTemplate = Handlebars.compile(document.getElementById(OPTIONS_CAROUSEL_TEMPLATE).innerHTML);

// ----------------- CLASS DEFINITION -----------------------------

class optionsCarousel
{
	/**
	 * Constructor responsible for generating a new options carousel to display on page
	 *
	 * @param {String} carouselContainerID - the ID of the container within which to place the newly generated carousel
	 * @param {Array<Object>} options - a list of options that will be used to populate the carousel dropdown
	 * @param {Function} selectionListener - the logic that will be invoked when a new option is selected from the
	 * 		select dropdown
	 * @param {String} viewerTemplate - the script tag that features the Handlebars template that will be used to load
	 * 		HTML into the option viewer once a selection is made from the carousel dropdown
	 * @param {Function} [postLoadCallback] - logic to run when panels are switched out within the carousel
	 *
	 * @author kinsho
	 */
	constructor(carouselContainerID, options, selectionListener, viewerTemplate, postLoadCallback)
	{
		let carouselContainer = document.getElementById(carouselContainerID);

		// Store references to some of the parameters being passed into the constructor
		this.compiledViewerTemplate = Handlebars.compile(document.getElementById(viewerTemplate).innerHTML);
		this.currentIndex = -1; // The index of the option currently in context
		this.options = options;
		this.selectionListener = selectionListener;
		this.postLoadCallback = postLoadCallback;

		// Place the new carousel into the document
		carouselContainer.innerHTML = optionsCarouselTemplate(
		{
			options: options,
		});

		// Grab references to the important elements in the carousel now that it has been placed inside the document
		this.optionViewer = carouselContainer.getElementsByClassName(OPTION_VIEWER_CLASS)[0];
		this.carouselPreviewPics = carouselContainer.getElementsByClassName(CAROUSEL_SHIFT_TRIGGER);
		this.carouselSelectedIcons = carouselContainer.getElementsByClassName(SELECTED_ICON_CLASS);
		this.carouselControls = carouselContainer.getElementsByClassName(CAROUSEL_CONTROL_CLASS);

		// Set up a listener on each carousel preview picture so that the user can navigate around any part of the
		// carousel at will
		for (var i = this.carouselPreviewPics.length - 1; i >= 0; i--)
		{
			this.carouselPreviewPics[i].addEventListener('click', (event) =>
			{
				this.changeToAnotherOption(event);
			});
		}

		this.carouselControls[0].addEventListener('click', (event) =>
		{
			this.changeToAnotherOption(event);
		});
		this.carouselControls[1].addEventListener('click', (event) =>
		{
			this.changeToAnotherOption(event);
		});

		// Hide the controls for the time being
		this.carouselControls[0].classList.add(HIDE_CLASS);
		this.carouselControls[1].classList.add(HIDE_CLASS);

		// Load the initial panel into the carousel
		this.optionViewer.innerHTML = this.compiledViewerTemplate(this.selectionListener(this.currentIndex));

		// Initialize a listener that will reset the carousel back to its starting position when summoned to do so
		carouselContainer.addEventListener(RESET_CAROUSEL_LISTENER, () =>
		{
			this.reset();
		});

		carouselContainer.addEventListener(SET_SELECTED_ICON_LISTENER, (event) =>
		{
			this.setSelectedIcon(event.detail);
		});
	}

	// ----------------- LISTENERS -----------------------------

	/**
	 * Function responsible for resetting the viewer
	 *
	 * @author kinsho
	 */
	reset()
	{
		// Blank out the current index in order to tell the viewer template that no option is currently selected
		this.currentIndex = -1;

		// Have the template itself render the initial viewer back
		this.optionViewer.innerHTML = this.compiledViewerTemplate(this.selectionListener(null));

		// Unselect any preview pictures that may have been marked as currently in context
		for (var i = this.carouselPreviewPics.length - 1; i >= 0; i--)
		{
			this.carouselPreviewPics[i].classList.remove(SELECTED_CLASS);
			this.carouselSelectedIcons[i].classList.remove(SHOW_CLASS);
		}
	}

	/**
	 * Function responsible for hiding and showing the controls depending on where in the carousel the user is at
	 *
	 * @author kinsho
	 */
	updateControlAccessibility()
	{
		// If no more options precede the one currently in context, hide the leftward navigator and
		// prevent it from further activation
		if ( (this.currentIndex === 0) || !(this.currentIndex) )
		{
			this.carouselControls[0].classList.add(HIDE_CLASS);
			this.carouselControls[0].dataset.index = '';
		}
		else
		{
			this.carouselControls[0].classList.remove(HIDE_CLASS);
			this.carouselControls[0].dataset.index = this.currentIndex - 1;
		}

		// If no more options come after the one currently in context, hide the rightward navigator and prevent it
		// from further activation
		if ((this.currentIndex === this.options.length - 1) ||
			( !(this.currentIndex) && this.currentIndex !== 0 ))
		{
			this.carouselControls[1].classList.add(HIDE_CLASS);
			this.carouselControls[1].dataset.index = '';
		}
		else
		{
			this.carouselControls[1].classList.remove(HIDE_CLASS);
			this.carouselControls[1].dataset.index = this.currentIndex + 1;
		}
	}

	/**
	 * Function responsible for managing the display of the selection marker that helps the user quickly figure out
	 * which option was selected
	 *
	 * @param {boolean} [doReset] - a flag indicating that an option was unselected, thus triggering logic to ensure
	 * 		that no selection icon is to be shown
	 *
	 * @author kinsho
	 */
	setSelectedIcon(doReset)
	{
		for (var i = this.carouselSelectedIcons.length - 1; i >= 0; i--)
		{
			if ( !(doReset) && (i === this.currentIndex))
			{
				this.carouselSelectedIcons[i].classList.add(SHOW_CLASS);
			}
			else
			{
				this.carouselSelectedIcons[i].classList.remove(SHOW_CLASS);
			}
		}
	}

	/**
	 * The listener responsible for moving the carousel around and letting the user examine different options
	 *
	 * @param {Event} event - the event object associated with the firing of this listener
	 *
	 * @author kinsho
	 */
	changeToAnotherOption(event)
	{
		var element = event.currentTarget,
			nextIndex = element.dataset.index,
			i;

		// If the user clicked on an inactive control, simply ignore processing the rest of this logic
		if ( !(nextIndex) )
		{
			return false;
		}

		// Change the look of the picture corresponding to the option currently in context
		for (i = this.carouselPreviewPics.length - 1; i >= 0; i--)
		{
			if (this.carouselPreviewPics[i].dataset.index === nextIndex)
			{
				this.carouselPreviewPics[i].classList.add(SELECTED_CLASS);
			}
			else
			{
				// Don't forget to deselect any preview pictures that may have been indicated as being selected
				this.carouselPreviewPics[i].classList.remove(SELECTED_CLASS);
			}
		}

		nextIndex = window.parseInt(nextIndex, 10);

		// We need animations to shift things to the left
		if (nextIndex > this.currentIndex)
		{
			this.boundShift = this.shiftInLeft.bind(this);
			this.optionViewer.addEventListener('animationend', this.boundShift);

			this.optionViewer.classList.add(SHIFT_CLASSES.OUT_LEFT);
		}
		// Otherwise, we need animations to shift things to the right
		else if (nextIndex < this.currentIndex)
		{
			this.boundShift = this.shiftInRight.bind(this);
			this.optionViewer.addEventListener('animationend', this.boundShift);

			this.optionViewer.classList.add(SHIFT_CLASSES.OUT_RIGHT);
		}

		this.currentIndex = nextIndex;
	}

	// Use the following listeners to manage the transition of option panels inside the carousel
	shiftInLeft()
	{
		// Remember that we bound this method to the object instance earlier, resulting in a new function reference
		this.optionViewer.removeEventListener('animationend', this.boundShift);

		// Switch out the HTML before shifting the viewer back into view
		// Please keep in mind that The selection listener should ALWAYS return data we can use to populate the template
		// that will be used to render data into the option viewer
		this.optionViewer.innerHTML = this.compiledViewerTemplate(this.selectionListener(this.currentIndex));
		// @TODO: Animate the height of the viewer programmatically

		this.optionViewer.classList.add(SHIFT_CLASSES.IN_LEFT);

		this.boundShift = this.endShift.bind(this);
		this.optionViewer.addEventListener('animationend', this.boundShift);
	}

	shiftInRight()
	{
		// Remember that we bound this method to the object instance earlier, resulting in a new function reference
		this.optionViewer.removeEventListener('animationend', this.boundShift);

		// Switch out the HTML before shifting the viewer back into view
		// Please keep in mind that The selection listener should ALWAYS return data we can use to populate the template
		// that will be used to render data into the option viewer
		this.optionViewer.innerHTML = this.compiledViewerTemplate(this.selectionListener(this.currentIndex));
		// @TODO: Animate the height of the viewer programmatically

		this.optionViewer.classList.add(SHIFT_CLASSES.IN_RIGHT);

		this.boundShift = this.endShift.bind(this);
		this.optionViewer.addEventListener('animationend', this.boundShift);
	}

	endShift()
	{
		// Remember that we bound this method to the object instance earlier, resulting in a new function reference
		this.optionViewer.removeEventListener('animationend', this.boundShift);

		this.optionViewer.classList.remove(SHIFT_CLASSES.IN_LEFT);
		this.optionViewer.classList.remove(SHIFT_CLASSES.IN_RIGHT);
		this.optionViewer.classList.remove(SHIFT_CLASSES.OUT_LEFT);
		this.optionViewer.classList.remove(SHIFT_CLASSES.OUT_RIGHT);

		// Don't forget to update the look of the controls and allow images to be opened up in the gallery
		this.updateControlAccessibility();

		// If logic has been specifically set to be executed after a new panel is shown, execute that logic
		if (this.postLoadCallback)
		{
			// Always pass the DOM node containing the panel to the callback logic
			this.postLoadCallback(this.optionViewer);
		}
	}
}

// ----------------- EXPORT -----------------------------

export default optionsCarousel;