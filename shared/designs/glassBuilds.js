/**
 * A module listing important information about all the various glass designs
 *
 * @module glassBuilds
 */
// ----------------- EXTERNAL MODULES --------------------------

// @TODO - Incorporate pricing here
// import pricing from 'shared/pricing/pricingData';

// ----------------- MODULE DEFINITION --------------------------

var glassBuilds =
{
	options:
	[
		{
			id: 'GLASS-DESIGN-STND',
			label: '1/2" Tempered',
			technicalLabel: '1/2" Tempered',
			spanishLabel: '1/2" Templado'
		},
		{
			id: 'GLASS-DESIGN-ENHNCED',
			label: '1/2" Tempered-Laminated',
			technicalLabel: '1/2" Tempered-Laminated',
			spanishLabel: '1/2" Templado-Laminado'
		},
	],
	designMetadata: [],
	technicalLabel: 'Glass',
	spanishLabel: 'Vidrio'
};

// ----------------- EXPORT --------------------------

module.exports = glassBuilds;