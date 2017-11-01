// ----------------- EXTERNAL MODULES --------------------------

var mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver');

// ----------------- ENUMS/CONSTANTS --------------------------

var GALLERY_META_COLLECTION = 'gallery';

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function responsible for fetching gallery metadata from the database
	 *
	 * @returns {Array<Object>} - a collection of data referring to all gallery images that have been processed and
	 * 		are ready for presentation
	 *
	 * @author kinsho
	 */
	fetchGalleryData: async function ()
	{
		var results;

		try
		{
			// Insert a new contact request into the database
			results = await mongo.read(GALLERY_META_COLLECTION, {});

			// Sort the data by the indices associated with the gallery images
			results.sort((a, b) =>
			{
				if (a.index > b.index)
				{
					return 1;
				}
				else if (b.index > a.index)
				{
					return -1;
				}
				else
				{
					return 0;
				}
			});

			return results;
		}
		catch(error)
		{
			console.log('Ran into an error when trying to fetch gallery data!');
			console.log(error);

			return false;
		}
	}
};