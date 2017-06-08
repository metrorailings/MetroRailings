// ----------------- APP_ROOT_PATH INSTANTIATION --------------------------

global.OwlStakes =
{
	require : require('app-root-path').require
};

// ----------------- EXTERNAL MODULES --------------------------

var templateManager = global.OwlStakes.require('utility/templateManager'),
	mailer = global.OwlStakes.require('utility/mailer');

// ----------------- ENUMS/CONSTANTS --------------------------

var ORDER =
	{
		_id: 1337,
		type: 'stairs',
		length: 15,
		orderTotal: 1200.00,
		customer:
		{
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
		design:
		{
			post: 'P-BPC',
			postCap: 'PC-SQ',
			center: 'CD-RHRT',
			color: 'black'
		}

	},

	RECIPIENT_ADDRESS = 'kinsho@gmail.com',
	SENDER_NAME = 'orders@metrorailings.com',
	ORDER_CONFIRMED = 'Your order has been confirmed';

// ----------------- INITIALIZATION --------------------------

// Open up a connection to the database
((async function ()
{
	var htmlText;

	ORDER.customer.nickname = ORDER.customer.name.trim().split(' ')[0];

	// Generate the e-mail
	htmlText = await mailer.generateFullEmail('orderReceipt', ORDER, 'orderReceipt');

	// Log out the e-mail
	console.log(htmlText);

	// Now send the e-mail
	await mailer.sendMail(htmlText, '', RECIPIENT_ADDRESS, ORDER_CONFIRMED, SENDER_NAME);

	// Close out this program
	console.log('Done!');
	process.exit();
})());