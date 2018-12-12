/**
 * A module listing important information about all the handrailing designs
 *
 * @module handrailingDesigns
 */
// ----------------- EXTERNAL MODULES --------------------------
	
// @TODO - Incorporate pricing here
// import pricing from 'shared/pricing/pricingData';

// ----------------- MODULE DEFINITION --------------------------

var handrailingDesigns =
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
			id: 'H-S',
			label: 'Dixie',
			technicalLabel: 'Dixie',
			spanishLabel: 'Dixie',
			description: 'All railings will be topped off with a sleek handrail that curves slightly upward along' +
				' its centerline. Basically, these handrails resemble a shallow parabola.'
		},
		{
			id: 'H-C',
			label: 'Colonial',
			technicalLabel: 'Colonial',
			spanishLabel: 'Colonial',
			description: 'All railings will be topped off with a prominent handrail that angles ever so' +
				' slightly upward along its centerline. The sides of the handrail are grooved for decorative effect.'
		},
		{
			id: 'H-P',
			label: 'Pipe',
			technicalLabel: 'Pipe',
			spanishLabel: 'Tubo',
			description: 'All railings will be topped off with a hollow pipe handrail. The pipe is 1.5" in diameter.' +
				' All pipe ends will be capped with a welded cross-section of metal.'
		},
		{
			id: 'H-MS',
			label: 'Modern Slim (2" x 1")',
			technicalLabel: '2" x 1"',
			spanishLabel: '2" x 1"',
			description: 'All railings will be topped off with a hollow rectangular handrail. The width of the rail' +
				' will be 2" while the height of the rail will be 1". '
		},
		{
			id: 'H-MW',
			label: 'Modern Wide (3" x 1")',
			technicalLabel: '3" x 1"',
			spanishLabel: '3" x 1"',
			description: 'All railings will be topped off with a hollow rectangular handrail. The width of the rail' +
				' will be 3" while the height of the rail will be 1". '
		},
		{
			id: 'H-L',
			label: 'Laguna',
			technicalLabel: 'Laguna',
			spanishLabel: 'Laguna',
			description: 'All railings will be topped off with a handrail that curves slightly outward along its' +
				' upper edges. Think of a rectangular tube with the long edges of its top face jutting out ever so' +
				' slightly.'
		},
		{
			id: 'H-HS',
			label: 'Hemisphere',
			technicalLabel: 'Semicircle',
			spanishLabel: 'Semicírculo',
			description: 'All railings will be topped off with a hollow half-pipe handrail. The round half of the' +
				' handrail will be facing upward while the flat half will be facing downward toward the body of the' +
				' railing. The round part will be 1.5" in diameter.'
		},
	],
	designMetadata: [],
	technicalLabel: 'Handrailing',
	spanishLabel: 'Maldura'
};

// ----------------- EXPORT --------------------------

module.exports = handrailingDesigns;