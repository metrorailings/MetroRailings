// ----------------- APP_ROOT_PATH INSTANTIATION --------------------------

global.OwlStakes =
{
	require : require('app-root-path').require
};

// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),
	mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver');

// ----------------- ENUMS/CONSTANTS --------------------------

var ORDERS_COLLECTION = 'orders';

// ----------------- INITIALIZATION --------------------------

// Open up a connection to the database
_Q.spawn(function* ()
{
	yield mongo.initialize();

	if (process.argv.length < 3)
	{
		console.log('Not enough arguments...');
		process.exit();
	}

	// Pull the number of orders that need to be modified
	var numOfOrders = process.argv[2],
		orders = [], order,
		modifiedOrders = [],
		randomOrderIndex,
		i;

	// Retrieve the orders
	orders = yield mongo.read(ORDERS_COLLECTION);

	// Modify the orders
	for (i = 0; i < numOfOrders; i++)
	{
		randomOrderIndex = Math.floor(Math.random() * orders.length);

		order = orders.splice(randomOrderIndex, 1)[0];
		order.lastModifiedDate = new Date();
		modifiedOrders.push(mongo.formUpdateOneQuery({ id: order.id }, order, true));
	}
	modifiedOrders.unshift(ORDERS_COLLECTION, true);

	// Send all these orders to the database
	mongo.bulkWrite.apply(mongo, modifiedOrders);

	// Close out this program
	console.log("Done!");
	process.exit();
});