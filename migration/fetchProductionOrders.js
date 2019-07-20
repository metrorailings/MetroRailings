// ----------------- APP_ROOT_PATH INSTANTIATION --------------------------

global.OwlStakes =
{
	require : require('app-root-path').require
};

// ----------------- EXTERNAL MODULES --------------------------

let mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver'),
	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO'),

	fileManager = global.OwlStakes.require('utility/fileManager');

// ----------------- ENUMS/CONSTANTS --------------------------

const OUTPUT_PATH = 'migration/orders.txt';

// ----------------- INITIALIZATION --------------------------

// Open up a connection to the database
(async function ()
{
	await mongo.initialize();

	console.log('Dumping the orders collection into a dump file...');

	let orders = await ordersDAO.retrieveAllOrders();

	// Writing out the orders
	await fileManager.writeFile(JSON.stringify(orders), OUTPUT_PATH);

	// Close out this program
	console.log('Done!');
	process.exit();
})();