/**
 * A module to test whether PDFs can be generated from puppeteer
 *
 * @module pdfGenerator
 */

// ----------------- APP_ROOT_PATH INSTANTIATION --------------------------

global.OwlStakes =
{
	require : require('app-root-path').require
};

// ----------------- EXTERNAL MODULES --------------------------

const _puppeteer = require('puppeteer'),

	config = global.OwlStakes.require('config/config');

// ----------------- MODULE DEFINITION --------------------------

(async function()
{
	try
	{
		let browser = await _puppeteer.launch(
			{
				headless : true,
				ignoreHTTPSErrors : true,
				args: ['--no-sandbox', '--disable-dev-shm-usage']
			}),
			page = await browser.newPage(),
			options = {},
			pdfContents;

		if (process.argv.length < 3)
		{
			console.log('Not enough arguments...');
			process.exit();
		}

		console.log('Going to generate PDF of ' + config.BASE_URL + process.argv[2]);

		// Load the quote that needs to be rendered into PDF form
		page.emulateMedia('print');
		await page.goto(config.BASE_URL + process.argv[2], { waituntil : 'networkidle0' });

		// Generate the PDF and send its contents either towards the file or back to the callee of this function
		pdfContents = await page.pdf(options);

		await browser.close();
		console.log(pdfContents);
	}
	catch(error)
	{
		console.log('ERROR when trying to generate a PDF of ' + process.argv[2]);
		console.log(error);
	}
})();