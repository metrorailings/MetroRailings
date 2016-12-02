// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),
	mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver');

// ----------------- ENUMS/CONSTANTS --------------------------


// ----------------- MODULE DEFINITION --------------------------
module.exports =
{
	/**
	 * Function responsible for saving a new order into the database
	 *
	 * @param {Object} order - a new customer order to save into our system
	 *
	 * @returns {boolean} - a flag indicating whether the order was successfully saved into the database
	 *
	 * @author kinsho
	 */
	saveNewOrder: _Q.async(function* (order)
	{
		try
		{
			yield mongo.bulkWrite(ORDERS_COLLECTION, true, mongo.formInsertSingleQuery(order));

			return true;
		}
		catch(error)
		{
			console.log('Ran into an error when creating a new order!');
			console.log(error);

			return false;
		}
	}),
};