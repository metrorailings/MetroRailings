/**
 * @main axios
 */

// ----------------- EXTERNAL MODULES --------------------------

import _axios from 'axios';
import _promise from 'es6-promise';

// ----------------- ENUMS/CONSTANTS --------------------------

var LOADING_VEIL = 'baseLoaderOverlay',
	VISIBILITY_CLASS = 'show';

// ----------------- PRIVATE MEMBERS --------------------------

var _axiosConnection; // The actual instance of axios that we will be using to manage HTTP transactions

// ----------------- PRIVATE FUNCTIONS --------------------------

/**
 * A generic handler to hopefully handle all errors generated from the usage of axios
 *
 * @param {String} requestType - the type of HTTP request that necessitated the execution of this function
 * 		in the first place
 * @param {Object} response - an object with specialized properties depending on the nature of the error
 *
 * @author kinsho
 */
function _genericErrorLogger(response)
{
	console.error('ERROR ---> axios.' + response.config.method);
	console.error('Error was generated while trying to connect to ' + response.config.url);
}

/**
 * A generic function to toggle the visibility of the loading veil
 *
 * @author kinsho
 */
function _toggleLoadingVeil()
{
	var veil = document.getElementById(LOADING_VEIL);

	if (veil.classList.contains(VISIBILITY_CLASS))
	{
		veil.classList.remove(VISIBILITY_CLASS);
	}
	else
	{
		veil.classList.add(VISIBILITY_CLASS);
	}
}

// ----------------- MODULE ---------------------------

var axiosModule =
{
	/**
	 * Generic function to leverage when making POST requests from the client
	 *
	 * @param {String} url - the URL towards which to direct the request
	 * @param {Object} payload - a hashmap of data to send over the wire
	 * @param {boolean} showLoader - a flag indicating whether a loading animation should be shown to the user
	 * 		until the AJAX request returns back with data from the server
	 *
	 * @returns {Promise<Object>} - an object containing either data from an external source or a reason why the request ultimately
	 * 		failed to return meaningful data
	 *
	 * @author kinsho
	 */
	post: function(url, payload, showLoader)
	{
		return new Promise((resolve, reject) =>
		{
			if (showLoader)
			{
				_toggleLoadingVeil();
			}

			_axiosConnection.post(url, payload).then((response) =>
			{
				if (showLoader)
				{
					_toggleLoadingVeil();
				}

				resolve(response);
			}).catch((response) =>
			{
				if (showLoader)
				{
					_toggleLoadingVeil();
				}

				_genericErrorLogger(response);
				reject('');
			});
		});
	},

	/**
	 * Generic function to leverage when making GET requests from the client
	 *
	 * @param {String} url - the URL towards which to direct the request
	 * @param {Object} payload - a hashmap of data to send over the wire as query parameters
	 * @param {boolean} showLoader - a flag indicating whether a loading animation should be shown to the user
	 * 		until the AJAX request returns back with data from the server
	 *
	 * @returns {Promise<Object>} - an object containing either data from an external source or a reason why the request
	 * 		ultimately failed to return meaningful data
	 *
	 * @author kinsho
	 */
	get: function(url, params, showLoader)
	{
		return new Promise((resolve, reject) =>
		{
			if (showLoader)
			{
				_toggleLoadingVeil();
			}

			_axiosConnection.get(url,
			{
				params : params
			}).then((response) =>
			{
				if (showLoader)
				{
					_toggleLoadingVeil();
				}

				resolve(response.data);
			}).catch((response) =>
			{
				if (showLoader)
				{
					_toggleLoadingVeil();
				}

				_genericErrorLogger(response);
				reject('');
			});
		});
	}
};

// ----------------- CONFIGURATION ---------------------------

// Simulate promise functionality should the browser not support the syntax of promises
_promise.polyfill();

// Configure axios by generating a new instance with custom configuration properties
_axiosConnection = _axios.create(
{
	timeout : 20000
});

// ----------------- EXPORT ---------------------------

export default axiosModule;