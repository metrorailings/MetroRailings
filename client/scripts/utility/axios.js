/**
 * @main axios
 */

// ----------------- EXTERNAL MODULES --------------------------

import _axios from 'axios';
import _promise from 'es6-promise';

import notifier from 'client/scripts/utility/notifications';

// ----------------- ENUMS/CONSTANTS --------------------------

var LOADING_VEIL = 'baseLoaderOverlay',
	VISIBILITY_CLASS = 'show',

	DEFAULT_CONFIG =
	{
		timeout: 20000
	};

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
		 * @param {boolean} [showLoader] - a flag indicating whether a loading animation should be shown to the user
		 * 		until the AJAX request returns back with data from the server
		 * @param {Object} [requestHeaders] - request headers that modify the nature of this connection
		 *
		 * @returns {Promise<Object>} - an object containing either data from an external source or a a plain old rejection
		 *
		 * @author kinsho
		 */
		post: function(url, payload, showLoader, requestHeaders)
		{
			var configObj = DEFAULT_CONFIG;

			configObj.headers = requestHeaders || {};

			return new Promise((resolve, reject) =>
			{
				// Hide any outstanding notifications
				notifier.hideErrorBar();
				notifier.hideSuccessBar();

				if (showLoader)
				{
					_toggleLoadingVeil();
				}

				_axiosConnection.post(url, payload, configObj).then((response) =>
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
				// Hide any outstanding notifications
				notifier.hideErrorBar();
				notifier.hideSuccessBar();

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
		},

		/**
		 * Public function that allows us to show the loading veil in circumstances outside of those that this module
		 * is designed to handle
		 *
		 * @author kinsho
		 */
		toggleLoadingVeil: function()
		{
			_toggleLoadingVeil();
		}
	};

// ----------------- CONFIGURATION ---------------------------

// Simulate promise functionality should the browser not support the syntax of promises
_promise.polyfill();

// Generate a new instance of axios
_axiosConnection = _axios.create({});

// ----------------- EXPORT ---------------------------

export default axiosModule;