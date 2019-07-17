// ----------------- EXTERNAL MODULES --------------------------

import _randomstring from 'randomstring';

import tooltipManager from 'client/scripts/utility/tooltip';

// ----------------- ENUM/CONSTANTS -----------------------------

const ERROR_CLASS = 'error',

	RANDOM_ALPHA_3 =
	{
		length: 3,
		charset: 'alphabetic'
	},
	RANDOM_ALPHA_4 =
	{
		length: 4,
		charset: 'alphabetic'
	};

// ----------------- MODULE -----------------------------

let rQueryClient =
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
		let parent = el.parentNode;

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
		let parent = el.parentNode;

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
		selectedCheckboxID = selectedCheckboxID || null;

		for (let i = checkboxes.length - 1; i >= 0; i--)
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
		let tooltipExists;

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
		if (element.value !== value)
		{
			element.value = (value ? value : '');
		}

		// If a value is not present and the validation object is provided, remove the element's ID from that object
		// to note that it is no longer in an erroneous state
		if (!value && validationSet)
		{
			validationSet.delete(element.id);
		}
	},

	/**
	 * Function properly sets the value of a toggle switch given the truthiness of a value.
	 *
	 * @param {DOMElement} element - the toggle switch radio buttons that need to be set
	 * @param {String} value - the value to set
	 *
	 * @author kinsho
	 */
	setToggleField: function(toggleSet, value)
	{
		if (value)
		{
			toggleSet[0].checked = true;
			toggleSet[1].checked = false;
		}
		else
		{
			toggleSet[0].checked = false;
			toggleSet[1].checked = true;
		}
	},

	/**
	 * Function properly disables a toggle switch
	 *
	 * @param {DOMElement} element - the toggle switch radio buttons that need to be disabled
	 *
	 * @author kinsho
	 */
	disableToggleField: function(toggleSet)
	{
		toggleSet[0].disabled = true;
		toggleSet[1].disabled = true;
	},

	/**
	 * Function properly enables a toggle switch
	 *
	 * @param {DOMElement} element - the toggle switch radio buttons that need to be enabled
	 *
	 * @author kinsho
	 */
	enableToggleField: function(toggleSet)
	{
		toggleSet[0].disabled = false;
		toggleSet[1].disabled = false;
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

		for (let i in viewModel)
		{
			// If the property is an internal copy of a field, simply ignore testing the value that particular property
			if (i.indexOf('__') > -1)
			{
				continue;
			}

			// Check whether the property in context has a falsy value that is not explicitly a boolean value
			if ( !(viewModel[i]) && viewModel[i] !== false )
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
	 * Function that checks whether a particular value qualifies as an object
	 *
	 * @param {*} val - the value to inspect
	 *
	 * @returns {boolean} - a value indicating whether the passed value is indeed an object
	 *
	 * @author kinsho
	 */
	isObject: function(val)
	{
		return (val === Object(val));
	},

	/**
	 * Function that returns a disparate copy of an object
	 *
	 * @param {Object} obj - the object to copy
	 * @param {boolean} pruneFalsy - a flag indicating whether to strip all falsy properties from the object
	 *
	 * @returns {Object} a memory-distinct duplicate of the passed object
	 *
	 * @author kinsho
	 */
	copyObject: function (obj, pruneFalsy)
	{
		let keys = Object.keys(obj || {}),
			cloneObj = {};

		for (let i = 0; i < keys.length; i += 1)
		{
			// If the property is itself an object, run this function recursively on that property
			if ((typeof obj[keys[i]] === 'object') && (obj[keys[i]] !== null))
			{
				cloneObj[keys[i]] = this.copyObject(obj[keys[i]]);
			}
			else if ( pruneFalsy && !(obj[keys[i]]) )
			{
				continue;
			}
			else
			{
				cloneObj[keys[i]] = obj[keys[i]];
			}
		}

		return cloneObj;
	},

	/**
	 * Despite the sexual connotation, the function only removes any private properties an object may have
	 *
	 * @param {Object} obj - the object to modify
	 *
	 * @returns {Object} - the object in modified form, should there have been any private properties that
	 * 		needed to be removed
	 *
	 * @author kinsho
	 */
	prunePrivateMembers: function (obj)
	{
		let keys = Object.keys(obj || {});

		// Assume all private members have a reference name that starts with an underscore
		for (let i = 0; i < keys.length; i += 1)
		{
			if (keys[i][0] === '_')
			{
				delete obj[keys[i]];
			}
		}

		return obj;
	},

	/**
	 * Function that scrambles numerical data with alphabetical characters
	 *
	 * @param {String | Number} num - the number to veil
	 *
	 * @returns {String} - a string of seemingly jumbled text that contains the digits of the number we have to hide
	 * 		(in order)
	 *
	 * @author kinsho
	 */
	obfuscateNumbers: function(num)
	{
		let numStr = num + '',
			jumble = '';

		for (let i = 0; i < numStr.length; i += 1)
		{
			// Figure out whether to insert 3 or 4 random characters into the mix depending on our position in this loop
			if (i % 2)
			{
				jumble += _randomstring.generate(RANDOM_ALPHA_3);
			}
			else
			{
				jumble += _randomstring.generate(RANDOM_ALPHA_4);
			}

			jumble += numStr[i];
		}

		// Pad the jumbled-up text some more just for further obfuscation
		jumble += _randomstring.generate(RANDOM_ALPHA_4);

		return jumble;
	},

	/**
	 * Function that prunes a primitive value from a collection
	 *
	 * @param {Array<Number | String>} arr - the collection to loop through
	 * @param {String | Number} value - the value to remove from the collection
	 *
	 * @returns {Array} - the modified array
	 *
	 * @author kinsho
	 */
	pruneElementFromArray: function(arr, value)
	{
		for (let i = arr.length - 1; i >= 0; i -= 1)
		{
			if (arr[i] === value)
			{
				arr.splice(i, 1);
			}
		}

		return arr;
	}
};

// ----------------- EXPORT -----------------------------

export default rQueryClient;