/**
 * @main googleTranslator
 */

// ----------------- EXTERNAL MODULES --------------------------

var _translator = require('google-translate-api'),
	_Q = require('q');

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	ENGLISH_LANGUAGE_DESIGNATION: 'en',
	SPANISH_LANGUAGE_DESIGNATION: 'es',

	/**
	 * Function responsible translating marked text to whatever language is indicated by the parameter
	 *
	 * @param {String} textToTranslate - the text to translate
	 * @param {String} languageCode - an enumerated code indicating to which language to translate the text
	 *
	 * @returns {String} - the translated text
	 *
	 * @author kinsho
	 */
	translateText: function(textToTranslate, languageCode)
	{
		var deferred = _Q.defer();

		// Translate the text
		_translator(textToTranslate, { to: languageCode }).then((results) =>
		{
			deferred.resolve(results);
		});

		return deferred.promise;
	}
};