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
		_cookieManager.serialize(name, JSON.stringify(value), { path: '/' });
	}
};