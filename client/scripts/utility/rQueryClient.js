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
	}
};

// ----------------- EXPORT -----------------------------

export default rQueryClient;