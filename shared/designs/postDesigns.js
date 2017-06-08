/**
 * A module listing important information about all the post designs
 *
 * @module postDesigns
 */
// ----------------- EXTERNAL MODULES --------------------------

import pricing from 'shared/pricing/pricingData';

// ----------------- MODULE DEFINITION --------------------------

var postDesigns =
{
	options:
	[
		{
			id: 'P-BPC',
			label: 'Colonial Post',
			previewImage: 'client/images/designs/post/colonialPost-1.jpg',
		},
		{
			id: 'P-SP',
			label: 'Standard Post',
			previewImage: 'client/images/designs/post/standardPost-1.jpg',
			restrictions: { orderType: 'stairs' },
			restrictedMessage: 'This design option only applies to railings intended for stairways.'
		}
	],
	designMetadata:
	[
		{
			id: 'P-BPC',
			label: 'Colonial Post',
			price: pricing.DESIGNS['P-BPC'].price,
			designDescription: 'Colonial posts are a fairly modern addition to the world of railings. Bigger in size and ' +
				'grander in appearance compared to our standard posts, the colonial posts are perfect for those that want ' +
				'their railings to exhibit a regal charm. It\'s worth noting that the bigger size of these posts lend themselves better ' +
				'to stabilizing the overall railing. For that reason alone, we recommend these posts be selected for all balconies.',
			designImages:
			[
				'client/images/designs/post/colonialPost-2.jpg',
				'client/images/designs/post/colonialPost-3.jpg',
				'client/images/designs/post/colonialPost-4.jpg'
			]
		},
		{
			id: 'P-SP',
			label: 'Standard Post',
			price: pricing.DESIGNS['P-SP'].price,
			designDescription: 'Time-tested and beloved everywhere, nothing is better at conveying rustic vibes than the standard post. ' +
				'We take special pride in our standard posts, crafting them as a sleek, yet classic alternative to our colonial posts.',
			designImages:
			[
				'client/images/designs/post/standardPost-2.jpg',
				'client/images/designs/post/standardPost-3.jpg',
				'client/images/designs/post/standardPost-4.jpg'
			]
		}
	]
};

// ----------------- EXPORT --------------------------

export default postDesigns;