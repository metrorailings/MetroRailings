/**
 * A module listing pricing targeted towards Deck Remodelers
 *
 * @module barrettOutdoorsPricing
 */

// ----------------- MODULE DEFINITION --------------------------

let contractorModule =
{
	companyName: 'Barrett Outdoors',

	headsUp: 'All pricing for railing products applies to 36" high railings. 42" high railings will be slightly more' +
		' expensive (typically $5 to $10 more per foot).',

	coreOptions:
	[
		{
			name: 'Traditional',
			previewImage: ['client/images/priceChart/traditionalFullBody.jpg'],
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
			previewImage: ['client/images/priceChart/vistaFullBody.jpg'],
			regularPrice: 65,
			curves:
			{
				flat: 75,
				stairs: 190
			},
			pricingUnit: ' per foot',
			note: 'A top channel will be designed into the railing. The upper channel will feature no decorative' +
				' scrolls or effects. Instead, every odd baluster built into the body of the railing will extend' +
				' upwards through this channel all the way to the top handrail (like with a traditional railing).'
		},
		{
			name: 'Cable',
			previewImage: ['client/images/priceChart/cableFullBody.jpg'],
			regularPrice: 100,
			pricingUnit: ' per foot',
			note: 'The bodies of the railings will consist of tightly-wound 1/8"-diameter stainless steel cables' +
				' instead of metal pickets.'
		},
		{
			name: 'Framed Glass',
			previewImage: ['client/images/priceChart/framedGlass.jpg'],
			regularPrice: 140,
			pricingUnit: ' per foot',
			note: 'The railings will be comprised of glass panels encased in aluminum frames. The glass will be' +
				' tempered in order to ensure its resilience against impact forces.'
		},
		{
			name: 'Floor-Mounted Glass',
			previewImage: ['client/images/priceChart/floorMountGlass.jpeg'],
			regularPrice: 180,
			pricingUnit: ' per foot',
			note: 'The railings will be comprised of glass panels anchored into a specialized aluminum channel that' +
				' will sit flush against the floor. A continuous handrail can be placed over the top of the panels' +
				' if needed.'
		}
	],

	multiOptions:
	[
		{
			name: 'Single-Leaf Gate',
			previewImage: ['client/images/priceChart/singleLeafGate.jpeg'],
			priceBreakdowns:
			[
				{
					name: 'Standard Style',
					price: 115,
					pricingUnit: ' per foot'
				},
				{
					name: 'Vista Style',
					price: 125,
					pricingUnit: ' per foot'
				},
				{
					name: 'Cable Style',
					price: 175,
					pricingUnit: ' per foot'
				}
			],
			note: 'The single-leaf gate is a simple gate that swings outward or inward. Two hinges anchor the gate' +
				' into place. Self-closing hinges are an option here. Latches can be set into place to hold the gate' +
				' shut or fully open.'
		},
		{
			name: 'Double-Leaf Gate',
			previewImage: ['client/images/priceChart/doubleLeafGate.jpeg'],
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
			previewImage: ['client/images/priceChart/sixPostBase.jpg'],
			regularPrice: 85,
			pricingUnit: ' per base',
		},
		{
			name: 'Privacy Wall',
			previewImage: ['client/images/priceChart/privacyWall.jpeg'],
			regularPrice: 90,
			pricingUnit: ' per foot',
		}
	]
};

// ----------------- EXPORT --------------------------

module.exports = contractorModule;