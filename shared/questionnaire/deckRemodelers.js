/**
 * A module listing pricing targeted towards Deck Remodelers
 *
 * @module deckRemodelersPricing
 */

// ----------------- MODULE DEFINITION --------------------------

let contractorModule =
{
	companyName: 'Deck Remodelers',

	designOptions:
	[
		{
			id: 'style',
			name: 'Style',
			options:
			[
				{
					name: 'Traditional',
					previewImage: 'client/images/deckRemodelers/traditionalFullBody.jpg',
					basePrice: 60,
					pricingUnit: ' per foot',
					value: 'traditional'
				},
				{
					name: 'Vista',
					previewImage: 'client/images/deckRemodelers/vistaFullBody.jpg',
					basePrice: 70,
					pricingUnit: ' per foot',
					value: 'vista'
				},
				{
					name: 'Cable',
					curvable: 'Not Curvable',
					previewImage: 'client/images/deckRemodelers/cableFullBody.jpg',
					basePrice: 100,
					pricingUnit: ' per foot',
					value: 'cable'
				}
			]
		},
		{
			id: 'handrailing',
			name: 'Handrailing',
			options:
			[
				{
					name: 'Standard',
					curvable: 'Curvable',
					previewImage: 'client/images/deckRemodelers/standardHandrail.jpg',
					value: 'standard'
				},
				{
					name: 'Colonial',
					previewImage: 'client/images/deckRemodelers/colonialHandrail.jpg',
					value: 'colonial'
				},
				{
					name: 'Modern',
					previewImage: 'client/images/deckRemodelers/modernHandrail.jpg',
					value: 'modern'
				}
			]
		},
		{
			id: 'postCap',
			name: 'Post Cap',
			options:
			[
				{
					name: 'Square',
					previewImage: 'client/images/deckRemodelers/squareCap.jpg',
					value: 'square'
				},
				{
					name: 'Pyramid',
					previewImage: 'client/images/deckRemodelers/pyramidCap.jpg',
					value: 'pyramid'
				}
			]
		},
		{
			id: 'color',
			name: 'Color',
			options:
			[
				{
					name: 'Textured Black',
					previewImage: 'client/images/deckRemodelers/texturedBlack.png',
					value: 'texturedBlack'
				},
				{
					name: 'Textured Bronze',
					previewImage: 'client/images/deckRemodelers/texturedBronze.png',
					value: 'texturedBronze'
				},
				{
					name: 'Matte Black',
					previewImage: 'client/images/deckRemodelers/matteBlack.png',
					value: 'matteBlack'
				},
				{
					name: 'Stainless Steel',
					previewImage: 'client/images/deckRemodelers/stainlessSteel.png',
					value: 'stainlessSteel'
				},
				{
					name: 'Unstocked Color',
					previewImage: 'client/images/deckRemodelers/notInStock.png',
					basePrice: '400+',
					pricingUnit: '',
					value: 'unstocked'
				}
			]
		}
	],

	questions:
	[
		'Are there any gates?',
		'Is there anything out of the normal for this particular order?',
		'Is there anything we need to know about this particular customer?'
	]
};

// ----------------- EXPORT --------------------------

module.exports = contractorModule;