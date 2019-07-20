// ----------------- APP_ROOT_PATH INSTANTIATION --------------------------

global.OwlStakes =
{
	require : require('app-root-path').require
};

// ----------------- EXTERNAL MODULES --------------------------

let mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver'),

	fileManager = global.OwlStakes.require('utility/fileManager');

// ----------------- ENUMS/CONSTANTS --------------------------

const ORDERS_COLLECTION = 'orders',
	JSON_FILE = '/migration/orders.txt';

// ----------------- INITIALIZATION --------------------------

// Open up a connection to the database
(async function ()
{
	await mongo.initialize();
	
	let orders = await fileManager.fetchFile(JSON_FILE),
		newOrders = [ORDERS_COLLECTION, true];

	// Process the orders
	orders = JSON.parse(orders);
	for (let i = 0; i < orders.length; i += 1)
	{
		newOrders.push(mongo.formUpdateOneQuery({ _id : orders[i]._id }, orders[i], true));
	}

	// Send all these orders to the database
	await mongo.bulkWrite.apply(mongo, newOrders);

	// Close out this program
	console.log('Done!');
	process.exit();
})();