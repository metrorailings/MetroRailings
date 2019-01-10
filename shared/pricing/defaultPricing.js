/**
 * A module listing pricing that we target towards contractors
 *
 * @module defaultPricing
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
				regularPrice: 65,
				curves:
				{
					flat: 15,
					stairs: 120
				},
				extras:
				[
					'Additional $520 for any 4-foot hinge gate needed'
				],
				note: 'Our most popular deck railing, the Vista railing is a balance between price economy and elegant' +
					' style.'
			},
			{
				id: category.CONTRACTOR.CODE + '-TRA',
				label: 'Traditional Railings',
				previewImage: ['client/images/designs/type/traditional-2.jpg'],
				regularPrice: 55,
				curves:
				{
					flat: 10,
					stairs: 110
				},
				extras:
				[
					'Additional $450 for any 4-foot hinge gate needed'
				],
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
				regularPrice: 100,
				extras:
				[
					'Additional $180 for every corner post that needs to support two sets of cables going at' +
					' different angles.'
				],
				note: 'Cables are crimped into place and then tightened until fully taut.'
			},
			{
				id: category.CONTRACTOR.CODE + '-GLASS-FRAME',
				label: 'Glass Railings - Frames',
				previewImage: ['client/images/designs/type/glassFrame.jpg'],
				regularPrice: 120,
				extras:
				[
					'$770 more for any 4-foot hinge gate needed',
					'$20 more per foot for tinted glass'
				],
				note: 'Glass panes are inserted directly into an aluminum box frame.'
			},
			{
				id: category.CONTRACTOR.CODE + '-GLASS-POST',
				label: 'Glass Railings - Post Mount',
				previewImage: ['client/images/designs/type/glassPost.jpg'],
				regularPrice: 170,
				extras:
				[
					'$20 more per foot for tinted glass'
				],
				note: 'Glass panes are attached to posts using specialized stainless steel clamps.'
			},
			{
				id: category.CONTRACTOR.CODE + '-GLASS-FLOOR',
				label: 'Glass Railings - Fascia Mount',
				previewImage: ['client/images/designs/type/glassFloor.jpg'],
				regularPrice: 190,
				extras:
				[
					'$20 more per foot for tinted glass'
				],
				note: 'Glass panes are lined up against one another and held into place using specialized U-channels.'
			},
			{
				id: category.CONTRACTOR.CODE + '-GLASS-WALL',
				label: 'Glass Railings - Wall Mount',
				previewImage: ['client/images/designs/type/glassWall.jpg'],
				regularPrice: 225,
				extras:
				[
					'$20 more per foot for tinted glass'
				],
				note: 'Glass panes are lined up against one another and anchored into position using screws that are' +
					' threaded through the glass and into the side of whatever platform the glass sits on. This is the' +
					' Maserati of glass railings.'
			}
		]
	};

// ----------------- EXPORT --------------------------

module.exports = contractorModule;
