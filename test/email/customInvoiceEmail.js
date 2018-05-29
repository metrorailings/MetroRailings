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
		orderInvoiceLink: 'http://localhost/specializedInvoice?id=4335'
	},

	RECIPIENT_ADDRESS = 'kinsho@gmail.com',
	SENDER_NAME = 'support@metrorailings.com',
	CUSTOM_INVOICE_SUBJECT_HEADER = 'Metro Railings - Invoice (::invoiceId)';

// ----------------- INITIALIZATION --------------------------

// Open up a connection to the database
(async function ()
{
	var htmlText;

	// Generate the e-mail
	htmlText = await mailer.generateFullEmail('customInvoice', DETAILS, 'customInvoice');

	// Log out the e-mail
	console.log(htmlText);

	// Now send the e-mail
	await mailer.sendMail(htmlText, '', RECIPIENT_ADDRESS, CUSTOM_INVOICE_SUBJECT_HEADER, 'test@gmail.com', SENDER_NAME);

	// Close out this program
	console.log('Done!');
	process.exit();
}());