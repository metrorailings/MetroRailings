// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderGeneral/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var DISABLED_CLASS = 'disabled',

	DESCRIPTIVE_SECTION_CLASS = 'descriptiveSection',
	TEXTAREA_CLASS = 'descriptiveText';

// ----------------- LISTENERS ---------------------------

/**
 * Function responsible for toggling the visibility of a descriptor section adjacent to any design field
 *
 * @param {Event} event - the event that triggered the invocation of this function
 *
 * @author kinsho
 */
function toggleDescriptor(event)
{
	// Always assume that the descriptive section immediately follows the design field inside the DOM tree
	var designField = event.currentTarget,
		descriptiveSection = designField.nextElementSibling,
		selectedOption = designField.selectedOptions[0],
		description = (selectedOption ? selectedOption.dataset.description || '' : ''),
		textarea = descriptiveSection.getElementsByClassName(TEXTAREA_CLASS)[0];

	if (designField.value && description)
	{
		// Populate the descriptive text field with the default description that has been written for for that
		// particular design choice
		textarea.value = description;
		textarea.disabled = false;

		descriptiveSection.classList.remove(DISABLED_CLASS);
	}
	else
	{
		// Blanke out and disable the text field
		textarea.value = '';
		textarea.disabled = true;

		descriptiveSection.classList.add(DISABLED_CLASS);
	}

	// Update the view model as well with whatever updates have been made in that description field
	setDescriptorText({ currentTarget: textarea });
}

/**
 * Function responsible for setting the description text into our view model
 *
 * @param {Event} event - the event that triggered the invocation of this function
 *
 * @author kinsho
 */
function setDescriptorText(event)
{
	var descField = event.currentTarget,
		descText = descField.value,
		designField = descField.parentNode.previousElementSibling,
		fieldName = designField.dataset.fieldName;

	// Associate the description text with the correct design setting
	vm.designDescriptions[fieldName] = descText;
}

// ----------------- INITIALIZATION ---------------------------

var descriptionSections = document.getElementsByClassName(DESCRIPTIVE_SECTION_CLASS),
	textarea;

for (let i = 0; i < descriptionSections.length; i += 1)
{
	// For all design dropdowns that are followed by a description section, link the toggler function to each of
	// those design dropdowns
	descriptionSections[i].previousElementSibling.addEventListener('change', toggleDescriptor);

	// Also link the description area to a view model listener
	textarea = descriptionSections[i].getElementsByClassName(TEXTAREA_CLASS)[0];
	textarea.addEventListener('change', setDescriptorText);

	// If the textarea has been initialized with some text, load that text into the appropriate property inside the
	// view model
	if (textarea.value)
	{
		setDescriptorText({ currentTarget: textarea });
	}

	// If the descriptive section has been tagged as disabled by default, just disable it upon page initialization
	if (descriptionSections[i].dataset.disabled)
	{
		textarea.disabled = true;
	}
}