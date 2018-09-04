/**
 * A module listing important information about all the post designs
 *
 * @module postDesigns
 */
// ----------------- EXTERNAL MODULES --------------------------

// @TODO - Incorporate pricing here
// import pricing from 'shared/pricing/pricingData';

// ----------------- MODULE DEFINITION --------------------------

var postDesigns =
{
	options:
	[
		{
			id: '',
			label: 'N/A',
			technicalLabel: 'N/A',
			spanishLabel: 'N/A'
		},
		{
			id: 'P-SP',
			label: 'Standard Post (1.5")',
			technicalLabel: '1.5"',
			spanishLabel: '1.5"'
		},
		{
			id: 'P-2P',
			label: 'Laguna Post (2")',
			technicalLabel: '2"',
			spanishLabel: '2"'
		},
		{
			id: 'P-BPC',
			label: 'Colonial Post (2.5")',
			technicalLabel: '2.5"',
			spanishLabel: '2.5"'
		},
		{
			id: 'P-3P',
			label: 'Pillar Post (3")',
			technicalLabel: '3"',
			spanishLabel: '3"'
		}
	],
	designMetadata: [],
	technicalLabel: 'Post Type',
	spanishLabel: 'Tipo de Poste'
};

// ----------------- EXPORT --------------------------

module.exports = postDesigns;