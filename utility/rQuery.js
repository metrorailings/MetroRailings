/**
 * @module rQuery
 */

// ----------------- EXTERNAL MODULES --------------------------

var _randomstring = require('randomstring');

// ----------------- ENUM/CONSTANTS -----------------------------

var RANDOM_ALPHA_3 =
	{
		length: 3,
		charset: 'alphabetic'
	},
	RANDOM_ALPHA_4 =
	{
		length: 4,
		charset: 'alphabetic'
	},

	NUMBERS = '0123456789';

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
				cloneObj[keys[i]] = this.copyObject(obj[keys[i]]);
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
	 * Function that merges a source object into a destination object
	 *
	 * @param {Object} srcObj - the source object
	 * @param {Object} destObj - the destination object
	 *
	 * @returns {Object} - the merged object
	 *
	 * @author kinsho
	 */
	mergeObjects: function(srcObj, destObj)
	{
		var srcKeys = Object.keys(srcObj),
			i;

		for (i = srcKeys.length - 1; i >= 0; i--)
		{
			// If the property being copied over refers to an object, recursively call this method again on that
			// particular property
			if (this.isObject( destObj[srcKeys[i]] ))
			{
				this.mergeObjects(srcObj[srcKeys[i]], destObj[srcKeys[i]]);
			}
			else
			{
				destObj[srcKeys[i]] = srcObj[srcKeys[i]];
			}
		}

		return destObj;
	},

	/**
	 * Function that determines whether a given string qualifies as a JSON string
	 *
	 * @param {String} str - the string to test
	 *
	 * @returns {Boolean} - a flag indicating whether the string adheres to the JSON format
	 *
	 * @author kinsho
	 */
	isJSON: function(str)
	{
		try
		{
			JSON.parse(str);
			return true;
		}
		catch(error)
		{
			return false;
		}
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
		var numStr = num + '',
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
	 * Function that unscrambles numerical data from a collection of random characters
	 *
	 * @param {String} str - the information to essentially decrypt
	 *
	 * @returns {String} - the number by itself
	 *
	 * @author kinsho
	 */
	decryptNumbers: function(str)
	{
		var num = '';

		// Loop through each character in the string in order to parse out the digits from the alphabetical characters
		for (let i = 0; i < str.length; i += 1)
		{
			if (NUMBERS.indexOf(str[i]) !== -1)
			{
				num += str[i];
			}
		}

		return num;
	}
};