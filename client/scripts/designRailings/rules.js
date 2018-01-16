/**
 * A module listing rules for how to proceed with the design process
 *
 * @module rules
 */
// ----------------- MODULE DEFINITION --------------------------

var rules =
{
	sections:
	{
		// Type

		type: {},

		// Post Design
		postSection: {},

		// Top Railing End Design
		postEndSection:
		{
			postDesign:
			{
				'P-BPC' : false,
				'P-SP' : true
			}
		},

		// Post Cap Design
		postCapSection:
		{
			postDesign:
			{
				'P-BPC' : true,
				'P-SP' : false
			}
		},

		// Center Design
		centerDesignSection: {},

		// Color
		colorSection: {}
	},

	nextSection: function (currentSection)
	{
		return currentSection;
	}
};

// ----------------- EXPORT --------------------------

export default rules;