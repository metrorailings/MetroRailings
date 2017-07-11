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
	 * Function calculates the total price for any custom order
	 *
	 * @param {Object} orderData - the basic information that generally sums up the order
	 *
	 * @returns {Number} - the total price for the order
	 *
	 * @author kinsho
	 */
	calculateOrderTotal: function(orderData)
	{
		var rawTotal = orderData.length * orderData.pricing.pricePerFoot,
			designKeys = Object.keys(orderData.design),
			i;

		// For each design, determine if it is a premium design. If so, add in its price to the raw total
		for (i = designKeys.length - 1; i >= 0; i--)
		{
			if (orderData.design[designKeys[i]])
			{
				rawTotal += pricingModule.calculateDesignCost(orderData.length, orderData.design[designKeys[i]]);
			}
		}

		// Add in any custom pricing
		rawTotal += orderData.pricing.additionalPrice;

		return rawTotal.toFixed(2);
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

		if (designPricing && designPricing.price)
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