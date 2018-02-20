/**
 * @module utilityController
 */

// ----------------- EXTERNAL MODULES --------------------------

var responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),

	googleTranslator = global.OwlStakes.require('utility/googleTranslator');

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function responsible for translating text to Spanish
	 *
	 * @params {Object} params -
	 * 		{
	 * 			{String} textToTranslate - the text to translate
	 * 		}
	 *
	 * @author kinsho
	 */
	translateTextToSpanish: async function(params)
	{
		console.log('Translating text to Spanish...');

		var translation = await googleTranslator.translateText(params.textToTranslate, googleTranslator.SPANISH_LANGUAGE_DESIGNATION);

		return {
			statusCode: responseCodes.OK,
			data: translation.text
		};
	},

	/**
	 * Function responsible for translating text to English
	 *
	 * @params {Object} params -
	 * 		{
	 * 			{String} textToTranslate - the text to translate
	 * 		}
	 *
	 * @author kinsho
	 */
	translateTextToEnglish: async function(params)
	{
		console.log('Translating text to English...');

		var translation = await googleTranslator.translateText(params.textToTranslate, googleTranslator.ENGLISH_LANGUAGE_DESIGNATION);

		return {
			statusCode: responseCodes.OK,
			data: translation.text
		};
	}
};