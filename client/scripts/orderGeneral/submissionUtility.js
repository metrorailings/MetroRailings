// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderGeneral/viewModel';

import rQuery from 'client/scripts/utility/rQueryClient';

import designValidation from 'shared/designs/designValidation';

// ----------------- ENUMS/CONSTANTS ---------------------------

var DESIGN_ERRORS_CONTAINER = 'designErrorsContainer',
	DESIGN_ERRORS_TEMPLATE = 'designErrorsTemplate';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
var _designErrorsContainer = document.getElementById(DESIGN_ERRORS_CONTAINER);

// ----------------- HANDLEBAR TEMPLATES ---------------------------

/**
 * The partial to render design-validation errors on page
 */
var designErrorsTemplate = Handlebars.compile(document.getElementById(DESIGN_ERRORS_TEMPLATE).innerHTML);

// ----------------- LISTENERS ---------------------------

module.exports =
{
	/**
	 * Function responsible for validating that the design selections are valid when combined together. If not,
	 * measures will be taken to ensure that the user knows which designs are missing or unable to work together
	 *
	 * @returns {boolean} - a flag indicating whether the form is indeed valid
	 *
	 * @author kinsho
	 */
	validate: function()
	{
		var designErrorMessages = [],
			designObject = rQuery.copyObject(vm.design, true);

		// First check to see if the design selections made are valid
		designErrorMessages = designErrorMessages.concat(designValidation.testRequirements(designObject));
		designErrorMessages = designErrorMessages.concat(designValidation.testPrerequisites(designObject));
		designErrorMessages = designErrorMessages.concat(designValidation.testValues(designObject));

		// If the design selections are not valid, display all the reasons why the design choices is considered invalid
		_designErrorsContainer.innerHTML = designErrorsTemplate({ errors: designErrorMessages });
		if (designErrorMessages.length)
		{
			_designErrorsContainer.scrollIntoView({ behavior: 'smooth' });
		}

		return (designErrorMessages.length === 0);
	}
};