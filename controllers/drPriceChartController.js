/**
 * @module drPriceChartController
 */

// ----------------- EXTERNAL MODULES --------------------------

const controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper');

// ----------------- ENUM/CONSTANTS --------------------------

const PRICE_CHART_URL = '/priceChart?code\=dr';

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Initializer function responsible for redirecting to the generic price chart controller
	 *
	 * @author kinsho
	 */
	init: async function()
	{
		return await controllerHelper.renderRedirectView(PRICE_CHART_URL);
	}
};