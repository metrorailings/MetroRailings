// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('handlebars'),

	pricingStructure = global.OwlStakes.require('shared/pricing/pricingData'),
	pricingCalculator = global.OwlStakes.require('shared/pricing/pricingCalculator');

// ----------------- ENUMS/CONSTANTS --------------------------

var PER_FOOT_PHRASE = ' per foot of railing',
	PER_FEET_PHRASE = ' per ::rate feet of railing',
	RATE_PLACEHOLDER = '::rate';

// ----------------- HANDLEBARS HELPERS --------------------------

/**
 * Handlebars helper function designed to fetch prices for individual design options
 *
 * @author kinsho
 */
_Handlebars.registerHelper('fetch_design_price', function(designCode)
{
	var designPricing = pricingStructure.DESIGNS[designCode];

	if (designPricing.rate)
	{
		if (designPricing.rate === 1)
		{
			return designPricing.price + PER_FOOT_PHRASE;
		}
		else
		{
			return designPricing.price + PER_FEET_PHRASE.replace(RATE_PLACEHOLDER, designPricing.rate);
		}
	}
	else if (designPricing.price)
	{
		return designPricing.price;
	}

	return '';
});

/**
 * Handlebars helper function designed to fetch subtotals for each design selection
 *
 * @author kinsho
 */
_Handlebars.registerHelper('calculate_design_subtotal', function(designCode, orderLength)
{
	return (pricingCalculator.calculateDesignCost(orderLength, designCode) || '');
});

/**
 * Handlebars helper function designed to calculate the total price of railings based on length alone
 *
 * @author kinsho
 */
_Handlebars.registerHelper('calculate_length_subtotal', function (length, costPerFoot)
{
	// Custom orders can carry their own cost per footage sometimes
	if (costPerFoot)
	{
		return (length * costPerFoot);
	}
	// Standard orders follow traditional pricing rules though
	else
	{
		return Math.max(pricingStructure.MINIMUM_TOTAL, length * pricingStructure.COST_PER_FOOT_OF_RAILING);
	}
});
