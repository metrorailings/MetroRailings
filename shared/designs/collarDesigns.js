/**
 * A module listing important information about all the collar designs
 *
 * @module collarDesigns
 */

// ----------------- EXTERNAL MODULES --------------------------

// @TODO - Incorporate pricing here
// import pricing from 'shared/pricing/pricingData';

// ----------------- MODULE DEFINITION --------------------------

var collarDesigns =
{
	options:
	[
		{
			id: 'CLLR-NONE',
			label: 'No',
			technicalLabel: 'No',
			spanishLabel: 'No'
		},
		{
			id: 'CLLR-10',
			label: '1-0 Collar Pattern',
			technicalLabel: '1-0 Collar Pattern',
			spanishLabel: '1-0 Patrón de Cuello'
		},
		{
			id: 'CLLR-11',
			label: '1-1 Collar Pattern',
			technicalLabel: '1-1 Collar Pattern',
			spanishLabel: '1-1 Patrón de Cuello'
		},
		{
			id: 'CLLR-12',
			label: '1-2 Collar Pattern',
			technicalLabel: '1-2 Collar Pattern',
			spanishLabel: '1-2 Patrón de Cuello'
		}
	],
	designMetadata: [],
	technicalLabel: 'Collars',
	spanishLabel: 'Collares'
};

// ----------------- EXPORT --------------------------

module.exports = collarDesigns;