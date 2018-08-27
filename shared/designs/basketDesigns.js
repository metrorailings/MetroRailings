/**
 * A module listing important information about all the basket designs
 *
 * @module basketDesigns
 */

// ----------------- EXTERNAL MODULES --------------------------

// @TODO - Incorporate pricing here
// import pricing from 'shared/pricing/pricingData';

// ----------------- MODULE DEFINITION --------------------------

var basketDesigns =
{
	options:
	[
		{
			id: 'BSKT-NONE',
			label: 'No',
			technicalLabel: 'No',
			spanishLabel: 'No'
		},
		{
			id: 'BSKT-10',
			label: '1-0 Basket Pattern',
			technicalLabel: '1-0 Basket Pattern',
			spanishLabel: '1-0 Patrón de Cesta'
		},
		{
			id: 'BSKT-11',
			label: '1-1 Basket Pattern',
			technicalLabel: '1-1 Basket Pattern',
			spanishLabel: '1-1 Patrón de Cesta'
		},
		{
			id: 'BSKT-12',
			label: '1-2 Basket Pattern',
			technicalLabel: '1-2 Basket Pattern',
			spanishLabel: '1-2 Patrón de Cesta'
		}
	],
	designMetadata: [],
	technicalLabel: 'Baskets',
	spanishLabel: 'Cestas'
};

// ----------------- EXPORT --------------------------

module.exports = basketDesigns;