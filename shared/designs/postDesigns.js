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
			id: 'P-SP',
			label: 'Standard Post (1.5")',
			technicalLabel: '1.5"',
			spanishLabel: '1.5"',
			description: 'All posts will be 1.5" square.'
		},
		{
			id: 'P-2P',
			label: 'Laguna Post (2")',
			technicalLabel: '2"',
			spanishLabel: '2"',
			description: 'All posts will be 2" square.'
		},
		{
			id: 'P-BPC',
			label: 'Colonial Post (2.5")',
			technicalLabel: '2.5"',
			spanishLabel: '2.5"',
			description: 'All posts will be 2.5" square.'
		},
		{
			id: 'P-3P',
			label: 'Pillar Post (3")',
			technicalLabel: '3"',
			spanishLabel: '3"',
			description: 'All posts will be 3" square.'
		},
		{
			id: 'P-MIX',
			label: 'Mixed Posts',
			technicalLabel: 'Mixed',
			spanishLabel: 'Mezclado',
			description: 'Post sizes will vary at certain points along the railings.'
		}
	],
	designMetadata: [],
	technicalLabel: 'Post Type',
	spanishLabel: 'Tipo de Poste'
};

// ----------------- EXPORT --------------------------

module.exports = postDesigns;