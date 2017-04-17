/**
 * @module fileManager
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('Q'),
	_fs = require('fs'),

	router;  // For some queer reason, we have to import application modules dynamically......fucking Node.....

// ----------------- ENUM/CONSTANTS --------------------------

var CLIENT_DIRECTORY = process.cwd() + '/client/',
	SERVER_DIRECTORY = process.cwd() + '/',
	CLIENT_RELATIVE_PATH = 'client/',

	STYLESHEET_DIRECTORY = 'styles/',
	VIEWS_DIRECTORY = 'views/',
	IMAGES_DIRECTORY = 'images/',

	TEMPLATE_EXTENSION = '.handlebars',
	SCSS_EXTENSION = '.scss',
	JSON_EXTENSION = '.json',
	MAP_EXTENSION = '.map';

// ----------------- I/O FUNCTION TRANSFORMATIONS --------------------------

var fsReadDir = _Q.denodeify(_fs.readdir),
	fsStat = _Q.denodeify(_fs.stat),
	fsReadFile = _Q.denodeify(_fs.readFile);

// ----------------- PRIVATE FUNCTIONS --------------------------

/**
 * Generator function responsible for fetching system paths for all files within a specified directory,
 * or if a file name is passed in, will fetch only the system path for that specific file
 *
 * @param {String} directoryName - the path of the directory, relative from the project root
 * @param {boolean} [recursiveRead] - flag indicating whether any descendant subdirectories within the target
 * 		directory should also be searched for files
 * @param {String} [extensionFilter] - if specified, the only file names that will be returned are the file
 * 		names that end with this string
 *
 * @returns {Object} - an array of specialized object containing two significant properties, one pertaining to
 * 		the file name and another housing the full system path of that file
 *
 * @throws - an exception generated when attempting to read and gather data about certain files
 *
 * @author kinsho
 */
async function _fileNameScraper(directoryName, recursiveRead, extensionFilter)
{
	var fileNames,
		fileStats,
		files,
		subDirectoryFiles,
		i;

	try
	{
		files = [];

		// Fetch all the files from the directory
		fileNames = await fsReadDir(directoryName);
		// Fetch stats related to all the files that were read
		fileStats = await _Q.all(fileNames.map((file) =>
		{
			return fsStat(directoryName + file);
		}));

		// Compose an array of relative paths for all fetched files, keeping in mind to use the
		// file stats to filter out all sub-directories that may have been returned when the directory
		// was read
		for (i = 0; i < fileStats.length; i++)
		{
			if (fileStats[i].isFile())
			{
				if ( (!(extensionFilter)) || (fileNames[i].endsWith(extensionFilter)) )
				{
					files.push(
						{
							'name': fileNames[i],
							'path': directoryName.replace(CLIENT_DIRECTORY, CLIENT_RELATIVE_PATH) + fileNames[i]
						});
				}
			}
			else if ((recursiveRead) && (fileStats[i].isDirectory()))
			{
				// Recursively scrape out files within the subdirectory provided that the recursiveRead
				// flag was set
				subDirectoryFiles = await _fileNameScraper(directoryName + fileNames[i] + '/', true, extensionFilter);
				files = files.concat(subDirectoryFiles);
			}
		}

		return files;
	}
	catch(error)
	{
		console.error('ERROR ---> fileManager.fileNameScraper');
		throw error;
	}
}

/**
 * Generator function responsible for reading the contents of files given the system path to that file
 *
 * @param {Array[String] | String} filePaths - either an array containing multiple file objects housing
 * 		system file paths and file names or a string representing just one system file path
 *
 * @returns {Array[String] | String} - if given a collection of multiple system file paths, the function will
 * 		return an array of specialized objects  containing the contents of each of those files indicated by the
 * 		paths. If given a string representing just one system file path, function will return a simple string
 * 		representing the contents of that one targeted file
 *
 * @throws - an exception generated when attempting to stream content from files
 *
 * @author kinsho
 */
async function _fileContentScraper(filePaths)
{
	var fileContents,
		labelledFileContents,
		i;

	try
	{
		if (filePaths instanceof Array)
		{
			fileContents = await _Q.all(filePaths.map(function(file)
			{
				console.log('Fetching the following file: ' + file.path);
				return fsReadFile(file.path);
			}));

			// With the file contents in hand, set up an associative array so that each content block is
			// identifiable to the service that ultimately invoked this fileManager
			labelledFileContents = [];
			for (i = 0; i < fileContents.length; i++)
			{
				labelledFileContents[i] =
				{
					name: filePaths[i].name,
					content: fileContents[i].toString()
				};
			}

			// Prepare the value for return
			fileContents = labelledFileContents;
		}
		else
		{
			// In the event that the module fails to recover a mapping file, simply return nothing.
			// Such mapping files are only useful to developers and have no bearing on the final product.
			if ( filePaths.endsWith(MAP_EXTENSION) )
			{
				return '';
			}

			console.log('Fetching the following file: ' + filePaths);
			fileContents = await fsReadFile(filePaths);

			// Fetch the router if it has not been fetched yet
			if ( !(router) )
			{
				router = global.OwlStakes.require('config/router');
			}

			// Only convert file contents to string values should the files be non-image files
			if ( !(router.isImage(filePaths)) )
			{
				fileContents = fileContents.toString();
			}
		}
	}
	catch(error)
	{
		console.error('ERROR ---> fileManager.fileContentScraper');
		console.error(error);
		throw(error);
	}

	return fileContents;
}

