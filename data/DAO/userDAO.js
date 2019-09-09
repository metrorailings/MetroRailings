// ----------------- EXTERNAL MODULES --------------------------

let _crypto = require('crypto'),

	config = global.OwlStakes.require('config/config'),

	mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver'),
	cookieManager = global.OwlStakes.require('utility/cookies');

// ----------------- ENUMS/CONSTANTS --------------------------

const ADMINS_COLLECTION = 'admins',
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
	checkAdminCredentials: async function (username, password)
	{
		let dbResults,
			// The password has to be hashed first prior to verification
			hash = _crypto.createHmac('sha256', config.HASH_KEY).update(password).digest('hex');

		try
		{
			dbResults = await mongo.read(ADMINS_COLLECTION,
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
	},

	/**
	 * Function responsible for verifying whether the admin user has permission to visit a particular section of the
	 * admin platform
	 *
	 * @param {String} cookie - the cookie containing information about the user
	 * @param {String} pageName - the shortname of the page that user is trying to visit
	 *
	 * @returns {boolean} - a flag indicating whether the user has permission to visit the page indicated by the
	 * 		parameter
	 *
	 * @author kinsho 
	 */
	verifyAdminHasPermission: async function (cookie, pageName)
	{
		let username = cookieManager.retrieveAdminCookie(cookie)[0],
			dbResults,
			accessRights;

		try
		{
			// Retrieve the user's data from the database
			dbResults = await mongo.read(ADMINS_COLLECTION,
			{
				username: username
			});

			// Test whether the user is allowed to access the page in context
			accessRights = dbResults[0].access.split('|');
			for (let i = 0; i < accessRights.length; i += 1)
			{
				if (accessRights[i] === pageName)
				{
					return true;
				}
			}

			return false;
		}
		catch (error)
		{
			console.log('Ran into an error trying to get accessibility information about a particular user!');
			console.log(error);

			return false;
		}
	},

	/**
	 * Function responsible for fetching an admin user's landing page
	 *
	 * @param {String} cookie - the cookie containing information about the user
	 *
	 * @returns {String} - the shortname of the page that serves as the landing page for the user in context
	 *
	 * @author kinsho
	 */
	retrieveLandingPage: async function (cookie)
	{
		let username = cookieManager.retrieveAdminCookie(cookie)[0],
			dbResults;

		try
		{
			// Retrieve the user's data from the database
			dbResults = await mongo.read(ADMINS_COLLECTION,
			{
				username: username
			});

			return dbResults[0].landingPage;
		}
		catch (error)
		{
			console.log('Ran into an error trying to figure out + ' + username + '\'s landing page !');
			console.log(error);

			return false;
		}
	},

	/**
	 * Function responsible for retrieving all details for any given user
	 *
	 * @param {String} username - the user name from which we'll be retrieving all details
	 *
	 * @returns {Object} - the user record in full
	 *
	 * @author kinsho
	 */
	retrieveUserData: async function (username)
	{
		try
		{
			// Retrieve the user record from the back-end
			let dbResults = await mongo.read(ADMINS_COLLECTION,
			{
				username: username
			});

			return dbResults[0];
		}
		catch(error)
		{
			console.log('Ran into an error trying to get information about a particular user!');
			console.log(error);

			return false;
		}
	},

	/**
	 * Function responsible for storing a new administrator cookie into the database for future verification
	 *
	 * @param {String} username - the user name to associate with the cookie
	 * @param {String} cookie - the cookie to store into the database
	 * @param {String} userAgent - the user-agent string that will be used to associate this cookie only with the
	 * 		device currently logging in
	 *
	 * @returns {Boolean} - just a simple return value to indicate that the function has successfully stored
	 * 		the new cookie
	 *
	 * @author kinsho
	 */
	storeAdminCookie: async function (username, cookie, userAgent)
	{
		let cookieRecord =
			{
				username: username,
				// Ensure we only store the part of the cookie responsible for logging admins into the system
				cookie: cookieManager.parseCookie(cookie)[ADMIN_COOKIE],
				userAgent: userAgent
			};

		try
		{
			// Overwrite any old cookie records for the user in context, should one exists
			await mongo.bulkWrite(COOKIES_COLLECTION, true, mongo.formUpdateOneQuery({ username: username, userAgent: userAgent }, cookieRecord, true));

			return true;
		}
		catch(error)
		{
			console.log('Ran into an error when trying to store a new admin cookie!');
			console.log(error);

			return false;
		}
	},

	/**
	 * Function responsible for verifying that a cookie is a valid admin cookie
	 *
	 * @param {String} cookie - the cookie to test
	 * @param {String} userAgent - the user-agent string that will be used to verify that the cookie being tested
	 * 		belongs rightfully so to the device passing that cookie
	 *
	 * @returns {boolean} - indicating whether the cookie is still valid
	 *
	 * @author kinsho
	 */
	verifyAdminCookie: async function (cookie, userAgent)
	{
		let	username = cookieManager.retrieveAdminCookie(cookie)[0],
			dbResults;

		// Not finding a username is a sign that the user does not have a properly-formed admin cookie
		if ( !(username) )
		{
			return false;
		}

		try
		{
			dbResults = await mongo.read(COOKIES_COLLECTION,
			{
				username: username,
				// Search only against the part of the cookie responsible for logging in admins
				cookie: cookieManager.parseCookie(cookie)[ADMIN_COOKIE],
				userAgent: userAgent
			});

			return !!(dbResults.length);
		}
		catch(error)
		{
			console.log('Ran into an error when trying to verify an admin cookie!');
			console.log(error);

			return false;
		}
	},

	/**
	 * Function that returns a list of all users on this system
	 *
	 * @returns {Array<String>} - the collection of all user names currently active in the system
	 *
	 * @author kinsho
	 */
	collectAllUsers: async function ()
	{
		let dbResults;

		try
		{
			dbResults = await mongo.read(ADMINS_COLLECTION, {});

			return dbResults;
		}
		catch(error)
		{
			console.log('Ran into an error trying to fetch all active user names from the database!');
			console.log(error);

			return [];
		}
	},

	
};