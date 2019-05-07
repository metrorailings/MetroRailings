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
		'Weds',
		'Thurs',
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
	}
};

// ----------------- EXPORT MODULE --------------------------

module.exports = dateModule;