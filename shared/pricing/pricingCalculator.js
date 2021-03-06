/**
 * A module responsible for calculating order subtotals
 *
 * @module pricingStructure
 */

// ----------------- EXTERNAL MODULES --------------------------

// Dependencies must be pulled differently depending on whether we are pulling these files from within the server
// or within the client

let pricing;

if (global.OwlStakes)
{
	pricing = global.OwlStakes.require('shared/pricing/pricingData');
}
else
{
	pricing = require('shared/pricing/pricingData');
}

// ----------------- ENUMS/CONSTANTS --------------------------

const NJ_STATE_CODE = 'NJ';

// ----------------- MODULE DEFINITION --------------------------

let pricingModule =
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
	calculateSubtotal: function(orderData)
	{
		let rawTotal = orderData.dimensions.length * orderData.pricing.pricePerFoot;

		// Add in any additional pricing that has been set on this order
		rawTotal += (orderData.pricing.additionalPrice || 0);

		return rawTotal;
	},

	/**
	 * Function calculates the total price for any estimate
	 *
	 * @param {Number} distance - the distance we would need to travel to visit the customer at the location where
	 * they need railings
	 *
	 * @returns {Number} - the total price for the order
	 *
	 * @author kinsho
	 */
	calculateEstimateTotal: function(distance)
	{
		return (pricing.MINIMUM_COST_PER_ESTIMATE + (distance * pricing.COST_PER_MILE_TRAVELED));
	},

	/**
	 * Function calculates the tax given a particular value
	 *
	 * @param {Number} amount - the given dollar amount for which to calculate tax
	 * @param {Object} order - the order, should we need to analyze details about the order itself to properly
	 * 		assess tax
	 *
	 * @returns {Number} - the tax for the given dollar amount
	 *
	 * @author kinsho
	 */
	calculateTax: function(amount, order)
	{
		// Only calculate taxes for orders that permit taxes to be charged for orders based in
		// the state of New Jersey
		if (amount && order.pricing.isTaxApplied && (order.customer.state === NJ_STATE_CODE))
		{
			// Let's not forget to do some floor rounding in the event that we have more than two numbers to the
			// right of the decimal point
			return Math.floor(amount * pricing.NJ_SALES_TAX_RATE * 100) / 100;
		}

		return 0.00;
	},

	/**
	 * Function calculates the tariffs to charge on a given value
	 *
	 * @param {Number} amount - the given dollar amount for which to calculate tax
	 * @param {Object} order - the order, should we need to analyze details about the order itself to properly
	 * 		assess tariffs
	 *
	 * @returns {Number} - the tariffs for the given dollar amount
	 *
	 * @author kinsho
	 */
	calculateTariffs: function(amount, order)
	{
		// Only calculate taxes for orders that permit taxes to be charged for orders based in
		// the state of New Jersey
		if (amount && order.pricing.isTariffApplied)
		{
			// Let's not forget to do some floor rounding in the event that we have more than two numbers to the
			// right of the decimal point
			return Math.floor(amount * pricing.TARIFF_RATE * 100) / 100;
		}

		return 0.00;
	},

	/**
	 * Function calculates the overall total charge after factoring any tariffs, taxes, and/or fees into the subtotal
	 *
	 * @param {Object} order - the order from which we will gather information to calculate the total price
	 *
	 * @returns {Number} - the total price of the order
	 *
	 * @author kinsho
	 */
	calculateTotal: function(order)
	{
		return order.pricing.subtotal + order.pricing.tax + order.pricing.tariff;
	},

	/**
	 * Function calculates the Stripe fees that will be paid out from any given amount
	 *
	 * @param {Number} amount - the amount from which to calculate Stripe fees
	 *
	 * @returns {Number} - the Stripe fee
	 *
	 * @author kinsho
	 */
	calculateStripeFee: function(amount)
	{
		// The raw stripe fee
		let stripeFee = (amount * pricing.STRIPE_FEE_PERCENTAGE) + pricing.STRIPE_FEE_ADDITIONAL;

		// Now round the stripe fee down to 2 decimal places
		stripeFee *= 100;
		stripeFee = Math.round(stripeFee);
		stripeFee /= 100;

		return parseFloat(stripeFee.toFixed(2));
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
		let designPricing = pricingModule.findDesignPricing(designCode),
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