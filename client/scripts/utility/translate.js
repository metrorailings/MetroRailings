/**
 * @main translate
 */

// ----------------- EXTERNAL MODULES --------------------------

import _promise from 'es6-promise';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

// ----------------- ENUMS/CONSTANTS --------------------------

var LOADING_VEIL = 'baseLoaderOverlay',
	VISIBILITY_CLASS = 'show',
	TO_TRANSLATE_CLASS = 'translate',
	SELECTED_CLASS = 'selected',

	TRANSLATE_TO_ENGLISH_LINK = 'englishLanguageTranslator',
	TRANSLATE_TO_SPANISH_LINK = 'spanishLanguageTranslator',

	TRANSLATE_TO_ENGLISH_URL = 'utility/translateTextToEnglish',
	TRANSLATE_TO_SPANISH_URL = 'utility/translateTextToSpanish';

// ----------------- PRIVATE MEMBERS --------------------------

	// Variable that keeps track of the language currently selected
	// Default language is always English
var _selectedLanguage;

// ----------------- ELEMENTS --------------------------

var _veil = document.getElementById(LOADING_VEIL),
	_englishLink = document.getElementById(TRANSLATE_TO_ENGLISH_LINK),
	_spanishLink = document.getElementById(TRANSLATE_TO_SPANISH_LINK);

// ----------------- PRIVATE FUNCTIONS --------------------------

/**
 * Function responsible for translating marked text to whatever language is indicated by the parameter
 *
 * @param {String} [languageCode] - the language to which to translate marked text
 * @param {Boolean} [forceTranslate] - a flag indicating whether we need to forcefully translate the page's text,
 * 		regardless of any default language specification
 * @param {HTMLElement} [rootNode] - if specified, only the DOM elements that fall under this rootNode will have its
 * 		text translated
 *
 * @author kinsho
 */
function _translatePage(languageCode, forceTranslate, rootNode)
{
	let translationPoints,
		textToTranslate = [],
		translateURL,
		i;

	// Fetch all the marked elements with text that will need to be translated
	rootNode = rootNode || document;
	translationPoints = rootNode.querySelectorAll('.' + TO_TRANSLATE_CLASS);

	// If the text on the page is already represented in the language being switched to, then just skip out of this
	// function, unless the forceTranslate flag is set
	if ( !(forceTranslate) && (languageCode === _selectedLanguage) )
	{
		return;
	}

	// Note the language which the text will be translated to
	_selectedLanguage = languageCode;

	// Figure out which URL to invoke in order to translate the text. Also update the page to indicate in which
	// language the page is shown in. And lastly, update the browser cache to indicate in which language the user
	// prefers to view the page in
	if (languageCode === translateModule.ENGLISH_LANGUAGE_DESIGNATION)
	{
		_englishLink.classList.add(SELECTED_CLASS);
		_spanishLink.classList.remove(SELECTED_CLASS);

		translateURL = TRANSLATE_TO_ENGLISH_URL;
	}
	else if (languageCode === translateModule.SPANISH_LANGUAGE_DESIGNATION)
	{
		_englishLink.classList.remove(SELECTED_CLASS);
		_spanishLink.classList.add(SELECTED_CLASS);

		translateURL = TRANSLATE_TO_SPANISH_URL;
	}

	// Gather all the text on the page that's designated for translation
	for (i = 0; i < translationPoints.length; i++)
	{
		textToTranslate.push(translationPoints[i].innerText);
	}

	if (textToTranslate.length)
	{
		// Set up the loading veil to block the page as we translate the text
		_veil.classList.add(VISIBILITY_CLASS);

		// Translate the text
		axios.post(translateURL, { textToTranslate: textToTranslate }).then((results) =>
		{
			// Now replace the marked text with their corresponding translated versions
			results = results.data;

			for (i = 0; i < translationPoints.length; i++)
			{
				translationPoints[i].innerText = results[i];
			}

			// Remove the veil to indicate that the text has been successfully translated
			_veil.classList.remove(VISIBILITY_CLASS);
		}, () =>
		{
			_veil.classList.remove(VISIBILITY_CLASS);
			notifier.showGenericServerError();
		});
	}
}

// ----------------- MODULE DEFINITION --------------------------

var translateModule =
{
	ENGLISH_LANGUAGE_DESIGNATION: 'en',
	SPANISH_LANGUAGE_DESIGNATION: 'es',

	/**
	 * Function translates a given piece of text or a collection of strings if the default language is anything
	 * other than English
	 *
	 * @param {String | Array<String>} text - either a single piece of text or a collection of strings that need to
	 * 		be translated
	 * @param {String} languageCode - the language to which to translate marked text
	 *
	 * @returns {String | Array<String>} - the string(s), possibly translated, returned back in whatever form their
	 * 		original variants were initially passed into the function
	 *
	 * @author kinsho
	 */
	translateText: function(text)
	{
		return new Promise((resolve, reject) =>
		{
			// For the time being, we only need to translate the text into Spanish
			if (_selectedLanguage === translateModule.SPANISH_LANGUAGE_DESIGNATION)
			{
				axios.post(TRANSLATE_TO_SPANISH_URL, { textToTranslate: text }, true).then((results) =>
				{
					resolve(results.data);
				}, () =>
				{
					_veil.classList.remove(VISIBILITY_CLASS);
					notifier.showGenericServerError();

					reject('');
				});
			}
			else
			{
				resolve(text);
			}
		});
	},

	/**
	 * Function translates a section of page forcefully
	 *
	 * @param {Enum} languageKey - the language to translate the text to
	 * @param {HTMLElement} [rootNode] - if specified, only the DOM elements that fall under this rootNode will have its
	 * 		text translated
	 *
	 * @author kinsho
	 */
	forceTranslatePage: function(languageKey, rootNode)
	{
		rootNode = rootNode || document;

		_translatePage(languageKey, true, rootNode);
	}
};

// ----------------- INITIALIZATION --------------------------

// Attach event listeners to the language links
_englishLink.addEventListener('click', function()
{
	_translatePage(translateModule.ENGLISH_LANGUAGE_DESIGNATION);
});
_spanishLink.addEventListener('click', function()
{
	_translatePage(translateModule.SPANISH_LANGUAGE_DESIGNATION);
});

// Default language on the page will always be English
_selectedLanguage = translateModule.ENGLISH_LANGUAGE_DESIGNATION;

// TODO: Set up caching on language preferences

// ----------------- EXPORT -----------------------------

export default translateModule;