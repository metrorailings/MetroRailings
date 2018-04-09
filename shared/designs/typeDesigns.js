/**
 * A module listing basic information about all the types of railing we offer
 *
 * @module typeDesigns
 */
// ----------------- EXTERNAL MODULES --------------------------

import category from 'shared/designs/categoryClassifications';

// ----------------- MODULE DEFINITION --------------------------

var typeDesigns =
	{
		options:
		[
			{
				id: category.TYPE.CODE + '-TRA',
				label: 'Traditional Railings',
				previewImage: 'client/images/designs/type/traditional.png',
				nextSection: 'post'
			},
			{
				id: category.TYPE.CODE + '-MOD',
				label: 'Modern Railings',
				previewImage: 'client/images/designs/type/modern.png',
				nextSection: 'post'
			},
			{
				id: category.TYPE.CODE + '-CABLE',
				label: 'Stainless Steel Cable Railings',
				previewImage: 'client/images/designs/type/cable.png',
				nextSection: 'post'
			},
			{
				id: category.TYPE.CODE + '-GLASS',
				label: 'Glass Railings',
				previewImage: 'client/images/designs/type/glass.png',
				nextSection: 'glassArchitecture'
			}
		]
	};

// ----------------- EXPORT --------------------------

export default typeDesigns;