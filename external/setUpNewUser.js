// ----------------- APP_ROOT_PATH INSTANTIATION --------------------------

global.OwlStakes =
{
	require : require('app-root-path').require
};

// ------------- EXTERNAL MODULES --------------------------

const _crypto = require('crypto'),

	config = global.OwlStakes.require('config/config'),

	mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver');

// ----------------- ENUMS/CONSTANTS --------------------------

const ADMINS_COLLECTION = 'admins';

// ----------------- MODULE DEFINITION --------------------------

(async function ()
{
	await mongo.initialize();

	if (process.argv.length < 6)
	{
		console.log('Not enough arguments...');
		process.exit();
	}

	// Pull the username and password from the command line
	let username = process.argv[2],
		password = process.argv[3],
		firstName = process.argv[4],
		lastName = process.argv[5];

	try
	{
		// Encrypt the password
		password = _crypto.createHmac('sha256', config.HASH_KEY).update(password).digest('hex');

		// Log the user name, password, and first/last name
		console.log('Username: ' + username);
		console.log('Password: ' + password);
		console.log('First name: ' + firstName);
		console.log('Last name: ' + lastName);

		// Write/update the credentials into the database
		await mongo.bulkWrite(ADMINS_COLLECTION, false, mongo.formUpdateOneQuery(
		{
			username: username
		},
		{
			username: username,
			password: password,
			firstName: firstName,
			lastName: lastName
		},true));

		// Close out this program
		console.log('Done!');
		process.exit();
	}
	catch(error)
	{
		console.log('Ran into an error when trying to insert new admin credentials!');
		console.log(error);

		return false;
	}	
}());
