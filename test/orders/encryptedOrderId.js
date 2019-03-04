// ----------------- APP_ROOT_PATH INSTANTIATION --------------------------

global.OwlStakes =
{
	require : require('app-root-path').require
};

// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),
	_crypto = require('crypto'),

	config = global.OwlStakes.require('config/config'),

	mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver'),
	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO');

// ----------------- INITIALIZATION --------------------------

// Open up a connection to the database
_Q.spawn(function* ()
{
	yield mongo.initialize();

	var orders,
		orderID,
		cipherText,
		cipher = _crypto.createCipher(config.ENCRYPTION_ALGORITHM, config.HASH_KEY);

	// Fetch an order
	orders = yield ordersDAO.searchOrdersByDate(new Date('01/01/2010'));
	orderID = orders[0]._id.toString();

	// Encrypt the order ID
	cipherText = cipher.update(orderID, config.ENCRYPTION_INPUT_TYPE, config.ENCRYPTION_OUTPUT_TYPE);
	cipherText += cipher.final(config.ENCRYPTION_OUTPUT_TYPE);

	// Log the encrypted order ID
	console.log(cipherText);

	// Close out this program
	console.log('Done!');
	process.exit();
});