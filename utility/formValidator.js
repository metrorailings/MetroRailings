/**
 * @module formValidator
 */
// ----------------- ENUMS/CONSTANTS --------------------------

var CAPITALIZED_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	LOWER_CASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz',

	NUMBERS = '0123456789';

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function validates whether the passed string is a valid e-mail address
	 *
	 * @param {String} str - the string to evaluate
	 *
	 * @returns {boolean} - a boolean indicating whether the string is indeed an e-mail address
	 *
	 * @author kinsho
	 *
	 * @TODO - Tighten up the validation logic to account for things like what type of characters are acceptable in the domain
	 */
	isEmail: function(str)
	{
		str = str || '';

		var emailComponents = str.split('@'),
			beforeAt = emailComponents[0],
			afterAt = emailComponents[1],
			domainComponents = (afterAt ? afterAt.split('.') : []),
			isDomainFullyFormed = true,
			i;

		if ( !(str) )
		{
			return true;
		}

		for (i = 0; i < domainComponents.length; i++)
		{
			if ( !(domainComponents[i]) )
			{
				isDomainFullyFormed = false;
			}
		}

		// Test whether the string has aspects expected of an e-mail address
		return ((str.indexOf('@') > -1) &&
				(emailComponents.length === 2) &&
				(afterAt.indexOf('.') > -1) &&
				(beforeAt) &&
				(str.indexOf(' ') === -1) &&
				(isDomainFullyFormed));
	},

	/**
	 * Function validates whether the passed string qualifies as a valid phone number
	 *
	 * @param {String} str - the string to evaluate
	 *
	 * @returns {boolean} - a boolean indicating whether the string is indeed a fully-formed phone number
	 *
	 * @author kinsho
	 */
	isPhoneNumber: function(str)
	{
		str = str || '';

		var phoneComponents = str.split('-'),
			areaCode = phoneComponents[0] || '',
			firstThreeDigits = phoneComponents[1] || '',
			lastFourDigits = phoneComponents[2] || '',
			dashlessNumber = phoneComponents.join('');

		if ( !(str) )
		{
			return true;
		}

		if ((areaCode.length !== 3) ||
			(firstThreeDigits.length !== 3) ||
			(lastFourDigits.length !== 4))
		{
			return false;
		}

		for (var i = str.length - 1; i >= 0; i--)
		{
			if (NUMBERS.indexOf(dashlessNumber[i]) === -1)
			{
				return false;
			}
		}

		return true;
	},

	/**
	 * Function validates whether the passed string strictly consists of alphabetical characters and other allowed
	 * characters
	 *
	 * @param {String} str - the string to evaluate
	 * @param {String} [additionalChecks] - a string of other characters that are allowed to be a part of the
	 * 		string to evaluate
	 *
	 * @returns {boolean} - a boolean indicating whether the string is only comprised of alphabetical characters
	 *
	 * @author kinsho
	 */
	isAlphabetical: function(str, additionalChecks)
	{
		str = str || '';
		additionalChecks = additionalChecks || '';

		for (var i = str.length - 1; i >= 0; i--)
		{
			if ((CAPITALIZED_LETTERS.indexOf(str[i]) === -1) &&
				(LOWER_CASE_LETTERS.indexOf(str[i]) === -1) &&
				(additionalChecks.indexOf(str[i]) === -1))
			{
				return false;
			}
		}

		return true;
	},

	/**
	 * Function validates whether the passed string strictly consists of numerical characters and other allowed
	 * characters
	 *
	 * @param {String} str - the string to evaluate
	 * @param {String} [additionalChecks] - a string of other characters that are allowed to be a part of the
	 * 		string to evaluate
	 *
	 * @returns {boolean} - a boolean indicating whether the string is only comprised of numerical and allowed
	 * 		characters
	 *
	 * @author kinsho
	 */
	isNumeric: function(str, additionalChecks)
	{
		str = str || '';
		additionalChecks = additionalChecks || '';

		for (var i = str.length - 1; i >= 0; i--)
		{
			if ((NUMBERS.indexOf(str[i]) === -1) &&
				(additionalChecks.indexOf(str[i]) === -1))
			{
				return false;
			}
		}

		return true;
	},

	/**
	 * Function validates whether the passed string strictly consists of alphabetical characters, numerical characters
	 * and other allowed characters
	 *
	 * @param {String} str - the string to evaluate
	 * @param {String} [additionalChecks] - a string of other characters that are allowed to be a part of the
	 * 		string to evaluate
	 *
	 * @returns {boolean} - a boolean indicating whether the string is only comprised of alphanumeric characters and
	 * 		other allowed characters
	 *
	 * @author kinsho
	 */
	isAlphaNumeric: function(str, additionalChecks)
	{
		str = str || '';
		additionalChecks = additionalChecks || '';

		for (var i = str.length - 1; i >= 0; i--)
		{
			if ((CAPITALIZED_LETTERS.indexOf(str[i]) === -1) &&
				(LOWER_CASE_LETTERS.indexOf(str[i]) === -1) &&
				(NUMBERS.indexOf(str[i]) === -1) &&
				(additionalChecks.indexOf(str[i]) === -1))
			{
				return false;
			}
		}

		return true;
	}
};