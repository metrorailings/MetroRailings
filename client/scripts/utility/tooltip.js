// ----------------- ENUMS/CONSTANTS ---------------------------

let TOOLTIP_SIZE_CLASSES =
	{
		SMALL: 'tooltipSmall',
		MEDIUM: 'tooltipMedium',
		LARGE: 'tooltipLarge'
	},

	TOOLTIP_ID_SUFFIX = '-tooltip';

// ----------------- PRIVATE VARIABLES ---------------------------

// The collection of all existing tooltips on the page
let _tooltipCache = {};

// ----------------- PRIVATE FUNCTIONS ---------------------------

/**
 * Function meant to wrap the text of the tooltip into a container that will be sized appropriately
 * according to the text
 *
 * @param {String} hostElementID - the ID of the element hosting the tooltip
 * @param {String} message - the message to wrap within a container
 *
 * @returns {DOMElement} - the HTML element to insert into the tooltip
 *
 * @author kinsho
 */
function _wrapMessage(hostElementID, message)
{
	let container = document.createElement('div');

	container.innerHTML = message;

	// Properly size the tooltip relative to its textual content
	if (message.length < 50)
	{
		container.classList.add(TOOLTIP_SIZE_CLASSES.SMALL);
	}
	else if (message.length < 100)
	{
		container.classList.add(TOOLTIP_SIZE_CLASSES.MEDIUM);
	}
	else
	{
		container.classList.add(TOOLTIP_SIZE_CLASSES.LARGE);
	}

	// Generate an ID for the tooltip
	container.id = hostElementID + TOOLTIP_ID_SUFFIX;

	return container;
}

// ----------------- LISTENERS ---------------------------

// ----------------- MODULE DEFINITION -----------------------------

let tooltipModule =
{
	/**
	 * The data structure that houses all the different values that could be used to position the tooltip
	 */
	TOOLTIP_POSITIONS:
	{
		NORTH : 'top center',
		NORTHEAST : 'top right',
		EAST : 'right middle',
		SOUTHEAST : 'bottom right',
		SOUTH : 'bottom center',
		SOUTHWEST : 'bottom left',
		WEST : 'left middle',
		NORTHWEST: 'top left'
	},

	TOOLTIP_OPEN_ON:
	{
		ALWAYS: 'always',
		HOVER: 'hover',
		CLICK: 'click'
	},

	/**
	 * Public function to either set up a tooltip programatically or update a tooltip should the one we need
	 * currently exists
	 *
	 * @param {DOMElement} targetElement - the element to which to attach the tooltip
	 * @param {String} message - the text to place inside the tooltip
	 * @param {boolean} [openInitial] - a flag indicating whether the tooltip should be exposed upon instantiation
	 * @param {String} [openOn] - an enum indicating how the tooltip should reveal itself on screen
	 * @param {String} [position] - the manner in which to position the tooltip
	 *
	 * @author kinsho
	 */
	setTooltip: function(targetElement, message, openInitial, openOn, position)
	{
		let tooltipElement = _tooltipCache[targetElement.id];

		// If the tooltip exists for the target element, simply update the text inside the tooltip
		if (tooltipElement)
		{
			if (document.getElementById(tooltipElement.options.content.id))
			{
				document.getElementById(tooltipElement.options.content.id).innerHTML = message;
			}
			else
			{
				// Update the metadata used to generate the tooltip should the tooltip not be rendered yet
				tooltipElement.options.content = _wrapMessage(targetElement.id, message);
			}
		}
		else
		{
			// Instantiate a new tooltip
			tooltipElement = new Tooltip(
			{
				target: targetElement,
				position: position || tooltipModule.TOOLTIP_POSITIONS.NORTH,
				content: _wrapMessage(targetElement.id, message),
				openOn: openOn || tooltipModule.TOOLTIP_OPEN_ON.CLICK,
				constrainToWindow: true,
				tetherOptions:
				{
					attachment: tooltipModule.TOOLTIP_POSITIONS.SOUTH,
					targetAttachment: tooltipModule.TOOLTIP_POSITIONS.NORTH,
					constraints:
					[{
						to: 'scrollParent',
						pin: true
					}]
				}
			});

			// Store the tooltip text inside the generated tooltip
			tooltipElement.mrMeta =
			{
				tooltipText: message
			};

			// Add the new tooltip to the cache to ensure we keep from duplicating it
			_tooltipCache[targetElement.id] = tooltipElement;

			// Now show the tooltip if the openInitial flag is set
			if (openInitial)
			{
				tooltipElement.open();
			}
		}
	},

	/**
	 * Public function that closes and destroys a constantly visible tooltip
	 *
	 * @param {DOMElement} targetElement - the element hosting the tooltip
	 * @param {boolean} destroyOnClose - a flag indicating whether the tooltip needs to be destroyed after fading from view
	 *
	 * @author kinsho
	 */
	closeTooltip: function(targetElement, destroyOnClose)
	{
		let tooltipElement = _tooltipCache[targetElement.id];

		if (tooltipElement)
		{
			tooltipElement.close();

			if (destroyOnClose)
			{
				// Set up a timeout to destroy this element so that we can let any transitions gracefully finish first
				window.setTimeout(() =>
				{
					tooltipElement.destroy();
				}, 500);

				// Make sure to clear the cache as well
				delete _tooltipCache[targetElement.id];
			}
		}
	},

	/**
	 * Public function to verify that a tooltip already exists for the given passed element
	 *
	 * @param {DOMElement} targetElement - the element for which to check to see if it hosts a tooltip
	 *
	 * @returns {boolean} - a flag indicating whether the passed element hosts a tooltip
	 *
	 * @author kinsho
	 */
	doesTooltipExist: function(targetElement)
	{
		return !!(_tooltipCache[targetElement.id]);
	},
};

// ----------------- EXPORT -----------------------------

export default tooltipModule;