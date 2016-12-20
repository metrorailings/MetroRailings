// ----------------- EXTERNAL MODULES --------------------------

var _cookieManager = require('cookie');

// ----------------- ENUMS/CONSTANTS --------------------------

// ----------------- PRIVATE VARIABLES --------------------------


// ----------------- I/O FUNCTION TRANSFORMATIONS --------------------------

// ----------------- MODULE DEFINITION --------------------------
module.exports =
{
	/**
	 * Function responsible for initializing a new cookie using the passed parameters
	 *
	 * @param {String} name - the name of the cookie
	 * @param {String} value - the JSON data to serialize into a cookie
	 *
	 * @returns {String} - a serialized cookie
	 *
	 * @author kinsho
	 */
	formCookie: function(name, value)
	{
		return _cookieManager.serialize(name, JSON.stringify(value), { path: '/' });
	},

	/**
	 * Function responsible for parsing a cookie from a client machine
	 *
	 * @param {String} cookie - the raw cookie to deserialize
	 *
	 * @returns {Object} - an unwrapped cookie object
	 *
	 * @author kinsho
	 */
	parseCookie: function(cookie)
	{
		return _cookieManager.parse(cookie);
	}
};