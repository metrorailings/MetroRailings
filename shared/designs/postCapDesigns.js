/**
 * A module listing important information about all the post cap designs
 *
 * @module postCapDesigns
 */
// ----------------- EXTERNAL MODULES --------------------------

import pricing from 'shared/pricing/pricingData';

// ----------------- MODULE DEFINITION --------------------------

var postCapDesigns =
{
	options:
	[
		{
			id: 'PC-BALL',
			label: 'Ball',
			previewImage: 'client/images/designs/postCap/ball-1.jpg'
		},
		{
			id: 'PC-SQ',
			label: 'Square',
			previewImage: 'client/images/designs/postCap/square-1.jpg',
		}
	],
	designMetadata:
	[
		{
			id: 'PC-BALL',
			label: 'Ball',
			price: pricing.DESIGNS['PC-BALL'].price,
			designDescription: 'The standard-bearer in post caps. Fixing these orbs on top of each post will ensure ' +
				'your railings stand out with a solemn grace.',
			designImages:
			[
				'client/images/designs/postCap/ball-2.jpg',
				'client/images/designs/postCap/ball-3.jpg',
				'client/images/designs/postCap/ball-4.jpg'
			],
		},
		{
			id: 'PC-SQ',
			label: 'Square',
			price: pricing.DESIGNS['PC-SQ'].price,
			designDescription: 'Simple and beautiful, these flat-top caps work best for those that want their posts to ' +
				'blend in effortlessly with the rest of their railings.',
			designImages:
			[
				'client/images/designs/postCap/square-2.jpg',
				'client/images/designs/postCap/square-3.jpg',
				'client/images/designs/postCap/square-4.jpg'
			]
		}
	]
};

// ----------------- EXPORT --------------------------

export default postCapDesigns;