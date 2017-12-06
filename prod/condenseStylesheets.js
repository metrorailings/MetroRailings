// ----------------- APP_ROOT_PATH INSTANTIATION --------------------------

global.OwlStakes =
{
	require : require('app-root-path').require
};

// ----------------- EXTERNAL MODULES --------------------------

var _sass = require('node-sass'),
	_cssPurge = require('css-purge'),

	fileManager = global.OwlStakes.require('utility/fileManager');

// ----------------- ENUMS/CONSTANTS --------------------------

var STYLE_DIRECTORY = 'client/styles/',
	FOUNDATION_DIRECTORY = 'foundation',
	COMPILED_CSS_FILE = 'page.css',

	COMPRESSED_KEYWORD = 'compressed',

	SCSS_INCLUDE_PATHS =
	[
		'client/styles/foundation/'
	];

// ----------------- INITIALIZATION --------------------------

(async function ()
{
	var filePaths = await fileManager.childFilenamesScraper(STYLE_DIRECTORY),
		pageLevelCSSFilenames, pageLevelCSSFiles,
		pageLevelFile, compiledCSSFile,
		i, j;

	for (i = filePaths.length - 1; i >= 0; i--)
	{
		if (filePaths[i].indexOf(FOUNDATION_DIRECTORY) !== 0)
		{
			pageLevelCSSFilenames = await fileManager.childFilenamesScraper(STYLE_DIRECTORY + filePaths[i]);
			// Remove any CSS files that may have already been compiled
			for (j = pageLevelCSSFilenames.length - 1; j >= 0; j--)
			{
				if (pageLevelCSSFilenames[j] === COMPILED_CSS_FILE)
				{
					pageLevelCSSFilenames.splice(j, 1);
					break;
				}
			}
			// Now assert the path to each of the child stylesheet files
			for (j = pageLevelCSSFilenames.length - 1; j >= 0; j--)
			{
				pageLevelCSSFilenames[j] = '/' + STYLE_DIRECTORY + filePaths[i] + '/' + pageLevelCSSFilenames[j];
			}

			pageLevelCSSFiles = await fileManager.fetchFiles(pageLevelCSSFilenames);

			pageLevelFile = '';
			for (j = pageLevelCSSFiles.length - 1; j >= 0; j--)
			{
				pageLevelFile += pageLevelCSSFiles[j].content;
			}

			try
			{
				// Generate the CSS file from the SASS file, and then process that CSS file to remove any duplicate
				// rules
				compiledCSSFile = _sass.renderSync(
				{
					data: pageLevelFile,
					includePaths: SCSS_INCLUDE_PATHS,
					outputStyle: COMPRESSED_KEYWORD
				}).css;
				compiledCSSFile = new String(compiledCSSFile);

				// @TODO: Find a way to make CSS purging work....
//				compiledCSSFile = _cssPurge.purgeCSS(compiledCSSFile.toString(),
//				{
//					verbose : true
//				});
				compiledCSSFile = compiledCSSFile.toString();
			}
			catch(error)
			{
				console.log(error);
				console.log('Ran into an error trying to build a CSS file for ' + filePaths[i]);
			}

			// Now push that CSS into the page directory where it belongs
			fileManager.writeFile(compiledCSSFile, STYLE_DIRECTORY + filePaths[i] + '/' + COMPILED_CSS_FILE);

			console.log('Compiled a new CSS file for ' + STYLE_DIRECTORY + filePaths[i]);
		}
	}

})();