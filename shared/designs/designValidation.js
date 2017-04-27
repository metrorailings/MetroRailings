/**
 * A module containing a variety of functions that test whether design properties have been populated
 * with legitimate codes
 *
 * @module designValidation
 */

// ----------------- ENUMS/CONSTANTS --------------------------

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	POST_OPTION_CODES:
	{
		BP: 'Standard Big Post',
		BPC: 'Colonial Big Post',
		SP: 'Standard Small Post'
	},

	TOP_END_CODES:
	{
		VOL: 'Volute',
		LT: "Lamb's Tongue",
		SCRL: 'Scroll'
	},

	POST_CAP_CODES:
	{
		BALL: 'Ball',
		SQ: 'Square',
		MIX: 'Mixed'
	},

	CENTER_DESIGN_CODES:
	{
		NONE: 'None',
		SC: 'S/C Scrolls',
		HRT: 'Hearts',
		RHRT: 'Reverse Hearts',
		DIA: 'Diamonds',
		TLP: 'Tulip',
		GALE: 'Gale'
	},

	/**
	 * Main function that tests whether a given property qualifies as a valid code
	 *
	 * @param {String} value - the value to test
	 * @param {Object} codes - the set of valid codes that apply to the passed value
	 *
	 * @returns {String} - either an empty string or the full text corresponding to the code passed in
	 *
	 * @author kinsho
	 */
	testProperty: function(value, codes)
	{
		return (value ? codes[value] : '');
	}
}