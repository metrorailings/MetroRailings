/**
 * A module containing a variety of functions and data structures pertaining to dates
 *
 * @module dateUtility
 */
// ----------------- MODULE DEFINITION --------------------------

let dateModule =
{
	ABBR_MONTHS:
	[
		'Jan',
		'Feb',
		'March',
		'April',
		'May',
		'June',
		'July',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	],

	FULL_MONTHS:
	[
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	],

	DAYS:
	[
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	],

	SHORT_DAYS:
	[
		'Sun',
		'Mon',
		'Tues',
		'Wed',
		'Thur',
		'Fri',
		'Sat'
	],

	/**
	 * Function responsible for finding the ordinal suffix that would naturally be associated
	 * with a given date
	 *
	 * @param {Number} date - the date for which to find an ordinal suffix
	 *
	 * @returns {String} - the ordinal suffix of the date
	 */
	findOrdinalSuffix: function(date)
	{
		if ((date % 10 === 1) && (date !== 11))
		{
			return 'st';
		}
		else if ((date % 10 === 2) && (date !== 12))
		{
			return 'nd';
		}
		else if ((date % 10 === 3) && (date !== 13))
		{
			return 'rd';
		}

		return 'th';
	},

	/**
	 * A function that formats the date to a concise user-friendly string
	 *
	 * @param {Date} date - the date to format
	 *
	 * @author kinsho
	 */
	formatShortDate: function(date)
	{
		return dateModule.SHORT_DAYS[date.getDay()] + ', ' + (date.getMonth() + 1) + '/' + date.getDate() + '/' + (date.getFullYear() - 2000);
	},

	/**
	 * A function that formats the date so that they can be programmatically set into a date input field
	 *
	 * @param {Date} date - the date to format
	 *
	 * @author kinsho
	 */
	formatForInputDate: function(date)
	{
		let dateString = '',
			month = date.getMonth(),
			day = date.getDate();

		dateString += date.getFullYear();
		dateString += '-';

		if (month < 9)
		{
			dateString += '0';
		}
		dateString += (month + 1);
		dateString += '-';

		if (day < 10)
		{
			dateString += '0';
		}
		dateString += day;

		return dateString;
	},

	/**
	 * A function that sorts two orders relative to one another by due dates
	 *
	 * @param {Object} a - the first order
	 * @param {Object} b - the second order
	 *
	 * @returns {Number} - a positive or negative number to indicate whether the first order comes before the second
	 * 		order
	 *
	 * @author kinsho
	 */
	sortByDueDates: function(a, b)
	{
		let aDateDefined = !!(a.dates.due),
			bDateDefined = !!(b.dates.due),
			aDueDate = new Date(a.dates.due),
			bDueDate = new Date(b.dates.due),
			aCreateDate = new Date(a.dates.created),
			bCreateDate = new Date(b.dates.created);

		// Orders with due dates come before orders with no due dates
		if ( !(aDateDefined) && !(bDateDefined) )
		{
			// If neither order has a defined due date, then sort by their creation dates
			return (aCreateDate < bCreateDate ? -1 : 1);
		}
		else if ( !(aDateDefined) )
		{
			return 1;
		}
		else if ( !(bDateDefined) )
		{
			return -1;
		}

		if (aDueDate < bDueDate)
		{
			return -1;
		}
		else if (bDueDate < aDueDate)
		{
			return 1;
		}
		else
		{
			// If both orders have the same due dates, then sort by their creation dates
			return (aCreateDate < bCreateDate ? -1 : 1);
		}
	}
};

// ----------------- EXPORT MODULE --------------------------

module.exports = dateModule;