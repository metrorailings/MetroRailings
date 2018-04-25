/**
 * A module listing pricing that we target towards contractors
 *
 * @module contractorPricing
 */
// ----------------- EXTERNAL MODULES --------------------------

var category = global.OwlStakes.require('shared/designs/categoryClassifications'),

	rQuery = global.OwlStakes.require('utility/rQuery');

// ----------------- ENUMS/CONSTANTS --------------------------

var DISTANCE_TIERS =
	[
		{
			min: 0,
			max: 20,
			priceIncrement: 0
		},
		{
			min: 20,
			max: 50,
			priceIncrement: 15
		},
		{
			min: 50,
			max: 100000,
			priceIncrement: 25
		}
	];

// ----------------- MODULE DEFINITION --------------------------

var contractorModule =
	{
		pricing:
		[
			{
				id: category.CONTRACTOR.CODE + '-TRA',
				label: 'Traditional Railings',
				previewImage: 'client/images/designs/type/traditional.jpg',
				regularPriceRange:
				{
					floor: 70,
					ceiling: 90
				},
				bulkPriceRange:
				{
					floor: 60,
					ceiling: 75
				},
				curves: 15,
				note: 'A price range is given depending on how ornate you want the railings to be.'
			},
			{
				id: category.CONTRACTOR.CODE + '-MOD',
				label: 'Modern Railings',
				previewImage: 'client/images/designs/type/modern.jpg',
				regularPriceRange:
				{
					floor: 85,
					ceiling: 100
				},
				bulkPriceRange:
				{
					floor: 70,
					ceiling: 85
				},
				curves: 15,
				note: 'A price range is given depending on the complexity of the railing design.'
			},
			{
				id: category.CONTRACTOR.CODE + '-CABLE',
				label: 'Stainless Steel Cable Railings',
				previewImage: 'client/images/designs/type/cable.jpeg',
				regularPriceRange:
				{
					floor: 180,
					ceiling: 240
				},
				bulkPriceRange:
				{
					floor: 160,
					ceiling: 220
				},
				note: 'A price range is given depending on the number of corners involved in the project.'
			},
			{
				id: category.CONTRACTOR.CODE + '-GLASS-FRAME',
				label: 'Glass Railings - Frames',
				previewImage: 'client/images/designs/type/glassFrame.jpg',
				regularPriceRange: 160,
				bulkPriceRange: 140,
				note: 'Glass panes are inserted directly into a frame we build in-house.'
			},
			{
				id: category.CONTRACTOR.CODE + '-GLASS-POST',
				label: 'Glass Railings - Post Mount',
				previewImage: 'client/images/designs/type/glassPost.jpg',
				regularPriceRange: 180,
				bulkPriceRange: 170,
				note: 'Glass panes are attached to posts using stainless steel clamps.'
			},
			{
				id: category.CONTRACTOR.CODE + '-GLASS-FLOOR',
				label: 'Glass Railings - Floor Mount',
				previewImage: 'client/images/designs/type/glassFloor.jpg',
				regularPriceRange: 210,
				bulkPriceRange: 195,
				note: 'Glass panes act as the railings and are held into place using specialized U-channels.'
			},
			{
				id: category.CONTRACTOR.CODE + '-GLASS-WALL',
				label: 'Glass Railings - Wall Mount',
				previewImage: 'client/images/designs/type/glassWall.jpg',
				regularPriceRange: 220,
				bulkPriceRange: 205,
				note: 'Glass panes act as the railings and are anchored into position using screws that are' +
				' threaded through the glass and into the side of whatever platform the glass sits on.'
			},
			{
				id: category.CONTRACTOR.CODE + '-WROUGHT-IRON',
				label: 'Wrought Iron',
				previewImage: 'client/images/designs/type/wroughtIron.jpeg',
				regularPriceRange:
				{
					floor: 250,
					ceiling: 500
				},
				curves: 65,
				note: 'All railing components are ordered from outside suppliers. Parts of the railing may be' +
				' assembled on-site depending on the complexity of the job.'
			},
		],

		/**
		 * Function that modifies pricing based on rough distance to a job site
		 *
		 * @param {Number} distance - the rough distance to the job site
		 *
		 * @returns {Object} - the pricing list, with its pricing updated to reflect travel
		 *
		 * @author kinsho
		 */
		modifyPricingByDistance: function(distance)
		{
			var pricingInfo = rQuery.copyObject(contractorModule.pricing);

			for (let i = 0; i < DISTANCE_TIERS.length; i++)
			{
				if ((distance >= DISTANCE_TIERS[i].min) && (distance < DISTANCE_TIERS[i].max))
				{
					// Increase all prices by a given increment
					for (let j = 0; j < Object.keys(pricingInfo).length; j++)
					{
						// Increase regular pricing
						if (pricingInfo[j].regularPriceRange.floor)
						{
							pricingInfo[j].regularPriceRange.floor += DISTANCE_TIERS[i].priceIncrement;
							pricingInfo[j].regularPriceRange.ceiling += DISTANCE_TIERS[i].priceIncrement;
						}
						else
						{
							pricingInfo[j].regularPriceRange += DISTANCE_TIERS[i].priceIncrement;
						}

						if (pricingInfo[j].bulkPriceRange)
						{
							// Increase bulk pricing, if applicable
							if (pricingInfo[j].bulkPriceRange.floor)
							{
								pricingInfo[j].bulkPriceRange.floor += DISTANCE_TIERS[i].priceIncrement;
								pricingInfo[j].bulkPriceRange.ceiling += DISTANCE_TIERS[i].priceIncrement;
							}
							else
							{
								pricingInfo[j].bulkPriceRange += DISTANCE_TIERS[i].priceIncrement;
							}
						}

						// Update all curve pricing
						if (pricingInfo[j].curves)
						{
							pricingInfo[j].curves += DISTANCE_TIERS[i].priceIncrement;
						}
					}
				}
			}

			return pricingInfo;
		}
	};

// ----------------- EXPORT --------------------------

module.exports = contractorModule;
