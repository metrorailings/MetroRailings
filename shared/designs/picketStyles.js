/**
 * A module listing important information about all the picket styles
 *
 * @module picketStyles
 */

// ----------------- EXTERNAL MODULES --------------------------

// @TODO - Incorporate pricing here
// import pricing from 'shared/pricing/pricingData';

// ----------------- MODULE DEFINITION --------------------------

var picketStyles =
{
	options:
	[
		{
			id: 'PCKT-STY-PLAIN',
			label: 'Plain Pickets',
			technicalLabel: 'Plain',
			spanishLabel: 'Simple',
			description: 'All pickets will be square in appearance.'
		},
		{
			id: 'PCKT-STY-PIPE',
			label: 'Pipe Pickets',
			technicalLabel: 'Pipe',
			spanishLabel: 'Tubo',
			description: 'All pickets will be cylindrical in appearance, with a diameter of 1.5".'
		},
		{
			id: 'PCKT-STY-TWST',
			label: 'Twisted Pickets',
			technicalLabel: 'Twisted',
			spanishLabel: 'Retorcido',
			description: 'At least some pickets will be twisted along the shaft for decorative effect.'
		},
		{
			id: 'PCKT-STY-BOW',
			label: 'Bowed Pickets',
			technicalLabel: 'Bowed',
			spanishLabel: 'Arco',
			description: 'All pickets will curve outward like a bow.'
		}
	],
	designMetadata: [],
	technicalLabel: 'Picket Style',
	spanishLabel: 'Estilo de Piquete'
};

// ----------------- EXPORT --------------------------

module.exports = picketStyles;