// ----------------- APP_ROOT_PATH INSTANTIATION --------------------------

global.OwlStakes =
{
	require : require('app-root-path').require
};

// ----------------- EXTERNAL MODULES --------------------------

var mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver'),
	DAO = global.OwlStakes.require('data/DAO/ordersDAO'),

	pricingCalculator = global.OwlStakes.require('shared/pricing/pricingCalculator');

// ----------------- ENUMS/CONSTANTS --------------------------

var ORDERS_COLLECTION = 'orders',

	CLOSED_STATUS = 'closed';

// ----------------- INITIALIZATION --------------------------

// Open up a connection to the database
(async function ()
{
	await mongo.initialize();

	var orders,
		modifiedOrders = [],
		i;

	// Fetch all the orders
	orders = await DAO.searchOrdersByDate(new Date('01/01/1970'));

	// Modify and add some new pricing data to all the orders to ensure these orders meet the criteria
	for (i = 0; i < orders.length; i++)
	{
		orders[i].pricing.orderTotal = pricingCalculator.calculateOrderTotal(orders[i]);

		// Calculate the balance remaining only for those orders that haven't been closed yet
		if (orders[i].status === CLOSED_STATUS)
		{
			orders[i].pricing.balanceRemaining = 0;
		}
		else
		{
			orders[i].pricing.balanceRemaining = orders[i].pricing.orderTotal / 2;
		}

		// Remove any existing orderTotal field on the main order object
		delete orders[i].orderTotal;

		modifiedOrders.push(mongo.formUpdateOneQuery({ _id: orders[i]._id }, orders[i], false, { orderTotal: '' }));
	}
	modifiedOrders.unshift(ORDERS_COLLECTION, true);

	// Send all these orders to the database
	await mongo.bulkWrite.apply(mongo, modifiedOrders);

	// Close out this program
	console.log('Done!');
	process.exit();
})();