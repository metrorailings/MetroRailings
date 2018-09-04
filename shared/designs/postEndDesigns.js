/**
 * A module listing important information about all the post end designs
 *
 * @module postEndDesigns
 */
// ----------------- EXTERNAL MODULES --------------------------

// @TODO - Incorporate pricing here
// import pricing from 'shared/pricing/pricingData';

// ----------------- MODULE DEFINITION --------------------------

var postEndDesigns =
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
			id: 'PE-VOL',
			label: 'Volute',
			technicalLabel: 'Volute',
			spanishLabel: 'Voluta'
		},
		{
			id: 'PE-LT',
			label: 'Lamb\'s Tongue',
			technicalLabel: 'Regular Lamb\'s Tongue',
			spanishLabel: 'Lengua de cordero regular'
		},
		{
			id: 'PE-SLT',
			label: 'Skinny Lamb\'s Tongue',
			technicalLabel: 'Skinny Lamb\'s Tongue',
			spanishLabel: 'Lengua de cordero flaco'
		},
		{
			id: 'PE-EXT',
			label: 'Extension',
			technicalLabel: 'Extension',
			spanishLabel: 'Extensión'
		}
	],
	designMetadata: [],
	technicalLabel: 'Post End',
	spanishLabel: 'Poste Final'
};

// ----------------- EXPORT --------------------------

module.exports = postEndDesigns;