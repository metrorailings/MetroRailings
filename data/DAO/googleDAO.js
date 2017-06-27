// ----------------- EXTERNAL MODULES --------------------------

var config = global.OwlStakes.require('config/config');

// ----------------- ENUMS/CONSTANTS --------------------------

var GOOGLE_DISTANCE_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=::srcAddress&destinations=::destAddress&key=::apiKey',
	SRC_ADDRESS_PLACEHOLDER = '::srcAddress',
	DEST_ADDRESS_PLACEHOLDER = '::destAddress',
	API_KEY_PLACEHOLDER = '::apiKey';

var GOOGLE_DISTANCE_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=766+Ramsey+Ave+Hillside+NJ&destinations=22B+Chen+St+North+Plainfield+NJ&key=AIzaSyAArzYxSRCOgMtFBpAtJji4KOZ2Ms1uRy4';

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function responsible determining the distance between our shop and any arbitrary location using the Google
	 * Distance Matrix API
	 *
	 * @param {Object} destAddress - the construct denoting the destination address
	 *
	 * @returns {Boolean} - the number of miles between our shop and the destination address
	 *
	 * @author kinsho
	 */
	insertNewContactRequest: async function (destAddress)
	{
		var shopAddress = config.SHOP_ADDRESS,
			googleURL = GOOGLE_DISTANCE_URL,
			destination = '';

		// Format the source address so that we can place it inside the URL
		shopAddress = shopAddress.split(' ').join('+');

		// Format the destination address so that we can place it inside the URL
		destination += destAddress.address.split(' ').join('+');
		destination += '+' + destAddress.city;
		destination += '+' + destAddress.state;
		destination += '+' + destAddress.zipCode;

		// Populate the parameters directly into the URL
		googleURL = googleURL.replace(SRC_ADDRESS_PLACEHOLDER, shopAddress);
		googleURL = googleURL.replace(DEST_ADDRESS_PLACEHOLDER, destination);
		googleURL = googleURL.replace(API_KEY_PLACEHOLDER, config.GOOGLE_API_KEY);

		try
		{
		}
		catch(error)
		{
			console.log('Ran into an error when gather data from the Google Distance Matrix API!');
			console.log(error);

			return false;
		}
	}
};