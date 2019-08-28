// ----------------- APP_ROOT_PATH INSTANTIATION --------------------------

global.OwlStakes =
{
	require : require('app-root-path').require
};

// ----------------- EXTERNAL MODULES --------------------------

let mailer = global.OwlStakes.require('utility/mailer'),
	pdfGenerator = global.OwlStakes.require('utility/pdfGenerator');

// ----------------- ENUMS/CONSTANTS --------------------------

const DETAILS =
	{
		_id: 1566,

		customer:
		{
			nickname: 'Fu',
			areaCode: '908',
			phoneOne: '544',
			phoneTwo: '4323'
		}
	},

	INVOICE_URL = '/orderInvoice?id=1983',

	RECIPIENT_ADDRESS = 'kinsho@gmail.com',
	SENDER_NAME = 'support@metrorailings.com',
	EMAIL_SUBJECT = 'New Order Finalized - 1983';

// ----------------- INITIALIZATION --------------------------

// Open up a connection to the database
(async function ()
{
	let htmlText,
		quotePDF, quoteAttachment;

	// Generate a PDF of the quote that has been finalized for this new customer
	quotePDF = await pdfGenerator.htmlToPDF(INVOICE_URL);

	// Prepare the PDF copy of the quote to be sent over as an attachment
	quoteAttachment = await mailer.generateAttachment('1983.pdf', quotePDF);

	// Generate the e-mail
	htmlText = await mailer.generateFullEmail('orderReceipt', DETAILS, 'orderReceipt');

	// Log out the e-mail
	console.log(htmlText);

	// Now send the e-mail
	await mailer.sendMail(htmlText, '', RECIPIENT_ADDRESS, EMAIL_SUBJECT, 'test@gmail.com', SENDER_NAME, [quoteAttachment]);

	// Close out this program
	console.log('Done!');
	process.exit();
}());
