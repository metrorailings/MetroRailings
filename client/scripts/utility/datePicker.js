// ----------------- MODULE ---------------------------

let datepickerModule =
{
	POSITION:
	{
		TOP_RIGHT : 'tr',
		TOP_LEFT : 'tl',
		BOTTOM_RIGHT : 'br',
		BOTTOM_LEFT : 'bl'
	},

	/**
	 * Constructor function to instantiate a new datepicker on the page
	 *
	 * @param {HTMLElement} element - the input element that will need the datepicker widget
	 * @param {Function} selectFunc - the function to invoke when a new date is selected within the datepicker
	 * @param {Function} formatFunc - the function that will format the way the date is conveyed within the input element
	 * @param {String} position - the relative positioning of the datepicker widget
	 * @param {Date} [initialDate] - if provided, the calendar will initiate with this date already selected
	 *
	 * @author kinsho
	 */
	initiateDatepicker: function(element, selectFunc, formatFunc, position, initialDate)
	{
		try
		{
			// Instantiate the datepicker
			datepicker(element,
			{
				onSelect : selectFunc,
				formatter : formatFunc,
				position : position,
				dateSelected : initialDate || null,
				disableYearOverlay : true
			});
		}
		catch (error)
		{
			console.error('Running into trouble initiating a datepicker here...');
			console.error(error);
		}
	}
};

// ----------------- EXPORT ---------------------------

export default datepickerModule;