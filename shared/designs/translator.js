/**
 * A module responsible for fetching design names
 *
 * @module translator
 */

// ----------------- EXTERNAL MODULES --------------------------
// Dependencies must be pulled differently depending on whether we are pulling these files from within the server
// or within the client

var pricing;

if (global.OwlStakes)
{
	pricing = global.OwlStakes.require('shared/pricing/pricingData');
}
else
{
	pricing = require('shared/pricing/pricingData');
}

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function that the design name that relates to a particular code
	 *
	 * @param {String} designCode - the design code associated with the design that we're looking for
	 *
	 * @returns {String} - the full name of the design
	 *
	 * @author kinsho
	 */
	findDesignName: function(designCode)
	{
		return pricing.DESIGNS[designCode].name;
	}
};