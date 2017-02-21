/**
 * A module containing a variety of functions and data structures pertaining to dates
 *
 * @module dateUtility
 */
// ----------------- MODULE DEFINITION --------------------------

module.exports =
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
	}
}