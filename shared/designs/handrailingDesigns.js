/**
 * A module listing important information about all the handrailing designs
 *
 * @module handrailingDesigns
 */
// ----------------- EXTERNAL MODULES --------------------------
	
// @TODO - Incorporate pricing here
// import pricing from 'shared/pricing/pricingData';

// ----------------- MODULE DEFINITION --------------------------

var handrailingDesigns =
{
	options:
	[
		{
			id: 'H-S',
			label: 'Standard',
			technicalLabel: 'Standard',
			spanishLabel: 'Estándar'
		},
		{
			id: 'H-C',
			label: 'Colonial',
			technicalLabel: 'Colonial',
			spanishLabel: 'Colonial'
		},
		{
			id: 'H-P',
			label: 'Pipe',
			technicalLabel: 'Pipe',
			spanishLabel: 'Tubo'
		},
		{
			id: 'H-MW',
			label: 'Modern Wide (3" x 1")',
			technicalLabel: '3" x 1"',
			spanishLabel: '3" x 1"'
		},
		{
			id: 'H-SW',
			label: 'Modern Slim (2" x 1")',
			technicalLabel: '2" x 1"',
			spanishLabel: '2" x 1"'
		},
		{
			id: 'H-L',
			label: 'Laguna',
			technicalLabel: 'Laguna',
			spanishLabel: 'Laguna'
		},
		{
			id: 'H-HS',
			label: 'Hemisphere',
			technicalLabel: 'Semicircle',
			spanishLabel: 'Semicírculo'
		},
	],
	designMetadata: []
};

// ----------------- EXPORT --------------------------

module.exports = handrailingDesigns;