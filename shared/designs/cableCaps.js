/**
 * A module listing important information about all the various cable sizes
 *
 * @module cableCaps
 */
// ----------------- EXTERNAL MODULES --------------------------

// @TODO - Incorporate pricing here
// import pricing from 'shared/pricing/pricingData';

// ----------------- MODULE DEFINITION --------------------------

var cableCaps =
{
	options:
	[
		{
			id: 'CBL-CAP-GREY',
			label: 'Grey Caps',
			technicalLabel: 'Grey',
			spanishLabel: 'Gris',
			description: 'The metallic fixtured on the ends of each cable will be covered with a grey cap.'
		},
		{
			id: 'CBL-CAP-BLACK',
			label: 'Black Caps',
			technicalLabel: 'Black',
			spanishLabel: 'Negro',
			description: 'The metallic fixtured on the ends of each cable will be covered with a black cap.'
		},
		{
			id: 'CBL-CAP-WHITE',
			label: 'White Caps',
			technicalLabel: 'White',
			spanishLabel: 'Blanco',
			description: 'The metallic fixtured on the ends of each cable will be covered with a white cap.'
		}
	],
	designMetadata: [],
	technicalLabel: 'Cable Caps',
	spanishLabel: 'Tapas de Cables'
};

// ----------------- EXPORT --------------------------

module.exports = cableCaps;