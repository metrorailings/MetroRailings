// ----------------- APP_ROOT_PATH INSTANTIATION --------------------------

global.OwlStakes =
{
	require : require('app-root-path').require
};

// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),
	mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver'),
	orderGenerator = global.OwlStakes.require('test/orders/orderGenerator');

// ----------------- ENUMS/CONSTANTS --------------------------

var ORDERS_COLLECTION = 'orders';

// ----------------- INITIALIZATION --------------------------

// Open up a connection to the database
_Q.spawn(function* ()
{
	yield mongo.initialize();

	if (process.argv.length < 4)
	{
		console.log('Not enough arguments...');
		process.exit();
	}

	// Pull the number of orders needed and the date that we should use as a base to generate new dates
	var numOfOrders = process.argv[2],
		startDate = new Date(process.argv[3]),
		status = process.argv[4],
		newOrders = [],
		generatedOrder,
		i;

	// Generate all the orders
	for (i = 0; i < numOfOrders; i++)
	{
		generatedOrder = orderGenerator(status, startDate, new Date(startDate.getTime() + (i + 1) * 24 * 60 * 60 * 1000));
		newOrders.push(mongo.formInsertSingleQuery(generatedOrder));
	}
	newOrders.unshift(ORDERS_COLLECTION, true);

	// Send all these orders to the database
	yield mongo.bulkWrite.apply(mongo, newOrders);

	// Close out this program
	console.log("Done!");
	process.exit();
});