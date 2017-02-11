/**
 * A module testing for all the different types of credit cards that can be accepted
 *
 * @module ccAllowed
 */

// ----------------- ENUMS/CONSTANTS --------------------------

var BRANDS =
	{
		VISA: 'visa',
		MASTERCARD: 'mastercard',
		DISCOVER: 'discover'
	};

// ----------------- PRIVATE FUNCTIONS --------------------------

/**
 * Function to check whether the passed credit card number belongs to a Visa
 *
 * @param {String} number - the credit card number to analyze
 *
 * @returns {boolean} - a flag indicating whether the number corresponds to a Visa
 *
 * @author kinsho
 */
function _isVisa(number)
{
	number = number || '';

	return (parseInt(number[0], 10) === 4);
}

/**
 * Function to check whether the passed credit card number belongs to a Mastercard
 *
 * @param {String} number - the credit card number to analyze
 *
 * @returns {boolean} - a flag indicating whether the number corresponds to a Mastercard
 *
 * @author kinsho
 */
function _isMastercard(number)
{
	number = number || '';

	var first2 = parseInt(number.slice(0, 2), 10),
		first4 = parseInt(number.slice(0, 4), 10);

	return ( ((first2 >= 51) && (first2 <= 55)) ||
		((first4 >= 2221) && (first4 <= 2720)) );
}

/**
 * Function to check whether the passed credit card number belongs to a Discover card
 *
 * @param {String} number - the credit card number to analyze
 *
 * @returns {boolean} - a flag indicating whether the number corresponds to a Discover card
 *
 * @author kinsho
 */
function _isDiscover(number)
{
	number = number || '';

	var first2 = parseInt(number.slice(0, 2), 10),
		first3 = parseInt(number.slice(0, 3), 10),
		first4 = parseInt(number.slice(0, 4), 10),
		first6 = parseInt(number.slice(0, 6), 10);

	return ( (first2 === 65) ||
		((first3 >= 644) && (first3 <= 649)) ||
		(first4 === 6011) ||
		((first6 >= 622126) && (first6 <= 622925)) );
}

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function checks whether the credit card number is acceptable
	 *
	 * @param {String} ccNumber - the credit card number to test
	 *
	 * @returns {String} - the name of the accepted brand, should the number prove acceptable. Otherwise, an empty string
	 *
	 * @author kinsho
	 */
	checkCCNumber: function(ccNumber)
	{
		if (_isVisa(ccNumber))
		{
			return BRANDS.VISA;
		}

		if (_isMastercard(ccNumber))
		{
			return BRANDS.MASTERCARD;
		}

		if (_isDiscover(ccNumber))
		{
			return BRANDS.DISCOVER;
		}

		return '';
	}
};