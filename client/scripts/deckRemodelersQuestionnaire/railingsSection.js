// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/deckRemodelersQuestionnaire/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

const OPTION_PICKER_ITEM_HEADER = 'optionPickerItemHeader',
	OPTION_PICKER_IMAGE = 'optionPickerImage',

	HIGHLIGHT_CLASS = 'highlight';

// ----------------- PRIVATE MEMBERS ---------------------------

// Elements
let _optionPickerItemHeaders = document.getElementsByClassName(OPTION_PICKER_ITEM_HEADER),
	_optionPickerImages = document.getElementsByClassName(OPTION_PICKER_IMAGE);

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for updating the view model to reflect whatever design option was selected
 *
 * @param {Event} event - the event responsible for triggering the function
 *
 * @author kinsho
 */
function setProperty(event)
{
	let currentTarget = event.currentTarget,
		itemContainer = currentTarget.parentNode,
		allItems = itemContainer.parentNode.children,
		propertyName = itemContainer.dataset.name,
		propertyValue = itemContainer.dataset.value;

	// Set the view model accordingly
	vm.design[propertyName] = propertyValue;

	// Adjust the view to indicate clearly which design option was selected
	for (let i = 0; i < allItems.length; i += 1)
	{
		if (allItems[i].dataset.value === propertyValue)
		{
			allItems[i].getElementsByClassName(OPTION_PICKER_IMAGE)[0].classList.add(HIGHLIGHT_CLASS);
		}
		else
		{
			allItems[i].getElementsByClassName(OPTION_PICKER_IMAGE)[0].classList.remove(HIGHLIGHT_CLASS);
		}
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

for (let i = _optionPickerItemHeaders.length - 1; i >= 0; i -= 1)
{
	_optionPickerImages[i].addEventListener('click', setProperty);
	_optionPickerItemHeaders[i].addEventListener('click', setProperty);
}

// ----------------- DATA INITIALIZATION -----------------------------

vm.design = {};