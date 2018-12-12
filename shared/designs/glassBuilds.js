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
			spanishLabel: '1/2" Templado',
			description: 'All panels of glass used in this project will be 1/2" thick and strengthened through' +
				' heat-treating.'
		},
		{
			id: 'GLASS-DESIGN-LMNTD',
			label: '1/2" Laminated',
			technicalLabel: '1/2" Laminated',
			spanishLabel: '1/2" Laminado',
			description: 'All panels of glass used in this project will be 1/2" thick and laminated for further' +
				' resiliency.'
		},
		{
			id: 'GLASS-DESIGN-ENHNCED',
			label: '1/2" Tempered-Laminated',
			technicalLabel: '1/2" Tempered-Laminated',
			spanishLabel: '1/2" Templado-Laminado',
			description: 'All panels of glass used in this project will be 1/2" thick. Each panel of glass' +
				' will actually be constructed from two sheets of glass that will be bound together with' +
				' specialized plastic resin. All sheets of glass will be heat-treated as well for additional' +
				' durability.'
		},
	],
	designMetadata: [],
	technicalLabel: 'Glass',
	spanishLabel: 'Vidrio'
};

// ----------------- EXPORT --------------------------

module.exports = glassBuilds;