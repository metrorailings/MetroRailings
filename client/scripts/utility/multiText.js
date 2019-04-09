/**
 * @main multiText
 */

// ----------------- EXTERNAL MODULES --------------------------

import rQueryClient from 'client/scripts/utility/rQueryClient';

// ----------------- ENUMS/CONSTANTS --------------------------

const MULTITEXT_EXISTING_VALUES = 'multitextExistingValues',
	MULTITEXT_DEFAULT_VALUE = 'multitextDefaultValue',

	REMOVE_ICON = 'fa-times',
	SET_VALUE_TEMPLATE = 'multitextSetValueTemplate';


// ----------------- HANDLEBAR TAMPLES ---------------------------

/**
 * The partial to render existing values into a multitext field
 */
let _setValueTemplate = Handlebars.compile(document.getElementsByClassName(SET_VALUE_TEMPLATE)[0].innerHTML);

// ----------------- MULTITEXT OBJECT ---------------------------

/**
 * Constructor in order to set up JavaScript logic on multitext elements
 *
 * @param {Object} vm - the view model which will have one of its properties modified through this multitext
 * 		element
 * @param {String} modelName - the name of the property within the view model which will be set by this multitext
 * @param {HTMLElement} element - the multitext element container
 *
 * @author kinsho
 */
function multitextConstructor(vm, modelName, element)
{
	let settledValuesContainer = element.getElementsByClassName(MULTITEXT_EXISTING_VALUES)[0],
		removeIcons = settledValuesContainer.getElementsByClassName(REMOVE_ICON),
		textarea = element.getElementsByTagName('textarea')[0],

		/**
		 * Listener records a new value into the view model datafield associated with this multitext
		 *
		 * @param {Event} event - the event that triggered the invocation of this method
		 *
		 * @author kinsho
		 */
		recordValue = function(event)
		{
			let textfield = event.currentTarget,
				value = textfield.value;
	
			// Update the view model to account for the new value
			vm[modelName] = (vm[modelName] ? vm[modelName] + ',' + value : value);
	
			// Update the HTML element to set the new value into place
			setNewValue(value);
	
			// Blank out the textarea
			textarea.value = '';
		},
		/**
		 * Listener records a new value depending on whether a comma was typed into a multitext
		 *
		 * @param {Event} event - the event that triggered the invocation of this method
		 *
		 * @author kinsho
		 */
		detectComma = function(event)
		{
			// A comma was pressed
			if (event.key === 188 || event.which === 188)
			{
				recordValue(event);
				return false;
			}
	
			return true;
		},
		/**
		 * Listener wipes out whatever values are in the multitext textarea
		 *
		 * @param {Event} event - the event that triggered the invocation of this method
		 */
		blankOutTextArea = function(event)
		{
			// A comma was pressed
			if (event.key === 188 || event.which === 188)
			{
				textarea.value = '';
			}
		},
		/**
		 * Listener that removes a settled value from the multitext element as well as the view model
		 *
		 * @param {Event} event - the event that triggered the invocation of this method
		 *
		 * @author kinsho
		 */
		removeSettledValue = function(event)
		{
			let setValueContainer = event.currentTarget.parentNode,
				value = setValueContainer.dataset.value,
				vmValues = vm[modelName].split(',');
	
			// Modify the HTML element itself to remove the value from view
			setValueContainer.parentNode.removeChild(setValueContainer);
	
			// Modify the view model to account for the removed value
			vmValues = rQueryClient.pruneElementFromArray(vmValues, value);
			vm[modelName] = vmValues.join(',');
		},
		/**
		 * Listener that sets a new value into the multitext
		 *
		 * @param {String} value - the value to insert as a settled value into the multitext
		 *
		 * @author kinsho
		 */
		setNewValue = function(value)
		{
			let removeIcons;

			settledValuesContainer.innerHTML += _setValueTemplate({ value: value });

			// Set up a listener on all the remove icons now that we modified the HTML
			removeIcons = settledValuesContainer.getElementsByClassName(REMOVE_ICON);

			for (let i = 0; i < removeIcons.length; i += 1)
			{
				removeIcons[i].addEventListener('click', removeSettledValue);
			}
		};

	// Record the default value in this multitext element into the view model
	vm[modelName] = element.getElementsByClassName(MULTITEXT_DEFAULT_VALUE)[0].value;

	/* ------------------- LISTENERS ------------------------- */

	textarea.addEventListener('change', recordValue);
	textarea.addEventListener('keydown', detectComma);
	textarea.addEventListener('keyup', blankOutTextArea);

	for (let i = 0; i < removeIcons.length; i += 1)
	{
		removeIcons[i].addEventListener('click', removeSettledValue);
	}
}

// ----------------- PAGE INITIALIZATION --------------------------

let setValueTemplates = document.getElementsByClassName(SET_VALUE_TEMPLATE);

// Given that the template may be invoked several times in any given page, we have a scenario in which the
// handlebars template for generating a new value may be replicated on the page
// Delete all the extra definitions of the set value template
for (let i = 0; i < setValueTemplates.length - 1; i += 1)
{
	setValueTemplates[i].parentNode.removeChild(setValueTemplates[i]);
}

// ----------------- EXPORT MODULE --------------------------

export default multitextConstructor;