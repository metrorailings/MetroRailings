// ----------------- EXTERNAL MODULES --------------------------

var mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver');

// ----------------- ENUMS/CONSTANTS --------------------------

var UPWAVE_COLLECTION = 'upwave';

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function responsible for temporarily storing upwave cards into the database for caching purposes
	 *
	 * @param {Object} data - the data to push into the database
	 *
	 * @returns {Boolean} - just a simple return value to indicate that the function has successfully stored
	 * 		the upwave data
	 *
	 * @author kinsho
	 */
	insertUpwaveData: async function (data)
	{
		try
		{
			// Specify the time this document was inserted into the database
			data.createdOn = new Date();

			// Insert a new contact request into the database
			await mongo.bulkWrite(UPWAVE_COLLECTION, true, mongo.formInsertSingleQuery(data));

			return true;
		}
		catch(error)
		{
			console.log('Ran into an error when trying to store upwave cards!');
			console.log(error);

			return false;
		}
	},

	/**
	 * Function responsible for retrieving any cached upwave data from our database
	 *
	 * @returns {Object || null} - a collection of upwave cards or simply nothing should that data be expired
	 *
	 * @author kinsho
	 */
	readCachedCards: async function ()
	{
		try
		{
			// Fetch the data from the database
			var dbResults = await mongo.read(UPWAVE_COLLECTION, {});

			return dbResults[0];
		}
		catch(error)
		{
			console.log('Ran into an error trying to fetch upwave data from the database');
			console.log(error);

			return false;
		}
	}
};