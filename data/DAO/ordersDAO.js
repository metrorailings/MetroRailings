// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),
	mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver');

// ----------------- ENUMS/CONSTANTS --------------------------

var ORDERS_COLLECTION = 'orders';

// ----------------- MODULE DEFINITION --------------------------
module.exports =
{
	/**
	 * Function responsible for fetching new orders from the database
	 *
	 * @param {Date} beginningDate - the date and time from which to look for new orders
	 *
	 * @returns Array<Object> - all orders that come on or after the passed datetime
	 *
	 * @author kinsho
	 */
	fetchOrder: _Q.async(function* (beginningDate)
	{
		try
		{
			var dbResults = yield mongo.read(ORDERS_COLLECTION,
				{
					dateCreated: mongo.greaterThanOrEqualToOperator(beginningDate)
				});

			return dbResults;
		}
		catch(error)
		{
			console.log('Ran into an error fetching new orders for the orders page!');
			console.log(error);

			return false;
		}
	}),
};