// ----------------- EXTERNAL MODULES --------------------------

const drPriceChart = global.OwlStakes.require('shared/priceCharts/deckRemodelers'),
	boPriceChart = global.OwlStakes.require('shared/priceCharts/barrettOutdoors');

// ----------------- ENUMS/CONSTANTS --------------------------

const DECK_REMODELERS_CODE = 'dr',
	BARRETT_OUTDOORS_CODE = 'bo';

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function responsible for returning a price chart depending on the code fed into the function
	 *
	 * @param {String} code - the code which to use to fetch the corresponding price chart 
	 *
	 * @returns {Object} - the price chart being sought after
	 *
	 * @author kinsho
	 */
	retrievePriceChart: function (code)
	{
		try
		{
			if (code === DECK_REMODELERS_CODE)
			{
				return drPriceChart;
			}
			else if (code === BARRETT_OUTDOORS_CODE)
			{
				return boPriceChart;
			}

			return {};
		}
		catch(error)
		{
			console.log('Ran into an error fetching a price chart using the code ' + code + '!');
			console.log(error);

			throw error;
		}
	},

};