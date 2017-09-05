/**
 * A module that can hash any string into a set of numbers
 *
 * @module hasher
 */

// ----------------- ENUMS/CONSTANTS --------------------------

var HASH_SEED = 3341;

// ----------------- MODULE DEFINITION --------------------------

/**
 * Function takes any string and returns a simple hash that can be derived from that string
 *
 * @param {String} str - the string to hash
 *
 * @returns {Number} - the hash derived from the passed string
 *
 * @author kinsho
 */
module.exports = function(str)
{
	var hash = HASH_SEED,
		i = (str ? str.length : 0);

	while (i)
	{
		hash = (hash * 33) ^ str.charCodeAt(--i);
	}

	// JavaScript does bitwise operations (like XOR, above) on 32-bit signed integers. Since we want the results to
	// be always positive, convert the signed int to an unsigned by doing an unsigned bitshift.
	return hash >>> 0;
};