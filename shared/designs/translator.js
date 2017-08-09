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
	 * Function that returns the design name that relates to a particular code, if such a code exists within our
	 * dictionary
	 *
	 * @param {String} designCode - the design code associated with the design that we're looking for
	 *
	 * @returns {String} - the full name of the design or the design code should there not be a name within our
	 * 		dictionary
	 *
	 * @author kinsho
	 */
	findDesignName: function(designCode)
	{
		var pricingData = pricing.DESIGNS[designCode];

		return (pricingData ? pricingData.name : designCode);
	},

	/**
	 * Function that determines whether a given design code relates to a design that's standardized within the system
	 *
	 * @param {String} designCode - the design code to evaluate
	 *
	 * @returns {Boolean} - a flag indicating whether the design has been standardized
	 *
	 * @author kinsho
	 */
	isCustomDesign: function(designCode)
	{
		return (designCode && !(pricing.DESIGNS[designCode]));
	}
};