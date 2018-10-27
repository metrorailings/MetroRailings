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
			spanishLabel: 'Voluta',
			description: 'Given that the handrailings will be placed over the top of the posts, all handrailings' +
				' will have their ends folded downward into a circular finish.'
		},
		{
			id: 'PE-LT',
			label: 'Lamb\'s Tongue',
			technicalLabel: 'Regular Lamb\'s Tongue',
			spanishLabel: 'Lengua de cordero regular',
			description: 'Given that the handrailings will be placed over the top of the posts, all handrailings' +
				' will have their ends curled downward gracefully.'
		},
		{
			id: 'PE-SLT',
			label: 'Skinny Lamb\'s Tongue',
			technicalLabel: 'Skinny Lamb\'s Tongue',
			spanishLabel: 'Lengua de cordero flaco',
			description: 'Given that the handrailings will be placed over the top of the posts, all handrailings' +
				' will have their ends curled downward gracefully. Note that these ends will be skinnier in width' +
				' than usual as well.'
		},
		{
			id: 'PE-EXT',
			label: 'Extension',
			technicalLabel: 'Extension',
			spanishLabel: 'Extensión',
			description: 'Given that the handrailings will be placed over the top of the posts, all handrailings' +
				' will have their ends extend out horizontally past the post a few inches.'
		}
	],
	designMetadata: [],
	technicalLabel: 'Post End',
	spanishLabel: 'Poste Final'
};

// ----------------- EXPORT --------------------------

module.exports = postEndDesigns;