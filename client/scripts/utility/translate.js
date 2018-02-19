/**
 * @main translate
 */

// ----------------- EXTERNAL MODULES --------------------------

import _translator from 'google-translate-api';

// ----------------- ENUMS/CONSTANTS --------------------------

var LOADING_VEIL = 'baseLoaderOverlay',
	VISIBILITY_CLASS = 'show',
	TO_TRANSLATE_CLASS = 'translate',
	SELECTED_CLASS = 'selected',

	TRANSLATE_TO_ENGLISH_LINK = 'englishLanguageTranslator',
	TRANSLATE_TO_SPANISH_LINK = 'spanishLanguageTranslator',

	ENGLISH_LANGUAGE_DESIGNATION = 'en',
	SPANISH_LANGUAGE_DESIGNATION = 'es';

// ----------------- ELEMENTS --------------------------

var _veil = document.getElementById(LOADING_VEIL),
	_englishLink = document.getElementById(TRANSLATE_TO_ENGLISH_LINK),
	_spanishLink = document.getElementById(TRANSLATE_TO_SPANISH_LINK);

// ----------------- LISTENERS --------------------------

/**
 * Function responsible for translating marked text to whatever language is indicated by the parameter
 *
 * @param {String} languageCode - the language to which to translate marked text
 *
 * @author kinsho
 */
function translatePage(languageCode)
{
	var translationPoints = document.getElementsByClassName(TO_TRANSLATE_CLASS),
		textToTranslate = '',
		i;

	// Gather all the text on the page that's designated for translation
	for (i = 0; i < translationPoints.length; i++)
	{
		textToTranslate += translationPoints[i].innerText + '|';
	}

	if (textToTranslate)
	{
		// Set up the loading veil to block the page as we translate the text
		_veil.classList.add(VISIBILITY_CLASS);

		// Translate the text
		_translator(textToTranslate, { to: languageCode }, (results) =>
		{
			// Now replace the marked text with their corresponding translated versions
			results = results.split('|');
			for (i = 0; i < translationPoints.length; i++)
			{
				translationPoints[i].innerText = results[i];
			}

			_veil.classList.remove(VISIBILITY_CLASS);
		});
	}
}

// ----------------- INITIALIZATION --------------------------

// Attach event listeners to the language links
_englishLink.addEventListener('click', function()
{
	_englishLink.classList.add(SELECTED_CLASS);
	_spanishLink.classList.remove(SELECTED_CLASS);

	translatePage(ENGLISH_LANGUAGE_DESIGNATION);
});
_spanishLink.addEventListener('click', function()
{
	_englishLink.classList.remove(SELECTED_CLASS);
	_spanishLink.classList.add(SELECTED_CLASS);

	translatePage(SPANISH_LANGUAGE_DESIGNATION);
});