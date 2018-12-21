/**
 * A module listing pricing that we target towards contractors
 *
 * @module deckPricing
 */
// ----------------- EXTERNAL MODULES --------------------------

var category = global.OwlStakes.require('shared/designs/categoryClassifications');

// ----------------- MODULE DEFINITION --------------------------

var contractorModule =
{
	options:
	[
		{
			id: category.CONTRACTOR.CODE + '-VISTA',
			label: 'Vista Railings',
			previewImage: ['client/images/designs/type/traditional.jpg'],
			regularPrice: 85,
			curves:
			{
				flat: 15,
				stairs: 245
			},
			note: 'Our most popular deck railing, the Vista railing is a balance between price economy and elegant' +
				' style. You guys seem to love this particular style too, judging by your gallery.'
		},
		{
			id: category.CONTRACTOR.CODE + '-TRA',
			label: 'Traditional Railings',
			previewImage: ['client/images/designs/type/traditional-2.jpg'],
			regularPrice: 70,
			curves:
			{
				flat: 10,
				stairs: 200
			},
			note: 'Some people say simplicity is sexy. If so, this railing oozes sex appeal.'
		},
		{
			id: category.CONTRACTOR.CODE + '-MOD',
			label: 'Modern Railings',
			previewImage: ['client/images/designs/type/modern.jpg', 'client/images/designs/type/modern-2.jpeg'],
			regularPrice: 130,
			note: 'Different types of horizontal railings are available.'
		},
		{
			id: category.CONTRACTOR.CODE + '-CABLE',
			label: 'Stainless Steel Cable Railings',
			previewImage: ['client/images/designs/type/cable.jpeg', 'client/images/designs/type/cable-2.jpg'],
			regularPrice: 110,
			note: 'Cables are crimped into place and then tightened until fully taut.'
		},
		{
			id: category.CONTRACTOR.CODE + '-GLASS-FRAME',
			label: 'Glass Railings - Frames',
			previewImage: ['client/images/designs/type/glassFrame.jpg'],
			regularPrice: 140,
			note: 'Glass panes are inserted directly into an aluminum box frame.'
		},
		{
			id: category.CONTRACTOR.CODE + '-GLASS-POST',
			label: 'Glass Railings - Post Mount',
			previewImage: ['client/images/designs/type/glassPost.jpg'],
			regularPrice: 185,
			note: 'Glass panes are attached to posts using specialized stainless steel clamps.'
		},
		{
			id: category.CONTRACTOR.CODE + '-GLASS-FLOOR',
			label: 'Glass Railings - Fascia Mount',
			previewImage: ['client/images/designs/type/glassFloor.jpg'],
			regularPrice: 190,
			note: 'Glass panes are lined up against one another and held into place using specialized U-channels.'
		},
		{
			id: category.CONTRACTOR.CODE + '-GLASS-WALL',
			label: 'Glass Railings - Wall Mount',
			previewImage: ['client/images/designs/type/glassWall.jpg'],
			regularPrice: 235,
			note: 'Glass panes are lined up against one another and anchored into position using screws that are' +
				' threaded through the glass and into the side of whatever platform the glass sits on. This is the' +
				' Maserati of glass railings.'
		}
	],
	extra:
	[
		{
			id: category.CONTRACTOR.CODE + '-3-POST',
			label: '3" Posts',
			regularPrice: 40,
			unit: ' per post'
		},
		{
			id: category.CONTRACTOR.CODE + '-4-POST',
			label: '4" Posts',
			regularPrice: 60,
			unit: ' per post'
		},
	]
};

// ----------------- EXPORT --------------------------

module.exports = contractorModule;
