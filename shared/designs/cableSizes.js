/**
 * A module listing important information about all the various cable sizes
 *
 * @module cableSizes
 */
// ----------------- EXTERNAL MODULES --------------------------

// @TODO - Incorporate pricing here
// import pricing from 'shared/pricing/pricingData';

// ----------------- MODULE DEFINITION --------------------------

var cableSizes =
{
	options:
	[
		{
			id: 'CBL-SIZE-1/8',
			label: '1/8"',
			technicalLabel: '1/8"',
			spanishLabel: '1/8"',
			description: 'All cables will be an 1/8" of an inch in diameter.'
		},
		{
			id: 'CBL-SIZE-1/4',
			label: '1/4"',
			technicalLabel: '1/4"',
			spanishLabel: '1/4"',
			description: 'All cables will be a 1/4" of an inch in diameter.'
		}
	],
	designMetadata: [],
	technicalLabel: 'Cable Sizes',
	spanishLabel: 'Tamaños de Cable'
};

// ----------------- EXPORT --------------------------

module.exports = cableSizes;