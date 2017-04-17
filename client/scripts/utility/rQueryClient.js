// ----------------- EXTERNAL MODULES --------------------------

import tooltipManager from 'client/scripts/utility/tooltip';

// ----------------- ENUM/CONSTANTS -----------------------------

var ERROR_CLASS = 'error';

// ----------------- PRIVATE VARIABLES -----------------------------

// ----------------- MODULE -----------------------------

var rQueryClient =
	{
		/**
		 * Function that finds the closest ancestor of an element that matches a given tag name
		 *
		 * @param {HTMLElement} el - the element from which to begin the search
		 * @param {String} tagName - the tag name that will guide the search for the closest ancestor
		 *
		 * @returns {HTMLElement} - the closest ancestor (of the passed element) that can be classified by the passed
		 * 		tag name
		 *
		 * @author kinsho
		 */
		closestElementByTag: function (el, tagName)
		{
			var parent = el.parentNode;

			while (parent)
			{
				if (parent.tagName === tagName.toUpperCase())
				{
					return parent;
				}

				parent = parent.parentNode;
			}
		},

		/**
		 * Function that finds the closest ancestor of an element that contains a given class
		 *
		 * @param {HTMLElement} el - the element from which to begin the search
		 * @param {String} tagName - the class name that will guide the search for the closest ancestor
		 *
		 * @returns {HTMLElement} - the closest ancestor (of the passed element) that contains the class
		 *
		 * @author kinsho
		 */
		closestElementByClass: function(el, className)
		{
			var parent = el.parentNode;

			while (parent)
			{
				if (parent.classList.contains(className))
				{
					return parent;
				}

				parent = parent.parentNode;
			}
		},

		/**
		 * Function that takes a set of related checkboxes and toggles their values depending on which one of the checkboxes
		 * is to be selected
		 *
		 * @param {Array<HTMLElements>} checkboxes - the set of related checkboxes
		 * @param {String} [selectedCheckboxID] - the ID of the checkbox which to set as selected. If empty, deselect all
		 * 		checkboxes
		 *
		 * @author kinsho
		 */
		setCheckboxSets: function (checkboxes, selectedCheckboxID)
		{
			var i;

			selectedCheckboxID = selectedCheckboxID || null;

			for (i = checkboxes.length - 1; i >= 0; i--)
			{
				checkboxes[i].checked = (checkboxes[i].id === selectedCheckboxID);
			}
		},

		/**
		 * Function that toggles the appearance of an input field depending on whether an invalid value has been detected
		 * inside the field
		 *
		 * @param {boolean} showError - the flag indicating whether the field needs to be marked as invalid
		 * @param {DOMElement} formField - the input field to mark up if invalid
		 * @param {String} errorMessage - the message to display should the field contain an invalid value
		 * @param {Set} [validationSet] - a set of form field IDs that denote which form fields currently have an erroneous value
		 * @param {DOMElement} [hintElement] - the hint element to load the error message into, should one be provided
		 *
		 * @author kinsho
		 */
		updateValidationOnField: function (showError, formField, errorMessage, validationSet, hintElement)
		{
			var tooltipExists = false;

			// If a hint element is not provided, just assume the form field itself is the element to attach a tooltip toward
			hintElement = hintElement || formField;

			tooltipExists = tooltipManager.doesTooltipExist(hintElement);

			// If no tooltip has been instantiated before for the form field in context and one is needed, then instantiate one
			// Keep in mind that we only need to flag something as an error once for an erroneous value
			if (showError && !(tooltipExists))
			{
				formField.classList.add(ERROR_CLASS);
				tooltipManager.setTooltip(hintElement, errorMessage, true, tooltipManager.TOOLTIP_OPEN_ON.ALWAYS);

				if (validationSet)
				{
					validationSet.add(formField.id);
				}
			}
			else if (!(showError) && tooltipExists)
			{
				formField.classList.remove(ERROR_CLASS);
				tooltipManager.closeTooltip(hintElement, true);

				if (validationSet)
				{
					validationSet.delete(formField.id);
				}
			}
		},

		/**
		 * Function properly sets the content of a form field given a value. It also resets an empty value into the field
		 * should the value passed alongside that form field be falsy
		 *
		 * @param {DOMElement} element - the form field that needs to be set
		 * @param {String} value - the value to set or justify the resetting of the form field
		 * @param {Set} [validationSet] - a set of form field IDs that denote which form fields currently have an erroneous value
		 *
		 * @author kinsho
		 */
		setField: function (element, value, validationSet)
		{
			element.value = (value ? value : '');

			// If a value is not present and the validation object is provided, remove the element's ID from that object
			// to note that it is no longer in an erroneous state
			if (!value && validationSet)
			{
				validationSet.delete(element.id);
			}
		},

		/**
		 * Function takes a view model object and ensures that every one of its enumerable properties is populated
		 * with some value
		 *
		 * @params {Object} viewModel - the view model to be evaluated
		 * @param {Set} [validationSet] - a set of form field IDs that denote which form fields currently have an erroneous value
		 *
		 * @returns {boolean} - a flag indicating whether the view model is in a valid state
		 *
		 * @author kinsho
		 */
		validateModel: function (viewModel, validationSet)
		{
			viewModel = viewModel || {};

			// If a validation set has been passed, check the set to see if there are any fields within the set
			// that were marked as invalid
			if (validationSet && validationSet.size)
			{
				return false;
			}

			for (var i in viewModel)
			{
				// Check whether the property in context has a falsy value that is not explicitly a boolean value
				if ( !(viewModel[i]) && viewModel !== false )
				{
					return false;
				}

				// Check whether the property is simply a string comprised solely of space characters
				if ( !((viewModel[i] + '').trim().length) )
				{
					return false;
				}
			}

			// The view model has successfully passed validation testing
			return true;
		},

		/**
		 * Function that capitalizes the first letter of whatever string is passed to it
		 *
		 * @param {String} str - the string whose first letter is to be capitalized
		 *
		 * @returns {String} - the capitalized string that was passed into the function
		 */
		capitalize: function (str)
		{
			return str.charAt(0).toUpperCase() + str.slice(1);
		},

		/**
		 * Function that checks whether a particular string begins with a specific set of characters
		 *
		 * @param {String} str - the string which to inspect
		 * @param {String} phrase - the set of characters for which we will check for at the very beginning of the
		 * 		passed string
		 *
		 * @returns {boolean} - a value indicating whether the passed string begins with the passed phrase
		 *
		 * @author kinsho
		 */
		beginsWith: function (str, phrase)
		{
			return(str.indexOf(phrase) === 0);
		},

		/**
		 * Function takes a generator function and returns a wrapper function over that generator that can then be used
		 * to execute that entire generator function in one invocation
		 *
		 * @param {Function} genFunc - the generator function to wrap
		 *
		 * @returns {Function} - the wrapper function that will be used to effectively execute the entirety of that
		 * 		generator function in one go
		 *
		 * @author kinsho
		 */
		runToFinish: function (genFunc)
		{
			// Keep in mind the thisContext refers to what "this" should be set to when the generator function is invoked
			return (thisContext) => {

				var genIter,
					progress;

				return new Promise((resolve) =>
				{
					// Function meant to run the generator function until it reaches a breakpoint
					function runIter()
					{
						progress = genIter.next();

						// Once we're done running the generator function, simply return whatever was the final value
						// returned from the generator
						if (progress.done)
						{
							resolve(progress.value);
						}
						// Else assume that we are waiting on some asynchronous logic to execute before further continuing
						// with the generator
						else
						{
							progress.value.then(() =>
							{
								runIter();
							});
						}
					}


					genIter = genFunc.apply(thisContext, [...arguments].slice(1));

					runIter();
				});
			};
		}
	};

// ----------------- EXPORT -----------------------------

export default rQueryClient;