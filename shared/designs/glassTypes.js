/**
 * A module listing important information about all the various glass railing types
 *
 * @module glassTypes
 */
// ----------------- EXTERNAL MODULES --------------------------

// @TODO - Incorporate pricing here
// import pricing from 'shared/pricing/pricingData';

// ----------------- MODULE DEFINITION --------------------------

var glassTypes =
{
	options:
	[
		{
			id: 'GLASS-FRAME',
			label: 'Framed Glass',
			technicalLabel: 'Framed',
			spanishLabel: 'Enmarcado'
		},
		{
			id: 'GLASS-FLOOR',
			label: 'Floor-Mounted Glass',
			technicalLabel: 'Floor',
			spanishLabel: 'Piso'
		},
		{
			id: 'GLASS-POST',
			label: 'Post-Mounted Glass',
			technicalLabel: 'Post',
			spanishLabel: 'Poste'
		},
		{
			id: 'GLASS-SIDE',
			label: 'Side-Mounted Glass',
			technicalLabel: 'Side',
			spanishLabel: 'Lado'
		}
	],
	designMetadata: [],
	technicalLabel: 'Glass Type',
	spanishLabel: 'Tipo de Vidrio'
};

// ----------------- EXPORT --------------------------

module.exports = glassTypes;