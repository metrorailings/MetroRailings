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
			spanishLabel: 'Pelota',
			description: 'All posts will be topped off with orb caps.'
		},
		{
			id: 'PC-FLAT',
			label: 'Flat',
			technicalLabel: 'Flat',
			spanishLabel: 'Plano',
			description: 'All posts will be topped off with nondescript square caps.'
		},
		{
			id: 'PC-PYR',
			label: 'Pyramid',
			technicalLabel: 'Pyramid',
			spanishLabel: 'Pirámide',
			description: 'All posts will be topped off with pyramid caps. These caps angle upward ever so slightly' +
				' toward a centrally fixed point, very similar to the way pyramids are designed.'
		},
		{
			id: 'PC-BSP',
			label: 'Bishop',
			technicalLabel: 'Bishop',
			spanishLabel: 'Obispo',
			description: 'All posts will be topped off with prominent caps that have a look that can best be' +
				' compared to that of a westernised religious mitre.'
		}
	],
	designMetadata: [],
	technicalLabel: 'Post Cap',
	spanishLabel: 'Tapa de Poste'
};

// ----------------- EXPORT --------------------------

module.exports = postCapDesigns;