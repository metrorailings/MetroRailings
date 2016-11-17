/**
 * @module objectHelper
 */

// ----------------- MODULE DEFINITION --------------------------

module.exports = {

	/**
	 * Function that determines whether a piece of data is an object
	 *
	 * @param {any} val - the value to test
	 *
	 * @returns {boolean} - a flag indicating whether the passed value is an object
	 */
	isObject: function (val)
	{
		if (val === null)
		{
			return false;
		}

		return ( (typeof val === 'function') || (typeof val === 'object') );
	},

	/**
	 * Function that clones an object in its entirety
	 *
	 * @param {Object} obj - the object to clone
	 *
	 * @returns {Object} - a copy of the passed object
	 */
	cloneObject: function (obj)
	{
		var keys = Object.keys(obj || {}), clone = {}, i;

		for (i = 0; i < keys.length; i++) {

			// If a property of the object being cloned references another object, make sure to clone that
			// object as well
			if (this.isObject(obj[keys[i]]))
			{
				clone[keys[i]] = this.cloneObject(obj[keys[i]]);
			}

			clone[keys[i]] = obj[keys[i]];
		}

		return clone;
	}
};
