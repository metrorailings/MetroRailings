/**
 * A module responsible for describing the pricing structure of various order options
 *
 * @module pricingStructure
 */

module.exports =
{
	MINIMUM_COST_PER_ESTIMATE: 35.00,
	COST_PER_MILE_TRAVELED: 1.00,
	NJ_SALES_TAX_RATE: 0.06625,

	DESIGNS:
	{
		'T-TRA' :
		{
			name: 'Traditional Railings',
			priceRating: 1,
			price: 85,
			rate: 0,
		},

		'T-CABLE' :
		{
			name: 'Stainless Steel Cable Railings',
			priceRating: 2,
			price: 170,
			rate: 0,
		},

		'T-GLASS' :
		{
			name: 'Glass Railings',
			priceRating: 3,
			price: 200,
			rate: 0,
		},

		'P-1.5' :
		{
			name: '1.5" Square Post',
			price: 0,
			rate: 0
		},

		'P-2.0' :
		{
			name: '2" Square Post',
			price: 0,
			rate: 0
		},

		'P-2.5' :
		{
			name: '2.5" Square Post',
			price: 0,
			rate: 0
		},

		'P-3.0' :
		{
			name: '3" Square Post',
			price: 10,
			rate: 5
		},

		'H-COL' :
		{
			name: 'Colonial Handrailing',
			price: 0,
			rate: 0
		},

		'H-STD' :
		{
			name: 'Standard Handrailing',
			price: 0,
			rate: 0
		},

		'PCKT-1/2' :
		{
			name: '1/2" Square Picket',
			price: 0,
			rate: 0
		},

		'PCKT-5/8' :
		{
			name: '5/8" Square Picket',
			price: 0,
			rate: 0
		},

		'PCKT-3/4' :
		{
			name: '3/4" Square Picket',
			price: 0,
			rate: 0
		},

		'PCKT-1' :
		{
			name: '1" Square Picket',
			price: 0,
			rate: 0
		},

		'PE-LT' :
		{
			name: 'Lamb\'s Tongue',
			price: 0,
			rate: 0
		},

		'PE-VOL' :
		{
			name: 'Volute',
			price: 0,
			rate: 0
		},

		'PE-SCRL' :
		{
			name: 'Scroll',
			price: 0,
			rate: 0
		},

		'PC-BALL' :
		{
			name: 'Ball',
			price: 0,
			rate: 0
		},

		'PC-SQ' :
		{
			name: 'Square',
			price: 0,
			rate: 0
		},

		'CD-NONE' :
		{
			name: 'N/A',
			price: 0,
			rate: 0
		},

		'CD-SC' :
		{
			name: 'S/C Scrolls',
			price: 0,
			rate: 0
		},

		'CD-GALE' :
		{
			name: 'Gale',
			price: 0,
			rate: 0
		},

		'CD-DHRT' :
		{
			name: 'Double Heart',
			price: 0,
			rate: 0
		},

		'CD-SNC' :
		{
			name: 'Scroll & Collar',
			price: 0,
			rate: 0
		},

		'white' :
		{
			name: 'Sky White',
			price: 0,
			rate: 0
		},

		'black' :
		{
			name: 'Midnight Black',
			price: 0,
			rate: 0
		},

		'silver' :
		{
			name: 'Urban Silver',
			price: 0,
			rate: 0
		},

		'mahogany' :
		{
			name: 'Mahogany',
			price: 0,
			rate: 0
		},

		'bronze' :
		{
			name: 'Statuesque Bronze',
			price: 0,
			rate: 0
		}
	}
};