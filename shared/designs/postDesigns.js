/**
 * A module listing important information about all the post designs
 *
 * @module postDesigns
 */
// ----------------- EXTERNAL MODULES --------------------------

import pricing from 'shared/pricing/pricingData';
import category from 'shared/designs/categoryClassifications';

// ----------------- MODULE DEFINITION --------------------------

var postDesigns =
{
	options:
	[
		{
			id: category.POST.CODE + '-1.5',
			label: '1.5" Square Post',
			previewImage: 'client/images/designs/post/standardPost-1.jpg',
		},
		{
			id: category.POST.CODE + '-2.0',
			label: '2" Square Post',
			previewImage: 'client/images/designs/post/standardPost-1.jpg',
		},
		{
			id: category.POST.CODE + '-2.5',
			label: '2.5" Square Post',
			previewImage: 'client/images/designs/post/standardPost-1.jpg',
		},
		{
			id: category.POST.CODE + '-3.0',
			label: '3" Square Post',
			previewImage: 'client/images/designs/post/standardPost-1.jpg',
		},
	],
	designMetadata:
	[
		{
			id: category.POST.CODE + '-1.5',
			label: '1.5" Square Post',
			price: pricing.DESIGNS['P-1.5'].price,
			designImages:
			[
				'client/images/designs/post/colonialPost-2.jpg',
				'client/images/designs/post/colonialPost-3.jpg',
				'client/images/designs/post/colonialPost-4.jpg'
			]
		},
		{
			id: category.POST.CODE + '-2.0',
			label: '2" Square Post',
			price: pricing.DESIGNS['P-2.0'].price,
			designImages:
			[
				'client/images/designs/post/standardPost-2.jpg',
				'client/images/designs/post/standardPost-3.jpg',
				'client/images/designs/post/standardPost-4.jpg'
			]
		},
		{
			id: category.POST.CODE + '-2.5',
			label: '2.5" Square Post',
			price: pricing.DESIGNS['P-2.5'].price,
			designImages:
			[
				'client/images/designs/post/standardPost-2.jpg',
				'client/images/designs/post/standardPost-3.jpg',
				'client/images/designs/post/standardPost-4.jpg'
			]
		},
		{
			id: category.POST.CODE + '-3.0',
			label: '3" Square Post',
			price: pricing.DESIGNS['P-3.0'].price,
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