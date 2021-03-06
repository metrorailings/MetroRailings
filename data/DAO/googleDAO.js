// ----------------- EXTERNAL MODULES --------------------------

var _request = require('request'),
	_Q = require('q'),

	config = global.OwlStakes.require('config/config');

// ----------------- ENUMS/CONSTANTS --------------------------

var GOOGLE_DISTANCE_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=::srcAddress&destinations=::destAddress&key=::apiKey',
	SRC_ADDRESS_PLACEHOLDER = '::srcAddress',
	DEST_ADDRESS_PLACEHOLDER = '::destAddress',
	API_KEY_PLACEHOLDER = '::apiKey';

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
	calculateDistance: async function (destAddress)
	{
		var shopAddress = config.SHOP_ADDRESS,
			googleURL = GOOGLE_DISTANCE_URL,
			deferred = _Q.defer(),
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

		console.log('Going to initiate a call to ' + googleURL);

		try
		{
			// Make the request to Google to fetch the distance data
			_request(googleURL, (error, response, body) =>
			{
				if (error)
				{
					deferred.reject(error);
				}

				// Parse the information from the body
				body = JSON.parse(body);

				// If the destination address is present in the response body, we have a legit address here
				if (body.destination_addresses.length)
				{
					// Return the distance (in kilometers) back to the invoker
					deferred.resolve(body.rows[0].elements[0].distance.value);
				}
				else
				{
					deferred.resolve(-1);
				}
			});
		}
		catch(error)
		{
			console.log('Ran into an error when gather data from the Google Distance Matrix API!');
			console.log(error);

			return false;
		}

		return deferred.promise;
	},

	/**
	 * Function responsible determining the distance between our shop and any arbitrary zip code using the Google
	 * Distance Matrix API
	 *
	 * @param {String} zipCode - the zip code we will be using to route from our shop
	 *
	 * @returns {Boolean} - the number of miles between our shop and the center of the zip code region
	 *
	 * @author kinsho
	 */
	calculateDistanceToZipCode: async function (zipCode)
	{
		var shopAddress = config.SHOP_ADDRESS,
			googleURL = GOOGLE_DISTANCE_URL,
			deferred = _Q.defer();

		// Format the source address so that we can place it inside the URL
		shopAddress = shopAddress.split(' ').join('+');

		// Populate the parameters directly into the URL
		googleURL = googleURL.replace(SRC_ADDRESS_PLACEHOLDER, shopAddress);
		googleURL = googleURL.replace(DEST_ADDRESS_PLACEHOLDER, zipCode);
		googleURL = googleURL.replace(API_KEY_PLACEHOLDER, config.GOOGLE_API_KEY);

		console.log('Going to initiate a call to ' + googleURL);

		try
		{
			// Make the request to Google to fetch the distance data
			_request(googleURL, (error, response, body) =>
			{
				if (error)
				{
					deferred.reject(error);
				}

				// Parse the information from the body
				body = JSON.parse(body);

				// If the destination address is present in the response body, we have a legit address here
				if (body.destination_addresses.length && body.destination_addresses[0])
				{
					if (body.rows && body.rows[0] && body.rows[0].elements && body.rows[0].elements[0] && body.rows[0].elements[0].distance)
					{
						// Return the distance (in kilometers) back to the invoker
						deferred.resolve((body.rows[0].elements[0].distance.value) / 1000);
					}
					else
					{
						deferred.resolve(-1);
					}
				}
				else
				{
					deferred.resolve(-1);
				}
			});
		}
		catch(error)
		{
			console.log('Ran into an error when gather data from the Google Distance Matrix API!');
			console.log(error);

			return -1;
		}

		return deferred.promise;
	},

	/**
	 * Function that converts a given number of kilometers to miles
	 *
	 * @param {Number} kilometers - the number of kilometers to convert
	 *
	 * @returns {Float} - the number of miles the passed numbers of kilometers translates to
	 *
	 * @author kinsho
	 */
	convertKilometersToMiles: function(kilometers)
	{
		return parseFloat((kilometers * 0.62).toFixed(2));
	}

};