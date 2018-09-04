/**
 * A module listing important information about all the post cap designs
 *
 * @module postCapDesigns
 */
// ----------------- EXTERNAL MODULES --------------------------

// @TODO - Incorporate pricing here
// import pricing from 'shared/pricing/pricingData';

// ----------------- MODULE DEFINITION --------------------------

var postCapDesigns =
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
			id: 'PC-BALL',
			label: 'Ball',
			technicalLabel: 'Ball',
			spanishLabel: 'Pelota'
		},
		{
			id: 'PC-FLAT',
			label: 'Flat',
			technicalLabel: 'Flat',
			spanishLabel: 'Plano'
		},
		{
			id: 'PC-PYR',
			label: 'Pyramid',
			technicalLabel: 'Pyramid',
			spanishLabel: 'Pirámide'
		},
		{
			id: 'PC-RGL',
			label: 'Regal',
			technicalLabel: 'Regal',
			spanishLabel: 'Regio'
		}
	],
	designMetadata: [],
	technicalLabel: 'Post Cap',
	spanishLabel: 'Tapa de Poste'
};

// ----------------- EXPORT --------------------------

module.exports = postCapDesigns;