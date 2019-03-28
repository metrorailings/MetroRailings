/**
 * A module responsible for generating PDFs dynamically
 *
 * @module pdfGenerator
 */

// ----------------- EXTERNAL MODULES --------------------------

const _puppeteer = require('puppeteer'),
	_fs = require('fs'),
	_Q = require('q'),

	config = global.OwlStakes.require('config/config');

// ----------------- ENUMS/CONSTANTS --------------------------

const PDF_EXTENSION = '.pdf';

// ----------------- GENERATOR TRANSFORMATION FUNCTIONS --------------------------

let fsWriteFile = _Q.denodeify(_fs.writeFile);

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function meant to create a PDF copy of any internal HTML page
	 *
	 * @param {String} url - the internal URL to transform into PDF form
	 * @param {String} [filename] - the name to assign to the PDF file should we save it within our file system
	 * @param {String} [directory] - the directory in which we should save the PDF file being generated here
	 *
	 * @return {Buffer} - the raw contents of the PDF
	 *
	 * @author kinsho
	 */
	htmlToPDF: async function (url, filename, directory)
	{
		try
		{
			let browser = await _puppeteer.launch(
				{
					headless : true,
					ignoreHTTPSErrors : true,
					args: ['--no-sandbox', '--single-process']
				}),
				page = await browser.newPage(),
				options = {},
				pdfContents;

			// If a save path has been specified, prepare the options object with that save path
			if (filename && directory)
			{
				options.path = directory + filename + PDF_EXTENSION;

				// Create a new file that will store the PDF data
				await fsWriteFile(options.path, '');
			}

			// Load the quote that needs to be rendered into PDF form
			page.emulateMedia('print');
			await page.goto(config.BASE_URL + url, { waituntil : 'networkidle0' });
			
			// Generate the PDF and send its contents either towards the file or back to the callee of this function
			pdfContents = await page.pdf(options);

			await browser.close();
			return pdfContents || '';
		}
		catch(error)
		{
			console.log('ERROR when trying to generate a PDF copy of ' + url);
			console.log(error);
		}
	}

};