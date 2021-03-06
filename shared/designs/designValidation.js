/**
 * A module containing a variety of functions that test whether a set of design selections constitutes a legitimate
 * railing 
 *
 * @module designValidation
 */

// ----------------- RULES --------------------------

const RESTRICTIONS =
{
	type:
	{
		REQUIRED:
		{
			'T-TRA':
			{
				fields: ['post', 'handrailing', 'picketSize'],
				message: 'For traditional railings, you will need to specify post size, picket size, and the type' +
					' of handrailing needed.'
			},
			'T-MOD':
			{
				fields: ['post', 'handrailing', 'picketSize'],
				message: 'For modern railings, you will need to specify post size, picket size, and the type' +
					' of handrailing needed.'
			},
			'T-HR':
			{
				fields: ['handrailing'],
				message: 'For handrailing orders, you will need to specify the type of handrailing you want.'
			},
			'T-IRON':
			{
				fields: ['post', 'handrailing', 'picketSize'],
				message: 'For wrought-iron railings, you will need to specify post size, picket size, and the type' +
					' of handrailing needed.'
			},
			'T-GATE':
			{
				fields: ['post', 'picketSize'],
				message: 'For gates, you will need to specify post and picket size.'
			},
			'T-CABLE':
			{
				fields: ['cableSize', 'cableCap'],
				message: 'For cable products, you need to specify both the size of the cable needed as well as' +
					' what type of caps you want covering the ends of the cable. Don\'t forget post size as well.'
			},
			'T-GLASS':
			{
				fields: ['glassType', 'glassBuild'],
				message: 'For glass products, you need to specify both the type of glass needed as well the type of' +
					' glass railing we will need to produce here.'
			}
		}
	},
	postEnd:
	{
		PREREQUISITE:
		{
			fields: ['handrailing'],
			messages:
			[
				'In order to specify a post end, you need a handrail from which we will be able to mold the post end.',
			]
		}
	},
	postCap:
	{
		PREREQUISITE:
		{
			fields: ['post'],
			messages:
			[
				'Please first specify what size post the post caps will be going on',
			]
		}
	},
	picketSize:
	{
		PREREQUISITE:
		{
			fields: ['post', 'handrailing'],
			messages:
			[
				'If you want to have pickets, you need posts as well.',
				'If you want to have pickets, you need handrailings as well.'
			]
		}
	},
	picketStyle:
	{
		PREREQUISITE:
		{
			fields: ['picketSize'],
			messages:
			[
				'Please specify a picket size in addition to whatever styling you have selected for the pickets.'
			]
		}
	},
	centerDesign :
	{
		PREREQUISITE:
		{
			fields: ['picketSize'],
			messages:
			[
				'Pickets are needed if you want to incorporate a center design.'
			]
		}
	},
	baskets :
	{
		PREREQUISITE:
		{
			fields: ['picketSize'],
			messages:
			[
				'Pickets are needed if you want to include baskets.'
			]
		}
	},
	valence :
	{
		PREREQUISITE:
		{
			fields: ['post', 'handrailing'],
			messages:
			[
				'Posts are needed here if you also want valences.',
				'Handrailings are also necessary if you want to incorporate valences into these railings.'
			]
		}
	},
	collars :
	{
		PREREQUISITE:
		{
			fields: ['picketSize'],
			messages:
			[
				'Pickets are needed if you want to include collars.'
			]
		}
	},
	cableSize :
	{
		PREREQUISITE:
		{
			fields: ['post', 'handrailing'],
			messages:
			[
				'Posts are needed here in order to keep the cables firmly in place.',
				'Handrailings are necessary for cable railings for graspability purposes.'
			]
		}
	},
	glassType :
	{
		VALUE:
		{
			'GLASS-FRAME':
			{
				PREREQUISITE:
				{
					fields: ['post', 'handrailing'],
					messages:
					[
						'Posts are needed here if you want to build out some framed glass railings.',
						'Handrailings are needed to properly set framed glass into place.'
					]
				}
			},
			'GLASS-POST':
			{
				PREREQUISITE:
				{
					fields: ['post'],
					messages:
					[
						'You need to indicate the size of the posts you want if you want post-mounted glass.'
					]
				}
			}
		}
	}
};

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{

	/**
	 * Main function that tests whether certain design options have been specified in the event that other certain
	 * options were selected
	 *
	 * @param {String} designObject - the set of design selections that need to be inspected
	 *
	 * @returns {Array<String>} - a list of messages specifying any issues with the set of design selections chosen
	 *
	 * @author kinsho
	 */
	testRequirements: function(designObject)
	{
		let errorMessages = new Set(),
			restrictions, requirements, propertyValue,
			designProperties = Object.keys(designObject);

		for (let i = 0; i < designProperties.length; i += 1)
		{
			restrictions = RESTRICTIONS[designProperties[i]];

			// Check to see if there are any required fields that need to be filled in as a result of the current
			// field in context being a certain value
			if (restrictions && restrictions.REQUIRED)
			{
				requirements = restrictions.REQUIRED;
				propertyValue = designObject[designProperties[i]];

				if (requirements[propertyValue])
				{
					requirements = requirements[propertyValue];

					// Cycle through all the required properties and make sure they're filled in
					for (let j = 0; j < requirements.fields.length; j += 1)
					{
						if (!(designObject[requirements.fields[j]]))
						{
							// If a required field has not been selected, relay the corresponding error message to
							// the client
							errorMessages.add(requirements.message);
						}
					}
				}
			}
		}

		return Array.from(errorMessages);
	},

	/**
	 * Main function that tests whether a given a set of design selections were plausibly selected
	 *
	 * @param {String} designObject - the set of design selections that need to be inspected
	 *
	 * @returns {Array<String>} - a list of messages specifying any issues with the set of design selections chosen
	 *
	 * @author kinsho
	 */
	testPrerequisites: function(designObject)
	{
		let errorMessages = new Set(),
			restrictions, prerequisites,
			designProperties = Object.keys(designObject);

		for (let i = 0; i < designProperties.length; i += 1)
		{
			restrictions = RESTRICTIONS[designProperties[i]];

			// Check to see if there are any prerequisite fields that need to be filled in first before this field
			// is allowed to be filled in
			if (restrictions && restrictions.PREREQUISITE)
			{
				prerequisites = restrictions.PREREQUISITE;

				// Cycle through all the prerequisite properties and make sure they're filled in
				for (let j = 0; j < prerequisites.fields.length; j += 1)
				{
					if ( !(designObject[prerequisites.fields[j]]) )
					{
						// If a prerequisite has not been selected, find the corresponding error message and relay
						// that back to the client
						errorMessages.add(prerequisites.messages[j]);
					}
				}
			}
		}

		return Array.from(errorMessages);
	},

	/**
	 * Main function that tests whether a given a set of design choices were plausibly selected
	 *
	 * @param {String} designObject - the set of design choices that need to be inspected
	 *
	 * @returns {Array<String>} - a list of messages specifying any issues with the set of design choices
	 *
	 * @author kinsho
	 */
	testValues: function(designObject)
	{
		let errorMessages = new Set(),
			restrictions, valueRestrictions, prerequisites,
			designProperties = Object.keys(designObject);

		for (let i = 0; i < designProperties.length; i += 1)
		{
			restrictions = RESTRICTIONS[designProperties[i]];

			// Check to see if there are any prerequisite fields that need to be filled in to accommodate whatever
			// values were chosen
			if (restrictions && restrictions.VALUE)
			{
				valueRestrictions = restrictions.VALUE[designObject[designProperties[i]]];

				if (valueRestrictions && valueRestrictions.PREREQUISITE)
				{
					prerequisites = valueRestrictions.PREREQUISITE;

					// Cycle through all the prerequisite properties and make sure they're filled in
					for (let j = 0; j < prerequisites.fields.length; j += 1)
					{
						if ( !(designObject[prerequisites.fields[j]]) )
						{
							// If a prerequisite has not been selected, find the corresponding error message and relay
							// that back to the client
							errorMessages.add(prerequisites.messages[j]);
						}
					}
					
				}
			}
		}

		return Array.from(errorMessages);
	}
};