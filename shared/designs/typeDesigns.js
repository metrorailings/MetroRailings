/**
 * A module listing important information about all the types of railing we offer
 *
 * @module typeDesigns
 */
// ----------------- EXTERNAL MODULES --------------------------

import pricing from 'shared/pricing/pricingData';

// ----------------- MODULE DEFINITION --------------------------

var typeDesigns =
	{
		options:
		[
			{
				id: 'T-TRA',
				label: 'Traditional Railings',
				previewImage: 'client/images/designs/type/traditional.jpg',
			},
			{
				id: 'T-CABLE',
				label: 'Stainless Steel Cable Railings',
				previewImage: 'client/images/designs/type/cable.jpg',
			},
			{
				id: 'T-GLASS',
				label: 'Glass Railings',
				previewImage: 'client/images/designs/type/glass.jpg',
			}

		],
		designMetadata:
		[
			{
				id: 'T-TRA',
				label: 'Traditional Railings',
				priceRating: pricing.DESIGNS['T-TRA'].priceRating,
				designDescription: '',
				designImages:
				[
					'client/images/designs/type/traditional.jpg',
				]
			},
			{
				id: 'T-CABLE',
				label: 'Stainless Steel Cable Railings',
				priceRating: pricing.DESIGNS['T-CABLE'].priceRating,
				designDescription: '',
				designImages:
				[
					'client/images/designs/type/cable.jpg',
				]
			},
			{
				id: 'T-GLASS',
				label: 'Glass Railings',
				priceRating: pricing.DESIGNS['T-GLASS'].priceRating,
				designDescription: '',
				designImages:
				[
					'client/images/designs/type/glass.jpg',
				]
			}
		]
	};

// ----------------- EXPORT --------------------------

export default typeDesigns;