/**
 * A module listing pricing targeted towards Deck Remodelers
 *
 * @module deckRemodelersPricing
 */

// ----------------- MODULE DEFINITION --------------------------

let contractorModule =
{
	companyName: 'Deck Remodelers',

	coreOptions:
	[
		{
			name: 'Traditional',
			previewImage: ['client/images/deckRemodelers/traditionalFullBody.jpg'],
			regularPrice: 60,
			curves:
			{
				flat: 70,
				stairs: 150
			},
			pricingUnit: ' per foot',
			note: 'Just simple and straightforward metal railings.'
		},
		{
			name: 'Vista',
			previewImage: ['client/images/deckRemodelers/vistaFullBody.jpg'],
			regularPrice: 70,
			curves:
			{
				flat: 80,
				stairs: 190
			},
			pricingUnit: ' per foot',
			note: 'A top channel will be designed into the railing. The upper channel will feature no decorative' +
				' scrolls or effects. Instead, every odd baluster built into the body of the railing will extend' +
				' upwards through this channel all the way to the top handrail (like with a traditional railing).'
		},
		{
			name: 'Cable',
			previewImage: ['client/images/deckRemodelers/cableFullBody.jpg'],
			regularPrice: 100,
			pricingUnit: ' per foot',
			note: 'The bodies of the railings will consist of tightly-wound 1/8"-diameter stainless steel cables' +
				' instead of metal pickets.'
		}
	],

	multiOptions:
	[
		{
			name: 'Single-Leaf Gate',
			previewImage: ['client/images/deckRemodelers/singleLeafGate.jpeg'],
			priceBreakdowns:
			[
				{
					name: 'Standard Style',
					price: 120,
					pricingUnit: ' per foot'
				},
				{
					name: 'Vista Style',
					price: 130,
					pricingUnit: ' per foot'
				},
				{
					name: 'Cable Style',
					price: 170,
					pricingUnit: ' per foot'
				}
			],
			note: 'The single-leaf gate is a simple gate that swings outward or inward. Two hinges anchor the gate' +
				' into place. Self-closing hinges are an option here. Latches can be set into place to hold the gate' +
				' shut or fully open.'
		},
		{
			name: 'Double-Leaf Gate',
			previewImage: ['client/images/deckRemodelers/doubleLeafGate.jpeg'],
			priceBreakdowns:
			[
				{
					name: 'Standard Style',
					price: 130,
					pricingUnit: ' per foot'
				},
				{
					name: 'Vista Style',
					price: 140,
					pricingUnit: ' per foot'
				},
				{
					name: 'Cable Style',
					price: 180,
					pricingUnit: ' per foot'
				}
			],
			note: 'Typically used for larger openings, the double-leaf gate is composed of two gates. Both gates are' +
				' configured to close together. Each gate will be anchored into place with two hinges. Self-closing' +
				' hinges are an option here. Latches can be set into place to hold either gate fully open.'
		}
	],

	miscOptions:
	[
		{
			name: '6" Square Bases',
			previewImage: ['client/images/deckRemodelers/sixPostBase.jpg'],
			regularPrice: 85,
			pricingUnit: ' per base',
		},
		{
			name: 'Privacy Wall',
			previewImage: ['client/images/deckRemodelers/privacyWall.jpeg'],
			regularPrice: 90,
			pricingUnit: ' per foot',
		},
		{
			name: 'Lattice Frame',
			regularPrice: 425,
			pricingUnit: ' per panel',
		},
		{
			name: 'Lattice Panel - Powder Coating ',
			regularPrice: 100,
			pricingUnit: ' per lattice',
		}
	]
};

// ----------------- EXPORT --------------------------

module.exports = contractorModule;