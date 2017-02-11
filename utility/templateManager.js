/**
 * @module templateManager
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('Q'),
	_Handlebars = require('Handlebars'),
	_htmlMinifier = require('html-minifier').minify,
	fileManager = global.OwlStakes.require('utility/fileManager'),
	rQuery = global.OwlStakes.require('utility/rQuery');

// ----------------- ENUMS/CONSTANTS --------------------------

var UTILITY_FOLDER = 'utility',
	GALLERY_TEMPLATE = 'gallery',
	CONFIRMATION_MODAL_TEMPLATE = 'confirmationModal',
	SCROLL_DOWN_TEMPLATE = 'scrollDownLabel';

// ----------------- PRIVATE VARIABLES -----------------------------

var _compiledTemplates = [],
	_htmlMinifierConfig =
	{
		collapseWhitespace : true,
		collapseInlineTagWhitespace : true
	};

// ----------------- PARTIAL TEMPLATES --------------------------

// Load handlebar partials that we can expect to use across the application

/**
 * The template for the image gallery
 */
_Handlebars.registerPartial('gallery', fileManager.fetchTemplateSync(UTILITY_FOLDER, GALLERY_TEMPLATE));

/**
 * The template for the confirmation modal
 */
_Handlebars.registerPartial('confirmationModal', fileManager.fetchTemplateSync(UTILITY_FOLDER, CONFIRMATION_MODAL_TEMPLATE));

/**
 * The template for the scroll down signifier
 */
_Handlebars.registerPartial('scrollDownLabel', fileManager.fetchTemplateSync(UTILITY_FOLDER, SCROLL_DOWN_TEMPLATE));

// ----------------- GENERIC HELPERS --------------------------

/**
 * Handlebars helper function that allowsHelper designed to help us to generate blocks of HTML over a range of numbers
 *
 * @author kinsho
 */
_Handlebars.registerHelper('range', (beginningNumber, endingNumber, block) =>
{
	var num = beginningNumber,
		output = '';

	while(num <= endingNumber)
	{
		output += block.fn(num);
		num += 1;
	}

	return output;
});

/**
 * Helper designed to help us test for the equality of two values
 *
 * @author kinsho
 */
_Handlebars.registerHelper('if_cond', function(val1, val2, block)
{
	return (val1 === val2 ? block.fn(this) : block.inverse(this));
});

/**
 * Helper designed to help us test whether one value is greater than another
 *
 * @author kinsho
 */
_Handlebars.registerHelper('if_greater_cond', function(val1, val2, block)
{
	return (val1 >= val2 ? block.fn(this) : block.inverse(this));
});

/**
 * Helper designed to iterate over all the keys of an object and send in each property to the block within the helper
 *
 * @author kinsho
 */
_Handlebars.registerHelper('iterate_keys', function(obj, block)
{
	var keys = Object.keys(obj),
		output = '',
		i;

	for (i = 0; i < keys.length; i++)
	{
		output += block.fn(
		{
			key: keys[i],
			value: obj[keys[i]]
		});
	}

	return output;
});

/**
 * Helper designed to take any string and return that same string, completely in lower-case
 *
 * @author kinsho
 */
_Handlebars.registerHelper('to_lowercase', function(str)
{
	str = str + '' || '';

	return str.toLowerCase();
});

/**
 * Helper designed to capitalize any string passed to it
 *
 * @author kinsho
 */
_Handlebars.registerHelper('capitalize', function(str)
{
	str = str + '' || '';

	return rQuery.capitalize(str);
});

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function fetches a template using a provided path and populates it using passed data. Any helper
	 * functions that are passed alongside the other parameters are registered into handlebars prior
	 * to the template being compiled.
	 *
	 * @param {JSON} data - the data to roll into the template
	 * @param {String} templateDirectory - the directory in which the template is located
	 * @param {String} templateName - the name of the template
	 *
	 * @return {String} - the HTML with all of its data points populated
	 *
	 * @author kinsho
	 */
	populateTemplate: _Q.async(function* (data, templateDirectory, templateName)
	{
		var template;

		// Check to see if the template has already been precompiled and cached. If not, fetch the template,
		// compile it, and cache it.
		template = _compiledTemplates[templateDirectory + '-' + templateName];
		if ( !(template) )
		{
			template = yield fileManager.fetchTemplate(templateDirectory, templateName);
			template = _Handlebars.compile(template);
			_compiledTemplates[templateDirectory + '-' + templateName] = template;
		}

		// Feed the data into the template and return the resulting HTML after it has been minified
		return _htmlMinifier(template(data), _htmlMinifierConfig);
	})
};