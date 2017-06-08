// ----------------- EXTERNAL MODULES --------------------------

import rQueryClient from 'client/scripts/utility/rQueryClient';
import tooltipManager from 'client/scripts/utility/tooltip';

// ----------------- ENUMS/CONSTANTS ---------------------------

var OPTIONS_CAROUSEL_TEMPLATE = 'optionsCarouselTemplate',

	RESET_CAROUSEL_LISTENER = 'resetCarousel',
	SET_SELECTED_ICON_LISTENER = 'setSelectedIcon',

	CAROUSEL_SHIFT_TRIGGER = 'shiftTrigger',
	SELECTED_ICON_CLASS = 'selectedIcon',
	OPTION_VIEWER_CLASS = 'optionViewer',
	SHOW_CLASS = 'show',
	RESTRICTED_CLASS = 'restricted',
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

// ----------------- PRIVATE FUNCTION -----------------------------

/**
 * Function meant to test whether a particular order meets the conditions necessary for a specific design choice
 * to be rendered eligible to the customer
 *
 * @param {Object} restrictions - the conditions that serve to restrict eligibility
 * @param {Object} viewModel - the model representing the order
 *
 * @returns {Boolean} - a flag indicating whether the order satisfies eligibility conditions
 *
 * @author kinsho
 */
function _testRestrictions(restrictions, viewModel)
{
	var keys = Object.keys(restrictions),
		restrictionVal, modelVal,
		i;

	for (i = keys.length - 1; i >= 0; i--)
	{
		restrictionVal = restrictions[keys[i]];
		modelVal = viewModel[keys[i]];

		// If the values being compared are objects, recursively run this function on those specific
		// property values
		if (rQueryClient.isObject(restrictionVal))
		{
			if (rQueryClient.isObject(modelVal))
			{
				_testRestrictions(restrictionVal, modelVal);
			}
			else
			{
				return false;
			}
		}

		else if (restrictionVal !== modelVal)
		{
			return false;
		}
	}

	return true;
}
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
	 * @param {Object} [viewModel] - the view model containing the details necessary to determine the eligibility
	 * 		status of certain options
	 * @param {Function} [postLoadCallback] - logic to run when panels are switched out within the carousel
	 *
	 * @author kinsho
	 */
	constructor(carouselContainerID, options, selectionListener, viewerTemplate, viewModel, postLoadCallback)
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

		// Test whether each carousel preview picture corresponds to an eligible option. If so, set up a listener on
		// each carousel preview picture so that the user can navigate around any part of the carousel at will
		for (var i = this.carouselPreviewPics.length - 1; i >= 0; i--)
		{
			if (options[i].restrictions)
			{
				if (_testRestrictions(options[i].restrictions, viewModel))
				{
					this.carouselPreviewPics[i].addEventListener('click', (event) =>
					{
						this.changeToAnotherOption(event);
					});
				}

				else
				{
					this.carouselPreviewPics[i].parentNode.classList.add(RESTRICTED_CLASS);

					// Set up a tooltip indicating why the option cannot be selected
					tooltipManager.setTooltip(this.carouselPreviewPics[i], options[i].restrictedMessage, false, tooltipManager.TOOLTIP_OPEN_ON.HOVER);
				}
			}
			else
			{
				this.carouselPreviewPics[i].addEventListener('click', (event) =>
				{
					this.changeToAnotherOption(event);
				});
			}
		}

		// Load the initial panel into the carousel
		this.optionViewer.innerHTML = this.compiledViewerTemplate(this.selectionListener(this.currentIndex));

		// Initialize a listener that will reset the carousel back to its starting position when summoned to do so
		carouselContainer.addEventListener(RESET_CAROUSEL_LISTENER, () =>
		{
			this.reset();
		});

		// Set up a listener to indicate which icon has its details currently loaded inside the panel
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