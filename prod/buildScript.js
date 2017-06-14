// ----------------- APP_ROOT_PATH INSTANTIATION --------------------------

global.OwlStakes =
{
	require : require('app-root-path').require
};

// ----------------- EXTERNAL MODULES --------------------------

var	_fs = require('fs'),
	_Q = require('q'),

	fileManager = global.OwlStakes.require('utility/fileManager');

// ----------------- ENUMS/CONSTANTS --------------------------

var	SCRIPTS_DIRECTORY = 'client/scripts/',

	JSPM_PACKAGES_DIRECTORY_KEYWORD = '/jspm_packages/',
	JSPM_BUNDLE_KEYWORD = 'jspm bundle ',
	BUNDLE_APPEND_KEYWORD = ' + ',

	MAIN_SCRIPT = '/main.js',
	BUILD_OUTPUT_FILE = 'prod/build.src.js',
	BUILD_SHELL_FILE = 'prod/buildScript.sh';

// ----------------- I/O FUNCTION TRANSFORMATIONS --------------------------

var fsWriteFile = _Q.denodeify(_fs.writeFile);

// ----------------- BUILD SCRIPT --------------------------

(async function()
{
	var scriptFiles = await fileManager.fetchAllFilePaths(SCRIPTS_DIRECTORY),
		scriptFile, buildString,
		filesToBuild = [],
		i;

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