/**
 * A module responsible for calculating order subtotals
 *
 * @module pricingStructure
 */

// ----------------- EXTERNAL MODULES --------------------------

var pricing = global.OwlStakes.require('shared/pricing/pricingData');

// ----------------- MODULE DEFINITION --------------------------

var pricingModule =
{
	/**
	 * Function calculates the total price for any order
	 *
	 * @param {Object} orderData - the basic information that generally sums up the order
	 *
	 * @returns {Number} - the total price for the order
	 *
	 * @author kinsho
	 */
	calculateOrderTotal: function(orderData)
	{
		var rawTotal = (orderData.length * pricing.COST_PER_FOOT_OF_RAILING).toFixed(2),
			designKeys = Object.keys(orderData.design),
			i;

		// For all orders below a certain number of feet, a minimum has to be charged
		rawTotal = Math.max(pricing.MINIMUM_TOTAL, rawTotal);

		// For each design, determine if it is a premium design. If so, add in its price to the raw total
		for (i = designKeys.length - 1; i >= 0; i--)
		{
			if (orderData.design[designKeys[i]])
			{
				rawTotal += pricingModule.calculateDesignCost(orderData.length, orderData.design[designKeys[i]]);
			}
		}

		// If the raw total falls below that of the minimum amount required for us to service an order, then we must
		// set the order total to the minimum amount instead
		return (Math.max(rawTotal, pricing.MINIMUM_TOTAL));
	},

	/**
	 * Function that returns pricing metadata for a particular design
	 *
	 * @param {String} designCode - the design code associated with the design that we're looking for
	 *
	 * @returns {Object} - the design's pricing structure
	 *
	 * @author kinsho
	 */
	findDesignPricing: function(designCode)
	{
		return pricing.DESIGNS[designCode];
	},

	/**
	 * Function that returns pricing metadata for a particular design
	 *
	 * @param {Number} orderLength - the length of railing requested from the customer
	 * @param {Object} designCode - the design code associated with the design that we're calculating the subtotal for
	 *
	 * @returns {float} - the subtotal for the design selection
	 *
	 * @author kinsho
	 */
	calculateDesignCost: function(orderLength, designCode)
	{
		var designPricing = pricingModule.findDesignPricing(designCode),
			subtotal;

		if (designPricing.price)
		{
			if (designPricing.rate)
			{
				subtotal = Math.floor(orderLength / designPricing.rate) * designPricing.price;
				// Should the subtotal be equal to 0 (in the event that the length of railing requested is not
				// greater than the pricing rate), just return the raw price itself
				return Math.max(designPricing.price, subtotal);
			}
			// Else return the price itself and assume that price reflects the actual price of the addition of
			// that design option
			else
			{
				return designPricing.price;
			}
		}

		return 0;
	}
};

// ----------------- EXPORT MODULE --------------------------

module.exports = pricingModule;