/**
 * A module listing important information about all the post end designs
 *
 * @module postEndDesigns
 */
// ----------------- EXTERNAL MODULES --------------------------

import pricing from 'shared/pricing/pricingData';

// ----------------- MODULE DEFINITION --------------------------

var postEndDesigns =
{
	options:
	[
		{
			id: 'PE-VOL',
			label: 'Volute',
			previewImage: 'client/images/designs/postEnd/volute-1.jpg'
		},
		{
			id: 'PE-LT',
			label: 'Lamb\'s Tongue',
			previewImage: 'client/images/designs/postEnd/lambsTongue-1.jpg',
		},
		{
			id: 'PE-SCRL',
			label: 'Scroll',
			previewImage: 'client/images/designs/postEnd/scroll-1.jpg'
		}
	],
	designMetadata:
	[
		{
			id: 'PE-VOL',
			label: 'Volute',
			price: pricing.DESIGNS['PE-VOL'].price,
			designDescription: 'A design that\'s been around for decades, nothing has yet supplanted the volute end as ' +
				'the standard when it comes to finishing off the top handrailing. The volute end will always ' +
				'remain a time-tested charmer.',
			designImages:
			[
				'client/images/designs/postEnd/volute-2.jpg',
				'client/images/designs/postEnd/volute-3.jpg',
				'client/images/designs/postEnd/volute-4.jpg'
			]
		},
		{
			id: 'PE-LT',
			label: 'Lamb\'s Tongue',
			price: pricing.DESIGNS['PE-LT'].price,
			designDescription: 'Those looking for a more elegant finish may want to opt for the lamb\'s tongue, a thick ' +
				'curl of aluminum that gracefully slides off the end of the handrail.',
			designImages:
			[
				'client/images/designs/postEnd/lambsTongue-2.jpg',
				'client/images/designs/postEnd/lambsTongue-3.jpg',
				'client/images/designs/postEnd/lambsTongue-4.jpg'
			]
		},
		{
			id: 'PE-SCRL',
			label: 'Scroll',
			price: pricing.DESIGNS['PE-SCRL'].price,
			designDescription: 'Skinnier than the lamb\'s tongue finish, the scroll end is perfect for those looking ' +
				'for a softer, slender finish to their handrailing.',
			designImages:
			[
				'client/images/designs/postEnd/scroll-2.jpg',
				'client/images/designs/postEnd/scroll-3.jpg'
			]
		}
	]
};

// ----------------- EXPORT --------------------------

export default postEndDesigns;