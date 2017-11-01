// ----------------- APP_ROOT_PATH INSTANTIATION --------------------------

global.OwlStakes =
	{
		require : require('app-root-path').require
	};

// ----------------- EXTERNAL MODULES --------------------------

var _dropbox = require('dropbox'),

	config = global.OwlStakes.require('config/config');

// ----------------- INITIALIZATION --------------------------

(async function ()
{
	if (process.argv.length < 3)
	{
		console.log('Not enough arguments...');
		process.exit();
	}

	try
	{
		var dropboxConnection = new _dropbox({ accessToken: config.GALLERY_TOKEN }), // Instantiate a new dropbox connection
			filename = process.argv[2],
			results = await dropboxConnection.filesAlphaGetMetadata(
			{
				path : '/' + filename,
			});
	}
	catch(error)
	{
		console.error(error);
	}

	// Close out this program
	console.log(results);
	process.exit();
})();