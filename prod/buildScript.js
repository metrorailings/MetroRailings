// ----------------- APP_ROOT_PATH INSTANTIATION --------------------------

global.OwlStakes =
{
	require : require('app-root-path').require
};

// ----------------- EXTERNAL MODULES --------------------------

var	_fs = require('fs'),
	_Q = require('q'),
	_cheerio = require('cheerio'),
	_request = require('request'),
	_cleanCSS = require('clean-css'),

	fileManager = global.OwlStakes.require('utility/fileManager');

// ----------------- ENUMS/CONSTANTS --------------------------

var	SCRIPTS_DIRECTORY = 'client/scripts/',
	VIEWS_DIRECTORY = '/client/views/',

	JSPM_PACKAGES_DIRECTORY_KEYWORD = '/jspm_packages/',
	JSPM_BUNDLE_KEYWORD = 'jspm bundle ',
	BUNDLE_APPEND_KEYWORD = ' + ',
	BASE_HANDLEBARS_FILE = 'base.handlebars',

	THIRD_PARTY_SCRIPTS_SECTION = 'thirdPartyScripts',
	THIRD_PARTY_STYLES_SECTION = 'thirdPartyStyles',

	MAIN_SCRIPT = '/main.js',
	BUILD_THIRD_PARTY_SCRIPTS_FILE = 'prod/thirdParty.js',
	BUILD_THIRD_PARTY_STYLESHEETS_FILE = 'prod/thirdParty.css',
	BUILD_OUTPUT_FILE = 'prod/build.src.js',
	BUILD_SHELL_FILE = 'prod/buildScript.sh';

// ----------------- I/O FUNCTION TRANSFORMATIONS --------------------------

var fsWriteFile = _Q.denodeify(_fs.writeFile);

// ----------------- BUILD SCRIPT --------------------------

(async function()
{
	var scriptFiles = await fileManager.fetchAllFilePaths(SCRIPTS_DIRECTORY),
		baseHTML = await fileManager.fetchFile(VIEWS_DIRECTORY + BASE_HANDLEBARS_FILE),
		thirdPartyScriptURLs, thirdPartyScripts, thirdPartyScriptContents = '',
		thirdPartyStylesheetURLs, thirdPartyStylesheetParentFolder, thirdPartyStylesheets, thirdPartyStylesheetContents = '',
		scriptFile, buildString,
		filesToBuild = [],
		cssCleaner = new _cleanCSS({ level : 1 }),
		i;

	// Process the HTML so that we can better navigate to fetch the third-party scripts we need to pull
	baseHTML = _cheerio.load(baseHTML);
	thirdPartyScriptURLs = baseHTML('#' + THIRD_PARTY_SCRIPTS_SECTION).find('script');
	thirdPartyStylesheetURLs = baseHTML('#' + THIRD_PARTY_STYLES_SECTION).find('link');

	// Fetch all third-party scripts in raw form
	thirdPartyScripts = await _Q.all(thirdPartyScriptURLs.map((index, data) =>
	{
		var deferred = _Q.defer();

		console.log('Fetching ' + data.attribs.src);
		_request(data.attribs.src, (error, response, body) =>
		{
			if (error)
			{
				deferred.reject(error);
			}
			deferred.resolve(body);
		});

		return deferred.promise;
	}));

	// Fetch all third-party stylesheets in raw form
	thirdPartyStylesheets = await _Q.all(thirdPartyStylesheetURLs.map((index, data) =>
	{
		var deferred = _Q.defer();

		console.log('Fetching ' + data.attribs.href);
		_request(data.attribs.href, (error, response, body) =>
		{
			if (error)
			{
				deferred.reject(error);
			}

			// Before returning the CSS, ensure that any relative URLs in the stylesheet are converted into absolute
			// URL paths
			thirdPartyStylesheetParentFolder = data.attribs.href.split('/');
			thirdPartyStylesheetParentFolder.pop();
			thirdPartyStylesheetParentFolder = thirdPartyStylesheetParentFolder.join('/');

			body = body.split('./').join(thirdPartyStylesheetParentFolder + '/');

			deferred.resolve(body);
		});

		return deferred.promise;
	}));

	// Collect the contents of all third-party scripts and print them to a bundle file
	console.log('Condensing scripts...');
	for (i = 0; i < thirdPartyScripts.length; i++)
	{
		thirdPartyScriptContents += thirdPartyScripts[i];
	}
	console.log('Writing out to ' + BUILD_THIRD_PARTY_SCRIPTS_FILE);
	await fileManager.writeFile(thirdPartyScriptContents, BUILD_THIRD_PARTY_SCRIPTS_FILE);

	// Collect the contents of all third-party stylesheets and print them to a bundle file
	console.log('Condensing stylesheets...');
	for (i = 0; i < thirdPartyStylesheets.length; i++)
	{
		thirdPartyStylesheetContents += cssCleaner.minify(thirdPartyStylesheets[i]).styles.toString();
	}
	console.log('Writing out to ' + BUILD_THIRD_PARTY_STYLESHEETS_FILE);
	await fileManager.writeFile(thirdPartyStylesheetContents, BUILD_THIRD_PARTY_STYLESHEETS_FILE);

	// Fetch the paths to all main script files
	for (i = 0; i < scriptFiles.length; i++)
	{
		scriptFile = scriptFiles[i].path;

		if ( (scriptFile.endsWith(MAIN_SCRIPT)) && (scriptFile.indexOf(JSPM_PACKAGES_DIRECTORY_KEYWORD) === -1) )
		{
			filesToBuild.push(scriptFile);
		}
	}

	// Build out the shell file that will need to be executed to create a production build
	buildString = JSPM_BUNDLE_KEYWORD;
	for (i = 0; i < filesToBuild.length; i++)
	{
		if (i)
		{
			buildString += BUNDLE_APPEND_KEYWORD;
		}

		buildString += filesToBuild[i];
	}

	// Specify where the build file should end up in the file system
	buildString += ' ' + BUILD_OUTPUT_FILE;
	console.log(buildString);

	// Write out the shell file into the production directory
	await fsWriteFile(BUILD_SHELL_FILE, buildString);

	// Close out this program
	console.log('Done!');
	process.exit();
}());