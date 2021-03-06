// ----------------- EXTERNAL MODULES --------------------------

let _cookieManager = require('cookie'),
	_crypto = require('crypto'),

	config = global.OwlStakes.require('config/config');

// ----------------- ENUMS/CONSTANTS --------------------------

let ADMIN_COOKIE = 'owl';

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function responsible for initializing a new cookie using the passed parameters
	 *
	 * @param {String} name - the name of the cookie
	 * @param {String} value - the JSON data to serialize into a cookie
	 *
	 * @returns {String} - a serialized cookie
	 *
	 * @author kinsho
	 */
	formCookie: function(name, value)
	{
		return _cookieManager.serialize(name, JSON.stringify(value), { path: '/' });
	},

	/**
	 * Function responsible for parsing a cookie from a client machine
	 *
	 * @param {String} cookie - the raw cookie to deserialize
	 *
	 * @returns {Object} - an unwrapped cookie object
	 *
	 * @author kinsho
	 */
	parseCookie: function(cookie)
	{
		return _cookieManager.parse(cookie);
	},

	/**
	 * Function responsible for generating an administrator cookie
	 *
	 * @param {String} username - the username for the admin
	 * @param {String} password - the password for the admin
	 * @param {boolean} rememberForAMonth - a flag indicating whether the cookie is to remain in effect for a month
	 *
	 * @returns {String} - a serialized admin cookie
	 *
	 * @author kinsho
	 */
	generateAdminCookie: function(username, password, rememberForAMonth)
	{
		let iv = _crypto.randomBytes(16),
			textToHash = username + '||' + password + '||' + new Date().getTime(),
			cipher = _crypto.createCipheriv(config.ENCRYPTION_ALGORITHM, config.HASH_KEY, iv),
			cookieSerializerOptions =
			{
				path: '/'
			},
			cipherText;

		// Encrypt whatever text needs to be encoded
		cipherText = cipher.update(textToHash, config.ENCRYPTION_INPUT_TYPE, config.ENCRYPTION_OUTPUT_TYPE);
		cipherText += cipher.final(config.ENCRYPTION_OUTPUT_TYPE);
		cipherText = iv.toString('hex') + ':' + cipherText.toString('hex');

		// If the flag is set, ensure that this cookie remains in effect for a month
		if (rememberForAMonth)
		{
			cookieSerializerOptions.maxAge = 60 * 60 * 24 * 31;
		}

		return _cookieManager.serialize(ADMIN_COOKIE, cipherText, cookieSerializerOptions);
	},

	/**
	 * Function meant to parse apart administrator details from the cookie, should that cookie have the details we look
	 * for
	 *
	 * @param {String} cookie - the raw cookie to analyze
	 *
	 * @returns {Object} - an unwrapped and decrypted administrator cookie
	 *
	 * @author kinsho
	 */
	retrieveAdminCookie: function(cookie)
	{
		let cookieData = _cookieManager.parse(cookie || '')[ADMIN_COOKIE],
			cryptoComponents = (cookieData ? cookieData.split(':') : []),
			decipher,
			decipheredText,
			adminData;

		if (cookieData)
		{
			// Decrypt the cookie to see if we have meaningful data
			decipher = _crypto.createDecipheriv(config.ENCRYPTION_ALGORITHM, config.HASH_KEY, Buffer.from(cryptoComponents[0], 'hex'));
			decipheredText = decipher.update(Buffer.from(cryptoComponents[1], 'hex'), config.ENCRYPTION_OUTPUT_TYPE, config.ENCRYPTION_INPUT_TYPE);
			decipheredText += decipher.final(config.ENCRYPTION_INPUT_TYPE);
			adminData = decipheredText.split('||');

			if (adminData.length === 3)
			{
				return adminData;
			}
		}

		return {};
	},
};