/**
 * Function responsible for synchronously reading the contents of a single file given the system path to
 * that file
 *
 * @param {String} filePath - a string representing a system file path
 *
 * @returns {String} - the contents of that one targeted file
 *
 * @throws - an exception generated when attempting to stream content from files
 *
 * @author kinsho
 */
function _singleFileContentScraperSync(filePath)
{
	var fileContents;

	try
	{
		console.log('Fetching the following file: ' + filePath);

		fileContents = _fs.readFileSync(filePath);

		// We are assuming that any file path passed to this function references a file is a non-image file
		fileContents = fileContents.toString();
	}
	catch(error)
	{
		console.error('ERROR ---> fileManager.singleFileContentScraperSync');
		console.error(error);
		throw(error);
	}

	return fileContents;
}

// ----------------- MODULE DEFINITION --------------------------
module.exports =
{

	/**
	 * Generator function that returns all stylesheets specific to a particular page
	 *
	 * @param {String} directory - the directory from which to fetch stylesheet files
	 *
	 * @returns {Array[Object]} - a collection of objects containing the contents of each stylesheet
	 *		as well as the name of that stylesheet within the file system
	 *
	 * @author kinsho
	 */
	fetchStylesheets: async function (directory)
	{
		return await _fileNameScraper(CLIENT_DIRECTORY + STYLESHEET_DIRECTORY + directory + '/', true, SCSS_EXTENSION);
	},

	/**
	 * Generator function that returns the content a specific template file
	 *
	 * @param {String} templateFolder - the name of the sub-directory within the views folder where
	 * 		the targeted template resides
	 * @param {String} templateName - the name of the template to fetch
	 *
	 * @returns {String} - the contents of the template specified by the parameters
	 *
	 * @author kinsho
	 */
	fetchTemplate: async function (templateFolder, templateName)
	{
		return await _fileContentScraper(CLIENT_DIRECTORY + VIEWS_DIRECTORY + templateFolder + '/' +
			templateName + TEMPLATE_EXTENSION);
	},

	/**
	 * Function that synchronously returns the contents of a template
	 *
	 * @param {String} templateFolder - the name of the sub-directory under the client-side views folder from which
	 * 		the template will be fetched
	 * @param {String} templateName - the name of the template to fetch
	 *
	 * @returns {String} - the contents of the template specified by the parameters
	 *
	 * @author kinsho
	 */
	fetchTemplateSync: function (templateFolder, templateName)
	{
		return _singleFileContentScraperSync(CLIENT_DIRECTORY + VIEWS_DIRECTORY + templateFolder + '/' +
			templateName + TEMPLATE_EXTENSION);
	},

	/**
	 * Generator function that returns the contents of all templates within the specified directory
	 *
	 * @param {String} templateFolder - the name of the sub-directory under the client-side views folder from which
	 * 		files will be fetched
	 *
	 * @returns {Array[Object]} - a collection of objects containing the contents of each template in the specified
	 * 		directory as well as the name of that template within the file system
	 *
	 * @author kinsho
	 */
	fetchTemplates: async function (templateFolder)
	{
		var paths,
			templateContent;

		// Fetch all the file names from the passed view sub-directory
		paths = await _fileNameScraper(CLIENT_DIRECTORY + VIEWS_DIRECTORY + templateFolder, false, TEMPLATE_EXTENSION);
		templateContent = await _fileContentScraper(paths);

		return templateContent;
	},

	/**
	 * Generator function that returns the contents of the JSON file indicated by the parameters
	 *
	 * @param {String} filePath - the relative path to the file starting from the project root
	 *
	 * @returns {String} - the contents of the JSON file specified by the parameters
	 *
	 * @author kinsho
	 */
	fetchJSON: async function (filePath)
	{
		return await _fileContentScraper(SERVER_DIRECTORY + filePath + JSON_EXTENSION);
	},

	/**
	 * Generator function that returns a collection of file paths leading to all the files housed in the passed directory
	 *
	 * @param {String} dirPath - the relative path of the directory from which to excavate file paths information
	 *
	 * @returns {Array[String]} - a list of all file paths for all visible files within the passed directory
	 *
	 * @author kinsho
	 */
	fetchAllFilePaths: async function (dirPath)
	{
		return await _fileNameScraper(process.cwd() + '/' + dirPath, true);
	},

	/**
	 * Generic generator function meant to fetch the contents of any one file in the system
	 *
	 * @param {String} filePath - the relative path to the file starting from the project root
	 *
	 * @returns {String} - the contents of the file indicated in the parameter
	 *
	 * @author kinsho
	 */
	fetchFile: async function (filePath)
	{
		return await _fileContentScraper(process.cwd() + filePath);
	},

	/**
	 * Generic generator function meant to fetch the paths of all image files within a particular image sub-directory
	 *
	 * @param {String} dirPath - the sub-directory under the images directory from which to fetch files
	 *
	 * @returns {Array<String>} - the list of file paths for every image within the passed sub-directory
	 *
	 * @author kinsho
	 */
	fetchImagePaths: async function (dirPath)
	{
		return await _fileNameScraper(CLIENT_DIRECTORY + IMAGES_DIRECTORY + dirPath + '/', true);
	}
};