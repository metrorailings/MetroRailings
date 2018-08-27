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
			spanishLabel: 'Simple'
		},
		{
			id: 'PCKT-STY-TWST',
			label: 'Twisted Pickets',
			technicalLabel: 'Twisted',
			spanishLabel: 'Retorcido'
		},
		{
			id: 'PCKT-STY-BOW',
			label: 'Bowed Pickets',
			technicalLabel: 'Bowed',
			spanishLabel: 'Arco'
		}
	],
	designMetadata: [],
	technicalLabel: 'Picket Style',
	spanishLabel: 'Estilo de Piquete'
};

// ----------------- EXPORT --------------------------

module.exports = picketStyles;