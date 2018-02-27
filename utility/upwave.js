/**
 * A module responsible for managing all Upwave API calls
 *
 * @module upwave
 */

// ----------------- EXTERNAL MODULES --------------------------

var _request = require('request-promise'),
	_striptags = require('striptags'),

	upwaveDAO = global.OwlStakes.require('data/DAO/upwaveDAO'),

	config = global.OwlStakes.require('config/config');

// ----------------- ENUMS/CONSTANTS --------------------------

var BOARD_NAMES =
	{
		CUSTOMERS: 'Customers',
		ESTIMATES: 'Estimates',
		INSTALLATIONS: 'Installations'
	},

	GET_CARDS_API = '/cards',
	TASK_LIST_ITEMS_API = '/tasklistitems',

	CARD_ID_PARAMETER = 'card=',
	NOT_FINISHED_PARAMETER = 'finished=false';

// ----------------- PRIVATE FUNCTIONS --------------------------

/**
 * Function responsible for loading the authorization header into any request about to be sent to UpWave
 *
 * @param {Object} headers - the headers to augment with the authorization token
 *
 *
 * @author kinsho
 */
function _loadAuthorizationHeaders(headers)
{
	headers['Authorization'] = 'Token ' + config.UPWAVE_API_KEY;
}

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function responsible for fetching all open task cards
	 *
	 * @returns {Object} - a collection of all open tasks, separated out into categories
	 *
	 * @author kinsho
	 */
	getCards: async function ()
	{
		var cardsURL = config.UPWAVE_API_DOMAIN + GET_CARDS_API + '?' + NOT_FINISHED_PARAMETER,
			cardCollection =
			{
				estimates: [],
				customers: [],
				installations: []
			},
			subtaskURL,
			headers = {},
			data, subtaskData, cachedCards,
			i;

		// Put the authorization token into the headers that will be sent over to upwave
		_loadAuthorizationHeaders(headers);

		// Check if the cards have been recently stashed in our database. If so, just return that cached data
		cachedCards = await upwaveDAO.readCachedCards();
		if (cachedCards)
		{
			return cachedCards;
		}

		// Make the request to UpWave to get the data
		console.log('About to make a call to ' + cardsURL);
		data = await _request(
		{
			url: cardsURL,
			headers: headers
		});
		// Parse the information from the body
		data = JSON.parse(data).results;

		for (i = 0; i < data.length; i++)
		{
			// For each card, pull any sub-tasks that may be associated with that card
			if (data[i].progress.total)
			{
				subtaskURL = config.UPWAVE_API_DOMAIN + TASK_LIST_ITEMS_API + '?' + CARD_ID_PARAMETER + data[i].id;

				console.log('About to make a call to ' + subtaskURL);
				subtaskData = await _request(
				{
					url: subtaskURL,
					headers: headers
				});

				data[i].subtasks = JSON.parse(subtaskData).results;
			}

			// For each card, make sure to parse the description from the title and wipe out any HTML markup
			data[i].description = data[i].description.slice(data[i].description.indexOf('</h1>') + 5);
			data[i].description = _striptags(data[i].description);

			// Sort the cards into categories
			if (data[i].board.title === BOARD_NAMES.CUSTOMERS)
			{
				cardCollection.customers.push(data[i]);
			}
			else if (data[i].board.title === BOARD_NAMES.ESTIMATES)
			{
				cardCollection.estimates.push(data[i]);
			}
			else if (data[i].board.title === BOARD_NAMES.INSTALLATIONS)
			{
				cardCollection.installations.push(data[i]);
			}
		}

		// Cache the processed card data into our database so that we can cache it for the next hour or so
		await upwaveDAO.insertUpwaveData(cardCollection);

		return cardCollection;
	}
};