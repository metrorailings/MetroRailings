// ----------------- EXTERNAL MODULES --------------------------

// ----------------- ENUMS/CONSTANTS --------------------------

// ----------------- PRIVATE VARIABLES --------------------------

var _numbers = '0123456789';

// ----------------- I/O FUNCTION TRANSFORMATIONS --------------------------

// ----------------- MODULE DEFINITION --------------------------
module.exports =
{
	/**
	 * Function that returns a disparate copy of an object
	 *
	 * @param {Object} obj - the object to copy
	 *
	 * @returns {Object} a memory-distinct duplicate of the passed object
	 *
	 * @author kinsho
	 */
	copyObject: function (obj)
	{
		var keys = Object.keys(obj || {}),
			cloneObj = {},
			i;

		for (i = 0; i < keys.length; i++)
		{
			// If the property is itself an object, run this function recursively on that property
			if ((typeof obj[keys[i]] === 'object') && (obj[keys[i]] !== null))
			{
				cloneObj[keys[i]] = this.copy(obj[keys[i]]);
			}
			else
			{
				cloneObj[keys[i]] = obj[keys[i]];
			}
		}

		return cloneObj;
	},

	/**
	 * Function that compiles all the key-value pairs of an object into a two-dimensional array
	 *
	 * @param {Object} obj - the object whose key-value pairs will be copied into a two-dimensional array
	 *
	 * @returns {Array} - an indexed collection of all the entries of the passed object
	 *
	 * @author kinsho
	 */
	findObjectEntries: function (obj)
	{
		var keys = Object.keys(obj),
			entries = [],
			i;

		for (i = 0; i < keys.length; i++)
		{
			entries.push([keys[i], obj[keys[i]]]);
		}

		return entries;
	},

	/**
	 * Function that assesses whether a string is entirely composed of numbers
	 *
	 * @param {String} str - the string to evaluate
	 *
	 * @returns {Boolean} - a flag indicating whether the string is entirely comprised of numbers
	 *
	 * @author kinsho
	 */
	isStringEntirelyNumeric: function (str)
	{
		str = str + '' || '';

		for (var i = str.length - 1; i >= 0; i--)
		{
			if (_numbers.indexOf(str[i]) === -1)
			{
				return false;
			}
		}

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
	}
};