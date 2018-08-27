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
			spanishLabel: 'Gris'
		},
		{
			id: 'CBL-CAP-BLACK',
			label: 'Black Caps',
			technicalLabel: 'Black',
			spanishLabel: 'Negro'
		},
		{
			id: 'CBL-CAP-WHITE',
			label: 'White Caps',
			technicalLabel: 'White',
			spanishLabel: 'Blanco'
		}
	],
	designMetadata: [],
	technicalLabel: 'Cable Caps',
	spanishLabel: 'Tapas de Cables'
};

// ----------------- EXPORT --------------------------

module.exports = cableCaps;