// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),
	_crypto = require('crypto'),

	config = global.OwlStakes.require('config/config'),

	mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver'),
	cookieManager = global.OwlStakes.require('utility/cookies');

// ----------------- ENUMS/CONSTANTS --------------------------

var ADMINS_COLLECTION = 'admins',
	COOKIES_COLLECTION = 'cookies',

	ADMIN_COOKIE = 'owl';

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
	checkAdminCredentials: _Q.async(function* (username, password)
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
	 * @returns {Boolean} - just a simple return value to indicate that the function has successfully stored
	 * 		the new cookie
	 *
	 * @author kinsho
	 */
	storeAdminCookie: _Q.async(function* (username, cookie)
	{
		var cookieRecord =
			{
				username: username,
				// Ensure we only store the part of the cookie responsible for logging admins into the system
				cookie: cookieManager.parseCookie(cookie)[ADMIN_COOKIE]
			};

		try
		{
			// Overwrite any old cookie records for the user in context, should one exists
			yield mongo.bulkWrite(COOKIES_COLLECTION, true, mongo.formUpdateOneQuery({ username: username }, cookieRecord, true));

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
	 * Function responsible for verifying that a cookie is a valid admin cookie
	 *
	 * @param {String} cookie - the cookie to test
	 *
	 * @returns {boolean} - indicating whether the cookie is still valid
	 *
	 * @author kinsho
	 */
	verifyAdminCookie: _Q.async(function* (cookie)
	{
		var	username = cookieManager.retrieveAdminCookie(cookie)[0],
			dbResults;

		// Not finding a username is a sign that the user does not have a properly-formed admin cookie
		if ( !(username) )
		{
			return false;
		}

		try
		{
			dbResults = yield mongo.read(COOKIES_COLLECTION,
			{
				username: username,
				// Search only against the part of the cookie responsible for logging in admins
				cookie: cookieManager.parseCookie(cookie)[ADMIN_COOKIE]
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