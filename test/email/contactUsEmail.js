// ----------------- APP_ROOT_PATH INSTANTIATION --------------------------

global.OwlStakes =
{
	require : require('app-root-path').require
};

// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),
	mailer = global.OwlStakes.require('utility/mailer');

// ----------------- ENUMS/CONSTANTS --------------------------

var DETAILS =
	{
		name: 'Fu Zhang',
		email: 'fu4999@aol.com',
		phoneNumber: '(908) 544 - 4233',
		comments: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},

	RECIPIENT_ADDRESS = 'kinsho@gmail.com',
	SENDER_NAME = 'support@metrorailings.com',
	EMAIL_SUBJECT_PREFIX = 'New support request - ';

// ----------------- INITIALIZATION --------------------------

// Open up a connection to the database
_Q.spawn(function* ()
{
	var htmlText;

	// Generate the e-mail
	htmlText = yield mailer.generateFullEmail('contactUs', DETAILS, 'contactUs');

	// Log out the e-mail
	console.log(htmlText);

	// Now send the e-mail
	yield mailer.sendMail(htmlText, '', RECIPIENT_ADDRESS, EMAIL_SUBJECT_PREFIX + DETAILS.name, 'test@gmail.com', SENDER_NAME);

	// Close out this program
	console.log("Done!");
	process.exit();
});