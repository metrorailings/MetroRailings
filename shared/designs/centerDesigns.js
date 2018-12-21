/**
 * A module listing important information about all the center designs
 *
 * @module centerDesigns
 */

// ----------------- EXTERNAL MODULES --------------------------

// @TODO - Incorporate pricing here
// import pricing from 'shared/pricing/pricingData';

// ----------------- MODULE DEFINITION --------------------------

var centerDesigns =
	{
		options:
		[
			{
				id: 'CD-S',
				label: 'S Scrolls',
				technicalLabel: 'S Scrolls',
				spanishLabel: 'S Scrolls',
				description: 'S-shaped scrolls will be integrated gracefully at various points along the middle of' +
					' each railing.'
			},
			{
				id: 'CD-SC',
				label: 'S/C Scrolls',
				technicalLabel: 'S/C Scrolls',
				spanishLabel: 'S/C Scrolls',
				description: 'S-shaped and C-shaped scrolls will be integrated gracefully at various' +
					' points along the middle of each railing.'
			},
			{
				id: 'CD-GALE',
				label: 'Gale',
				technicalLabel: 'Gale',
				spanishLabel: 'Vendaval',
				description: 'Scrolls shaped like wind swirls will be integrated gracefully at various' +
					' points along the middle of each railing.'
			}
		],
		designMetadata: [],
		technicalLabel: 'Center Designs',
		spanishLabel: 'Diseños del Centro'
	};

// ----------------- EXPORT --------------------------

module.exports = centerDesigns;