// ----------------- ENUMS/CONSTANTS ---------------------------

var OPTIONS_LIST_TEMPLATE = 'optionsListTemplate',

	RESET_LIST_LISTENER = 'resetList',
	SELECTION_MADE_LISTENER = 'selectionMade',
	FINISH_SECTION_TRANSITION_LISTENER = 'finishSectionTransition',

	OPTION_THUMBNAIL = 'optionThumbnail',
	OPTION_NAME = 'optionName',
	LIST_OPTION = 'listOption',
	SELECTED_CLASS = 'selected';

// ----------------- HANDLEBAR TEMPLATES ---------------------------

/**
 * The partial to load new option lists
 */
var optionsListTemplate = Handlebars.compile(document.getElementById(OPTIONS_LIST_TEMPLATE).innerHTML);

// ----------------- PRIVATE FUNCTION -----------------------------

class optionsList
{
	/**
	 * Constructor responsible for building a new options list to display on page
	 *
	 * @param {HTMLElement} element - the element in which to load the HTML of the newly generated options list
	 * @param {Array<Object>} options - a list of options that will be used to populate the list
	 * @param {Object} viewModel - the view model in which we would need to register whatever the user selects
	 * @param {String} property - the view model property in which we will store whatever the user selects
	 *
	 * @author kinsho
	 */
	constructor(element, options, viewModel, property)
	{
		// Store references to some of the parameters being passed into the constructor
		this.options = options.options;
		this.viewModel = viewModel;
		this.property = property;
		this.element = element;

		// Place the options listing into the document
		element.innerHTML = optionsListTemplate(
		{
			options: this.options,
		});

		// Grab references to the important elements in the list now that it has been placed inside the document
		this.thumbnails = element.getElementsByClassName(OPTION_THUMBNAIL);
		this.names = element.getElementsByClassName(OPTION_NAME);

		// Register listeners to allow the user to choose an option from the list
		for (let i = this.thumbnails.length - 1; i >= 0; i--)
		{
			this.thumbnails[i].addEventListener('click', this.registerSelection.bind(this));
			this.names[i].addEventListener('click', this.registerSelection.bind(this));
		}

		// Initialize a listener that will reset the list back to its default state
		element.addEventListener(RESET_LIST_LISTENER, this.reset.bind(this));

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
		// Unmark all options that have been marked as selected
		for (let i = this.thumbnails.length - 1; i >= 0; i--)
		{
			this.thumbnails[i].classList.remove(SELECTED_CLASS);
		}

		// Reset the corresponding property inside the view model as well
		this.viewModel[this.property] = '';
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
		var listEntries = this.element.getElementsByClassName(LIST_OPTION),
			i;

		// Check to see if the view model has been set with an option from this section
		if (this.viewModel[this.property])
		{
			// If so, find out where that option can be found in the collection of selectables we have here			for
			for (i = listEntries.length - 1; i >= 0; i--)
			{
				if (listEntries[i].dataset.value === this.viewModel[this.property])
				{
					break;
				}
			}

			// Dispatch an event that would allow us to update data in the main controller
			this.element.dispatchEvent(new CustomEvent(SELECTION_MADE_LISTENER,
			{
				bubbles: true,
				detail:
				{
					// Send over option data
					option: this.options[i],
					// Send over view model property data
					vmProp: this.property
				}
			}));
		}
	}

	/**
	 * Function responsible for registering a new selection
	 *
	 * @param {Event} event - the event associated with the firing of this listener
	 *
	 * @author kinsho
	 */
	registerSelection(event)
	{
		var element = event.currentTarget,
			listOptionElement = element.parentNode,
			thumbnail;

		// Unhighlight all thumbnails first
		this.reset();

		// Denote whether the thumbnail or option name was clicked
		if (element.classList.contains(OPTION_THUMBNAIL))
		{
			thumbnail = element;
		}
		else
		{
			thumbnail = listOptionElement.getElementsByClassName(OPTION_THUMBNAIL)[0];
		}

		// Mark the chosen option's thumbnail
		thumbnail.classList.add(SELECTED_CLASS);

		// Dispatch an event that would allow us to execute logic outside the scope of this directive after an
		// option has been selected
		element.dispatchEvent(new CustomEvent(SELECTION_MADE_LISTENER,
		{
			bubbles: true,
			detail:
			{
				// Send over option data
				option: this.options[window.parseInt(listOptionElement.dataset.index, 10)],
				// Send over view model property data
				vmProp: this.property,
				vmValue: listOptionElement.dataset.value
			}
		}));
	}
}

// ----------------- EXPORT -----------------------------

export default optionsList;