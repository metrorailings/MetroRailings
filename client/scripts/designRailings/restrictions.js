/**
 * A module listing restriction information
 *
 * @module restrictions
 */
// ----------------- MODULE DEFINITION --------------------------

var restrictions =
{
	sections:
	{
		// Post Design
		postSection:
		{
			options:
			{
				SP:
				{
					railingType:
					{
						stairs: true,
						deck: false
					}
				}
			}
		},

		// Top Railing End Design
		postEndSection:
		{
			restrictions:
			{
				postDesign:
				{
					BP: false,
					BPC: false,
					SP: true
				}
			}
		},

		// Post Cap Design
		postCapSection:
		{
			restrictions:
			{
				postDesign:
				{
					BP: true,
					BPC: true,
					SP: false
				}
			}
		},

		// Center Design
		centerDesignSection: {}
	}
};

// ----------------- EXPORT --------------------------

export default restrictions;