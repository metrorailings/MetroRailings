/**
 * A module listing important information about all the center designs
 *
 * @module centerDesigns
 */

// ----------------- EXTERNAL MODULES --------------------------

import pricing from 'shared/pricing/pricingData';

// ----------------- MODULE DEFINITION --------------------------

var centerDesigns =
{
	options:
	[
		{
			id: 'CD-NONE',
			label: 'No, I do not want center designs',
		},
		{
			id: 'CD-SC',
			label: 'S/C Scrolls',
			previewImage: 'client/images/designs/center/scScrolls-1.jpg'
		},
		{
			id: 'CD-GALE',
			label: 'Gale',
			previewImage: 'client/images/designs/center/gale-1.jpg'
		},
		{
			id: 'CD-DHRT',
			label: 'Double Heart',
			previewImage: 'client/images/designs/center/doubleHeart-1.jpg'
		},
		{
			id: 'CD-SNC',
			label: 'Scroll & Collar',
			previewImage: 'client/images/designs/center/scrollAndCollar-1.jpg'
		}
	],
	designMetadata:
	[
		{
			id: 'CD-NONE',
			price: pricing.DESIGNS['CD-NONE'].price,
			designDescription: 'If you have no need for designs along the middle of your railings, feel free to select this option in order to continue.'
		},
		{
			id: 'CD-SC',
			label: 'S/C Scrolls',
			price: pricing.DESIGNS['CD-SC'].price,
			designDescription: 'S-shaped scrolls studded with C-shaped scrolls will certainly endow your railings with ' +
				'even more artistic flair.',
			designImages:
			[
				'client/images/designs/center/scScrolls-2.jpg',
				'client/images/designs/center/scScrolls-3.jpg'
			]
		},
		{
			id: 'CD-GALE',
			label: 'Gale',
			price: pricing.DESIGNS['CD-GALE'].price,
			designDescription: 'Pairs of wind-shaped scrolls will blend into the middle of your railings, giving them ' +
				'some fanciful gusto.',
			designImages:
			[
				'client/images/designs/center/gale-2.jpg',
				'client/images/designs/center/gale-3.jpg',
				'client/images/designs/center/gale-4.jpg'
			]
		},
		{
			id: 'CD-DHRT',
			label: 'Double Heart',
			price: pricing.DESIGNS['CD-DHRT'].price,
			designDescription: 'Pairs of hearts united by their tips will gracefully rest along the center of your ' +
				'railings.',
			designImages:
			[
				'client/images/designs/center/doubleHeart-2.jpg',
				'client/images/designs/center/doubleHeart-3.jpg',
				'client/images/designs/center/doubleHeart-4.jpg'
			]
		},
		{
			id: 'CD-SNC',
			label: 'Scroll & Collar',
			price: pricing.DESIGNS['CD-SNC'].price,
			designDescription: 'C-shaped scrolls conjoined by squared collars will lend a royal tone to your ' +
				'railings.',
			designImages:
			[
				'client/images/designs/center/scrollAndCollar-2.jpg',
				'client/images/designs/center/scrollAndCollar-3.jpg',
				'client/images/designs/center/scrollAndCollar-4.jpg'
			]
		}
	]
};

// ----------------- EXPORT --------------------------

export default centerDesigns;