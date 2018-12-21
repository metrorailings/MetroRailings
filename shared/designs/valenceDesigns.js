/**
 * A module listing important information about all the valence designs
 *
 * @module valenceDesigns
 */

// ----------------- EXTERNAL MODULES --------------------------

// @TODO - Incorporate pricing here
// import pricing from 'shared/pricing/pricingData';

// ----------------- MODULE DEFINITION --------------------------

var valenceDesigns =
{
	options:
	[
		{
			id: 'VAL-RINGS',
			label: 'Rings',
			technicalLabel: 'Rings',
			spanishLabel: 'Anillos',
			description: 'A top channel will be designed into the railing. The upper channel will feature' +
				' rings that will be lined up against one another along the length of the channel.'
		},
		{
			id: 'VAL-SCR',
			label: 'Scrolls',
			technicalLabel: 'Scrolls',
			spanishLabel: 'Rollos',
			description: 'A top channel will be designed into the railing. The upper channel will feature wispy' +
				' scrolls that will line up against one another.'
		},
		{
			id: 'VAL-GTHC',
			label: 'Gothic',
			technicalLabel: 'Gothic',
			spanishLabel: 'Gótico',
			description: 'A top channel will be designed into the railing. The upper channel will feature a' +
				' decorative pattern modeled after Romanesque architectural designs.'
		},
		{
			id: 'VAL-ANTQ',
			label: 'Antique',
			technicalLabel: 'Antique',
			spanishLabel: 'Antiguo',
			description: 'A top channel will be designed into the railing. The upper channel will feature an' +
				' elegant metal vine that runs along the length of the railing in a sinusoidal fashion.'
		},
		{
			id: 'VAL-VINE',
			label: 'Grapevine',
			technicalLabel: 'Grapevine',
			spanishLabel: 'Vid',
			description: 'A top channel will be designed into the railing. The upper channel will feature a' +
				' grapevine pattern running horizontally in a sinusoidal fashion.'
		},
		{
			id: 'VAL-WAVE',
			label: 'Wave',
			technicalLabel: 'Wave',
			spanishLabel: 'Ola',
			description: 'A top channel will be designed into the railing. The upper channel will feature swirl-like' +
				' patterns that resemble ocean waves.'
		},
		{
			id: 'VAL-DMNDS',
			label: 'Diamonds',
			technicalLabel: 'Diamonds',
			spanishLabel: 'Diamante',
			description: 'A top channel will be designed into the railing. The upper channel will feature diamond' +
				' outlines lined up horizontally against one another.'
		},
		{
			id: 'VAL-VSTA',
			label: 'Vista',
			technicalLabel: 'Vista',
			spanishLabel: 'Vista',
			description: 'A top channel will be designed into the railing. The upper channel will feature no' +
				' decorative scrolls or effects. Instead, every odd baluster built into the body of the railing will' +
				' extend upwards through this channel all the way to the top handrail (like with a traditional railing).'
		}
	],
	designMetadata: [],
	technicalLabel: 'Valence Designs',
	spanishLabel: 'Diseños del Valencias'
};

// ----------------- EXPORT --------------------------

module.exports = valenceDesigns;