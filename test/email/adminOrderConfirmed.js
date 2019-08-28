// ----------------- APP_ROOT_PATH INSTANTIATION --------------------------

global.OwlStakes =
{
	require : require('app-root-path').require
};

// ----------------- EXTERNAL MODULES --------------------------

let mailer = global.OwlStakes.require('utility/mailer');

// ----------------- ENUMS/CONSTANTS --------------------------

const DETAILS =
		{
			_id: 1566,

			customer:
				{
					name: 'Fu Zhang',
					email: 'fu4999@aol.com',
					areaCode: '908',
					phoneOne: '544',
					phoneTwo: '4323'
				},

			payments:
				{
				charges:
				[{
					amount: 5597.81,
					type: 'cash'
				}]
			},

		},

	RECIPIENT_ADDRESS = 'kinsho@gmail.com',
	SENDER_NAME = 'support@metrorailings.com',
	EMAIL_SUBJECT = 'New Order Finalized - 1566';

// ----------------- INITIALIZATION --------------------------

// Open up a connection to the database
(async function ()
{
	let htmlText;

	// Generate the e-mail
	htmlText = await mailer.generateFullEmail('adminOrderConfirmed', DETAILS, 'adminOrderConfirmed');

	// Log out the e-mail
	console.log(htmlText);

	// Now send the e-mail
	await mailer.sendMail(htmlText, '', RECIPIENT_ADDRESS, EMAIL_SUBJECT, 'test@gmail.com', SENDER_NAME);

	// Close out this program
	console.log('Done!');
	process.exit();
}());