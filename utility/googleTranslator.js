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
	 * @param {String | Array} textToTranslate - the text (or set of strings) to translate
	 * @param {String} languageCode - an enumerated code indicating to which language to translate the text
	 *
	 * @returns {String | Array} - the translated text, returned back in whatever form the original text was
	 * 		supplied to us
	 *
	 * @author kinsho
	 */
	translateText: async function(textToTranslate, languageCode)
	{
		var translatedText;

		if (textToTranslate instanceof Array)
		{
			// Translate the text, phrase by phrase
			translatedText = await _Q.all(textToTranslate.map(function(text)
			{
				var deferred = _Q.defer();

				console.log('TRANSLATING: ' + text);
				_translator(text, { to: languageCode }).then((results) =>
				{
					deferred.resolve(results.text);
				});

				return deferred.promise;
			}));
		}
		else
		{
			translatedText = await (async function()
			{
				var deferred = _Q.defer();

				console.log('TRANSLATING: ' + textToTranslate);
				_translator(textToTranslate, { to: languageCode }).then((results) =>
				{
					deferred.resolve(results.text);
				});

				return deferred.promise;
			}());
		}

		return translatedText;
	}
};