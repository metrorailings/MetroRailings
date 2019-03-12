// ----------------- EXTERNAL MODULES --------------------------

const drPriceChart = global.OwlStakes.require('shared/priceCharts/deckRemodelers');

// ----------------- ENUMS/CONSTANTS --------------------------

const DR_CODE = 'dr';

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
			if (code === DR_CODE)
			{
				return drPriceChart;
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