// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),
	mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver');

// ----------------- ENUMS/CONSTANTS --------------------------

var ORDERS_COLLECTION = 'orders';

// ----------------- MODULE DEFINITION --------------------------
module.exports =
{
	/**
	 * Function responsible for fetching an existing order from the database
	 *
	 * @param {Object} orderNumber - the order identification number
	 *
	 * @returns {Object} - the order itself, in its entirety
	 *
	 * @author kinsho
	 */
	fetchOrder: _Q.async(function* (orderNumber)
	{
		try
		{
			var dbResults = yield mongo.read(ORDERS_COLLECTION,
			{
				id: orderNumber
			});

			return dbResults[0];
		}
		catch(error)
		{
			console.log('Ran into an error fetching an existing order for the order details page!');
			console.log(error);

			return false;
		}
	}),
};