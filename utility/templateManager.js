/**
 * @module templateManager
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('handlebars'),
	_htmlMinifier = require('html-minifier').minify,

	fileManager = global.OwlStakes.require('utility/fileManager'),
	rQuery = global.OwlStakes.require('utility/rQuery'),

	designTranslator = global.OwlStakes.require('shared/designs/translator');

// ----------------- ENUMS/CONSTANTS --------------------------

var UTILITY_FOLDER = 'utility',

	PARTIALS =
	{
		GALLERY: 'gallery',
		CONFIRMATION_MODAL: 'confirmationModal',
		SCROLL_DOWN: 'scrollDownLabel',
		OPTIONS_CAROUSEL: 'optionsCarousel',
		NOTIFICATION_BAR: 'notificationBar',
		SUCCESS_BAR: 'successBar',
		TOP_MENU: 'topMenu'
	};

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
_Handlebars.registerPartial('gallery', fileManager.fetchTemplateSync(UTILITY_FOLDER, PARTIALS.GALLERY));

/**
 * The template for the confirmation modal
 */
_Handlebars.registerPartial('confirmationModal', fileManager.fetchTemplateSync(UTILITY_FOLDER, PARTIALS.CONFIRMATION_MODAL));

/**
 * The template for the scroll down signifier
 */
_Handlebars.registerPartial('scrollDownLabel', fileManager.fetchTemplateSync(UTILITY_FOLDER, PARTIALS.SCROLL_DOWN));

/**
 * The template for the options carousel
 */
_Handlebars.registerPartial('optionsCarousel', fileManager.fetchTemplateSync(UTILITY_FOLDER, PARTIALS.OPTIONS_CAROUSEL));

/**
 * The template for the notification bar
 */
_Handlebars.registerPartial('notificationBar', fileManager.fetchTemplateSync(UTILITY_FOLDER, PARTIALS.NOTIFICATION_BAR));

/**
 * The template for the success bar
 */
_Handlebars.registerPartial('successBar', fileManager.fetchTemplateSync(UTILITY_FOLDER, PARTIALS.SUCCESS_BAR));

/**
 * The template for the top menu
 */
_Handlebars.registerPartial('topMenu', fileManager.fetchTemplateSync(UTILITY_FOLDER, PARTIALS.TOP_MENU));

// ----------------- GENERIC HELPERS --------------------------

/**
 * Handlebars helper function designed to help us to generate blocks of HTML over a range of numbers
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
 * Helper designed to help us test for the equality of two values and execute certain blocks of code depending on
 * the results of that test
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

/**
 * Helper designed to multiply two numbers and return the product
 *
 * @author kinsho
 */
_Handlebars.registerHelper('multiply', function(a, b)
{
	return a * b;
});

/**
 * Handlebars helper function designed to round any number to a fixed number of decimal digits
 *
 * @author kinsho
 */
_Handlebars.registerHelper('to_fixed', function(num, decimalDigits)
{
	return num.toFixed(decimalDigits);
});

/**
 * Handlebars helper function designed to test whether two values equal one another
 *
 * @author kinsho
 */
_Handlebars.registerHelper('test_equality', function(val1, val2)
{
	return (val1 === val2);
});

/**
 * Handlebars helper function designed to map a design's code name to a full name
 *
 * @author kinsho
 */
_Handlebars.registerHelper('map_design_code_to_full_name', function(designCode)
{
	return designTranslator.findDesignName(designCode);
});

/**
 * Handlebars helper function designed to determine whether a given design code is not standardized
 *
 * @author kinsho
 */
_Handlebars.registerHelper('is_custom_design', function(designCode, block)
{
	return (designTranslator.isCustomDesign(designCode) ? block.fn(this) : block.inverse(this));
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
	populateTemplate: async function (data, templateDirectory, templateName)
	{
		var template;

		try
		{
			// Check to see if the template has already been precompiled and cached. If not, fetch the template,
			// compile it, and cache it.
			template = _compiledTemplates[templateDirectory + '-' + templateName];
			if ( !(template) )
			{
				template = await fileManager.fetchTemplate(templateDirectory, templateName);
				template = _Handlebars.compile(template);
				_compiledTemplates[templateDirectory + '-' + templateName] = template;
			}

			// Feed the data into the template and return the resulting HTML after it has been minified
			return _htmlMinifier(template(data), _htmlMinifierConfig);
		}
		catch (ex)
		{
			console.log('Had trouble compiling the ' + templateName + ' template...');
			console.log(ex);
		}
	}
};