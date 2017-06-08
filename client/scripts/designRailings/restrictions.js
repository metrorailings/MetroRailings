/**
 * A module listing restriction information for each design section
 *
 * @module restrictions
 */
// ----------------- MODULE DEFINITION --------------------------

var restrictions =
{
	sections:
	{
		// Post Design
		postSection: {},

		// Top Railing End Design
		postEndSection:
		{
			postDesign:
			{
				'P-BP' : false,
				'P-BPC' : false,
				'P-SP' : true
			}
		},

		// Post Cap Design
		postCapSection:
		{
			postDesign:
			{
				'P-BP' : true,
				'P-BPC' : true,
				'P-SP' : false
			}
		},

		// Center Design
		centerDesignSection: {},

		// Color
		colorSection: {}
	}
};

// ----------------- EXPORT --------------------------

export default restrictions;