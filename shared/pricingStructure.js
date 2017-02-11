/**
 * A module responsible for describing the pricing structure and calculating order totals
 *
 * @module pricingStructure
 */

// ----------------- PRIVATE FUNCTIONS --------------------------

var COST_PER_FOOT_OF_RAILING = 60.00,
	MINIMUM_TOTAL = 600.00;

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function calculates the total price for any order
	 *
	 * @param {Number} length - the length of railing needed for the order
	 *
	 * @returns {Number} - the total price for the order
	 *
	 * @author kinsho
	 */
	calculateOrderTotal: function(length)
	{
		var rawTotal = (length * COST_PER_FOOT_OF_RAILING).toFixed(2);

		// If the raw total falls below that of the minimum amount required for us to service an order, then we must
		// set the order total to the minimum amount instead
		return (Math.max(rawTotal, MINIMUM_TOTAL));
	}
};