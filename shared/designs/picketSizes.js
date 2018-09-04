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
			id: '',
			label: 'N/A',
			technicalLabel: 'N/A',
			spanishLabel: 'N/A'
		},
		{
			id: 'PCKT-1/2',
			label: '1/2"',
			technicalLabel: '1/2"',
			spanishLabel: '1/2"'
		},
		{
			id: 'PCKT-5/8',
			label: '5/8"',
			technicalLabel: '5/8"',
			spanishLabel: '5/8"'
		},
		{
			id: 'PCKT-3/4',
			label: '3/4"',
			technicalLabel: '3/4"',
			spanishLabel: '3/4"'
		},
		{
			id: 'PCKT-1',
			label: '1"',
			technicalLaabel: '1"',
			spanishLabel: '1"'
		},

		{
			id: 'PCKT-1.5',
			label: '1-1/2"',
			technicalLabel: '1-1/2"',
			spanishLabel: '1-1/2"'
		},

		{
			id: 'PCKT-2',
			label: '2"',
			technicalLabel: '2"',
			spanishLabel: '2"'
		}

	],
	designMetadata: [],
	technicalLabel: 'Picket Size',
	spanishLabel: 'Tamaño de Piquete'
};

// ----------------- EXPORT --------------------------

module.exports = picketSizes;