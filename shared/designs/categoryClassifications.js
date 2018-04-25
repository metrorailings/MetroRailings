/**
 * A module listing all category classification codes
 *
 * @module categoryClassifications
 */
// ----------------- MODULE DEFINITION --------------------------

var classifications =
	{
		TYPE :
		{
			CODE: 'T',
			CATEGORY_TEXT: 'Type'
		},
		POST :
		{
			CODE: 'P',
			CATEGORY_TEXT: 'Post'
		},
		CONTRACTOR :
		{
			CODE: 'CON',
			CATEGORY_TEXT: 'Contractor'
		},

		/**
		 * Function responsible for finding the category text that corresponds to a given code
		 *
		 * @param {String} code - the code that will be used to guide the search
		 *
		 * @returns {String} - the user-friendly category text that corresponds to the passed code
		 *
		 * @author kinsho
		 */
		findCategoryTextByCode: function(code)
		{
			var categories = Object.keys(classifications);

			// Cycle through each category to find the category text that relates to the given code
			for (let i = 0; i < categories.length; i++)
			{
				// Ignore the reference to this function
				if (categories[i] === 'findCategoryTextByCode')
				{
					continue;
				}

				if (classifications[categories[i]].CODE === code)
				{
					return classifications[categories[i]].CATEGORY_TEXT;
				}
			}

			return '';
		}

	};

// ----------------- EXPORT --------------------------

module.exports = classifications;