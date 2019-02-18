/**
 * A module listing important information about all the picket designs
 *
 * @module picketSizes
 */
// ----------------- EXTERNAL MODULES --------------------------

// @TODO - Incorporate pricing here
// import pricing from 'shared/pricing/pricingData';

// ----------------- MODULE DEFINITION --------------------------

var picketSizes =
{
	options:
	[
		{
			id: 'PCKT-1/2',
			label: '1/2"',
			technicalLabel: '1/2"',
			spanishLabel: '1/2"',
			description: 'All pickets will be 1/2" in length and width.'
		},
		{
			id: 'PCKT-5/8',
			label: '5/8"',
			technicalLabel: '5/8"',
			spanishLabel: '5/8"',
			description: 'All pickets will be 5/8" in length and width.'
		},
		{
			id: 'PCKT-3/4',
			label: '3/4"',
			technicalLabel: '3/4"',
			spanishLabel: '3/4"',
			description: 'All pickets will be 3/4" in length and width.'
		},
		{
			id: 'PCKT-1',
			label: '1"',
			technicalLaabel: '1"',
			spanishLabel: '1"',
			description: 'All pickets will be 1" in length and width.'
		},
		{
			id: 'PCKT-1.5',
			label: '1-1/2"',
			technicalLabel: '1-1/2"',
			spanishLabel: '1-1/2"',
			description: 'All pickets will be 1.5" in length and width.'
		},
		{
			id: 'PCKT-2',
			label: '2"',
			technicalLabel: '2"',
			spanishLabel: '2"',
			description: 'All pickets will be 2" in length and width.'
		}
	],
	designMetadata: [],
	technicalLabel: 'Picket Size',
	spanishLabel: 'Tamaño de Piquete'
};

// ----------------- EXPORT --------------------------

module.exports = picketSizes;