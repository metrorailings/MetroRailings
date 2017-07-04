// ----------------- APP_ROOT_PATH INSTANTIATION --------------------------

global.OwlStakes =
{
	require : require('app-root-path').require
};

// ----------------- EXTERNAL MODULES --------------------------

var mailer = global.OwlStakes.require('utility/mailer');

// ----------------- ENUMS/CONSTANTS --------------------------

var DETAILS =
	{
		totalPrice: 52.05,

		customer:
		{
			nickname: 'Rickin',
			name: 'Rickin Shah',
			address: '22B Chatham St.',
			city: 'North Plainfield',
			state: 'NJ',
			zipCode: '07060',
			email: 'kinsho@gmail.com',
			areaCode: '908',
			phoneOne: '251',
			phoneTwo: '0105'
		},
	},

	RECIPIENT_ADDRESS = 'kinsho@gmail.com',
	SENDER_NAME = 'support@metrorailings.com',
	EMAIL_SUBJECT = 'Your estimate is being scheduled';

// ----------------- INITIALIZATION --------------------------

// Open up a connection to the database
(async function ()
{
	var htmlText;

	// Generate the e-mail
	htmlText = await mailer.generateFullEmail('estimateConfirmation', DETAILS, 'estimateConfirmation');

	// Log out the e-mail
	console.log(htmlText);

	// Now send the e-mail
	await mailer.sendMail(htmlText, '', RECIPIENT_ADDRESS, EMAIL_SUBJECT, 'test@gmail.com', SENDER_NAME);

	// Close out this program
	console.log('Done!');
	process.exit();
}());