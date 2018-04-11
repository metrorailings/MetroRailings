// ----------------- EXTERNAL MODULES --------------------------

var mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver');

// ----------------- ENUMS/CONSTANTS --------------------------

var CONVENTION_COLLECTION = 'conventionContacts';

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function responsible for storing conference contacts into the database
	 *
	 * @param {Object} data - the information to push into the database
	 *
	 * @returns {Boolean} - just a simple return value to indicate that the function has successfully stored
	 * 		the new support request
	 *
	 * @author kinsho
	 */
	insertNewContact: async function (data)
	{
		try
		{
			// Insert a new contact request into the database
			await mongo.bulkWrite(CONVENTION_COLLECTION, true, mongo.formInsertSingleQuery(data));

			return true;
		}
		catch(error)
		{
			console.log('Ran into an error when trying to store a new contact support request!');
			console.log(error);

			return false;
		}
	}
};