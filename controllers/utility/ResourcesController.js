/**
 * @module ResourcesController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),
	_sass = require('node-sass'),
	_zlib = require('zlib'),

	fileManager = global.OwlStakes.require('utility/fileManager'),

	router = global.OwlStakes.require('config/router');

// ----------------- ENUM/CONSTANTS --------------------------

var SCSS_EXTENSION = '.scss',

	SCSS_INCLUDE_PATHS =
	[
		'client/styles/foundation/'
	],

	COMPRESSED_KEYWORD = 'compressed';

// ----------------- I/O FUNCTION TRANSFORMATIONS --------------------------

var zlibGZipper = _Q.denodeify(_zlib.gzip);

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Initializer function responsible for fetching the contents of a resource
	 *
	 * @author kinsho
	 */
	init: async function (url)
	{
		var fileContents,
			gzipContents;

		try
		{
			fileContents = await fileManager.fetchFile(url);

			if (url.endsWith(SCSS_EXTENSION))
			{
				fileContents = _sass.renderSync(
				{
					data: fileContents,
					includePaths: SCSS_INCLUDE_PATHS,
					outputStyle: COMPRESSED_KEYWORD
				}).css;
			}

			// gzip the file contents only if the file is not an image
			if ( !(router.isImage(url)) )
			{
				gzipContents = await zlibGZipper(fileContents);
			}
			else
			{
				gzipContents = fileContents;
			}

			// Now return the compressed contents
			return gzipContents;
		}
		catch(error)
		{
			console.error('ERROR ---> ResourcesController.initAction');
			throw error;
		}
	}
};