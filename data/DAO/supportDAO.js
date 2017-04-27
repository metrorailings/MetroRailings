// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),

	mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver');

// ----------------- ENUMS/CONSTANTS --------------------------

var CONTACT_US_COLLECTION = 'contactUs';

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function responsible for storing a new contact request into the database
	 *
	 * @param {Object} data - the request data to push into the database
	 *
	 * @returns {Boolean} - just a simple return value to indicate that the function has successfully stored
	 * 		the new support request
	 *
	 * @author kinsho
	 */
	insertNewContactRequest: _Q.async(function* (data)
	{
		try
		{
			// Insert a new contact request into the database
			yield mongo.bulkWrite(CONTACT_US_COLLECTION, true, mongo.formInsertSingleQuery(data));

			return true;
		}
		catch(error)
		{
			console.log('Ran into an error when trying to store a new contact support request!');
			console.log(error);

			return false;
		}
	})
};