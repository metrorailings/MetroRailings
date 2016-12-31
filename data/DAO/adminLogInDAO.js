// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),
	_crypto = require('crypto'),
	config = global.OwlStakes.require('config/config'),
	mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver');

// ----------------- ENUMS/CONSTANTS --------------------------

var ADMINS_COLLECTION = 'admins',
	COOKIES_COLLECTION = 'cookies';

// ----------------- MODULE DEFINITION --------------------------
module.exports =
{
	/**
	 * Function responsible for authenticating credentials to determine whether the user is an admin
	 *
	 * @param {String} username - the user name to test
	 * @param {String} password - the password to test
	 *
	 * @returns {boolean} - a flag indicating whether the user name and password combinations matches that of
	 * 		a known admin in the database
	 *
	 * @author kinsho
	 */
	checkCredentials: _Q.async(function* (username, password)
	{
		var dbResults,
			// The password has to be hashed first prior to verification
			hash = _crypto.createHmac('sha256', config.HASH_KEY).update(password).digest('hex');

		try
		{
			dbResults = yield mongo.read(ADMINS_COLLECTION,
			{
				username: username,
				password: hash
			});

			return !!(dbResults.length);
		}
		catch(error)
		{
			console.log('Ran into an error when trying to validate admin credentials!');
			console.log(error);

			return false;
		}
	}),

	/**
	 * Function responsible for storing new administrator cookies into the database for future verification
	 *
	 * @param {String} username - the user name to associate with the cookie
	 * @param {String} cookie - the cookie to store into the database
	 *
	 * @returns {boolean} - just a simple return value to indicate that the function has successfully stored
	 * 		the new cookie
	 *
	 * @author kinsho
	 */
	storeCookie: _Q.async(function* (username, cookie)
	{
		var cookieRecord =
			{
				username: username,
				cookie: cookie
			};

		try
		{
			yield mongo.bulkWrite(COOKIES_COLLECTION, true, mongo.formInsertSingleQuery(cookieRecord));

			return true;
		}
		catch(error)
		{
			console.log('Ran into an error when trying to store a new admin cookie!');
			console.log(error);

			return false;
		}
	}),

	/**
	 * Function responsible for verifying that a cookie and user name combination is valid
	 *
	 * @param {String} username - the user name to test
	 * @param {String} cookie - the cookie to test
	 *
	 * @returns {boolean} - indicating whether the cookie is still valid
	 *
	 * @author kinsho
	 */
	verifyCookie: _Q.async(function* (username, cookie)
	{
		var dbResults;

		try
		{
			dbResults = yield mongo.read(COOKIES_COLLECTION,
			{
				username: username,
				cookie: cookie
			});

			return !!(dbResults.length);
		}
		catch(error)
		{
			console.log('Ran into an error when trying to verify an admin cookie!');
			console.log(error);

			return false;
		}
	})
};