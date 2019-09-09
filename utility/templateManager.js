
/**
 * @module templateManager
 */

// ----------------- EXTERNAL MODULES --------------------------

let _Handlebars = require('handlebars'),
	_htmlMinifier = require('html-minifier').minify,

	fileManager = global.OwlStakes.require('utility/fileManager'),
	rQuery = global.OwlStakes.require('utility/rQuery'),

	creditCards = global.OwlStakes.require('shared/ccAllowed'),
	dateUtility = global.OwlStakes.require('shared/dateUtility'),
	designTranslator = global.OwlStakes.require('shared/designs/translator'),
	statuses = global.OwlStakes.require('shared/orderStatus');

// ----------------- ENUMS/CONSTANTS --------------------------

const UTILITY_FOLDER = 'utility',

	PARTIALS =
	{
		GALLERY: 'gallery',
		LOADING_INDICATOR: 'generalLoadingIndicators',
		CONFIRMATION_MODAL: 'confirmationModal',
		ACTION_MODAL: 'actionModal',
		SCROLL_DOWN: 'scrollDownLabel',
		OPTIONS_CAROUSEL: 'optionsCarousel',
		NOTIFICATION_BAR: 'notificationBar',
		SUCCESS_BAR: 'successBar',
		TOP_MENU: 'topMenu',
		ADMIN_MENU: 'adminMenu',
		FOOTER: 'clientFooter'
	};

// ----------------- PRIVATE VARIABLES -----------------------------

let _compiledTemplates = [],
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
 * The template for the action modal
 */
_Handlebars.registerPartial('actionModal', fileManager.fetchTemplateSync(UTILITY_FOLDER, PARTIALS.ACTION_MODAL));

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

/**
 * The template for the generalized loading indicators
 */
_Handlebars.registerPartial('generalLoadingIndicators', fileManager.fetchTemplateSync(UTILITY_FOLDER, PARTIALS.LOADING_INDICATOR));

/**
 * The template for the visible portion of the footer
 */
_Handlebars.registerPartial('clientFooter', fileManager.fetchTemplateSync(UTILITY_FOLDER, PARTIALS.FOOTER));

// ----------------- GENERIC HELPERS --------------------------

/**
 * Handlebars helper function designed to help us to generate blocks of HTML over a range of numbers
 *
 * @author kinsho
 */
_Handlebars.registerHelper('range', (beginningNumber, endingNumber, block) =>
{
	let num = beginningNumber,
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
 * Helper designed to test the existence of two properties at once
 *
 * @author kinsho
 */
_Handlebars.registerHelper('if_and', function(val1, val2, block)
{
	if (val1 && val2)
	{
		return block.fn(this);
	}
	else
	{
		return block.inverse(this);
	}
});

/**
 * Helper designed to help us test for the equality of two values and execute opposite blocks of code depending on
 * the results of that test
 *
 * @author kinsho
 */
_Handlebars.registerHelper('unless_cond', function(val1, val2, block)
{
	return (val1 === val2 ? block.inverse(this) : block.fn(this));
});

/**
 * Helper designed to execute certain blocks of code depending on whether at least one of two conditions are true
 *
 * @author kinsho
 */
_Handlebars.registerHelper('if_or', function(val1, val2, block)
{
	return ((val1 || val2) ? block.fn(this) : block.inverse(this));	
});

/**
 * Helper designed to help us test whether a value already exists within a set of given values. We execute opposite
 * blocks of code depending on the results of that test
 *
 * @author kinsho
 */
_Handlebars.registerHelper('unless_cond_group', function(val, groupVals, block)
{
	groupVals = JSON.parse(groupVals);

	for (let i = 0; i < groupVals.length; i += 1)
	{
		if (groupVals[i] === val)
		{
			return block.inverse(this);
		}
	}

	return block.fn(this);
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
	let keys = Object.keys(obj),
		output = '';

	for (let i = 0; i < keys.length; i++)
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
_Handlebars.registerHelper('map_design_code_to_full_name', function(designCode, toLowerCase)
{
	return ( toLowerCase !== true ?
			designTranslator.findDesignName(designCode) :
			designTranslator.findDesignName(designCode).toLowerCase() );
});

/**
 * Handlebars helper function designed to map a design's code name to its Spanish equivalent
 *
 * @author kinsho
 */
_Handlebars.registerHelper('map_design_code_to_spanish_name', function(designCode)
{
	return designTranslator.findDesignNameInSpanish(designCode);
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

/**
 * Handlebars helper function designed to format strings before being placed into the textarea field
 *
 * @author kinsho
 */
_Handlebars.registerHelper('format_value_for_textarea', function(str)
{
	return (str ? str.split('<br />').join('\n') : '');
});

/**
 * Handlebars helper function designed to translate computerized dates into user-friendly text
 *
 * @author kinsho
 */
_Handlebars.registerHelper('format_date', function(date)
{
	return dateUtility.FULL_MONTHS[date.getMonth()] + ' ' + date.getDate() + dateUtility.findOrdinalSuffix(date.getDate()) + ', ' + date.getFullYear();
});

/**
 * Handlebars helper function designed to translate computerized dates into concise user-friendly text
 *
 * @author kinsho
 */
_Handlebars.registerHelper('format_date_shorthand', function(date)
{
	return dateUtility.formatShortDate(date);
});

/**
 * Handlebars helper function designed to format dates so that they can be programmatically set into date fields
 *
 * @author kinsho
 */
_Handlebars.registerHelper('format_date_for_input', function(date)
{
	return dateUtility.formatForInputDate(date);
});

/**
 * Handlebars helper function designed to translate computerized time strings into user-friendly text
 *
 * @author kinsho
 */
_Handlebars.registerHelper('format_time', function(date)
{
	let militaryHour = date.getHours(),
		readableHour = (militaryHour % 12 ? militaryHour % 12 : 12),
		useAMorPM = (militaryHour - 12 < 0 ? 'AM' : 'PM'),
		readableMinute = date.getMinutes(),
		readableSecond = date.getSeconds();

	// Add zeroes to the front of any time component that's less than 10
	if (readableHour < 10)
	{
		readableHour = '0' + readableHour;
	}
	if (readableMinute < 10)
	{
		readableMinute = '0' + readableMinute;
	}
	if (readableSecond < 10)
	{
		readableSecond = '0' + readableSecond;
	}

	return readableHour + ':' + readableMinute + ':' + readableSecond + ' ' + useAMorPM;
});

/**
 * Handlebars helper function designed to test whether a value qualifies as a string
 *
 * @author kinsho
 */
_Handlebars.registerHelper('is_string', function(val)
{
	return (typeof val === 'string');
});

/**
 * Handlebars helper function designed to join together two string values
 *
 * @author kinsho
 */
_Handlebars.registerHelper('concat', function(val1, val2)
{
	return val1 + '' + val2;
});

/**
 * Handlebars helper function designed to split a string into a collection of substrings segregated out by commas
 *
 * @author kinsho
 */
_Handlebars.registerHelper('split_by_comma', function(val)
{
	return val.split(',');
});

/**
 * Handlebars helper function designed to determine which credit card icon to display depending on the value passed
 * into the function
 *
 * @author kinsho
 */
_Handlebars.registerHelper('determine_cc_icon', function(val)
{
	return creditCards.ccIcon(val);
});

/**
 * Handlebars helper function to translate an order status into Spanish text
 *
 * @params {String} status - the status to translate
 *
 * @author kinsho
 */
_Handlebars.registerHelper('translate_status', function(status)
{
	return statuses.getSpanishTranslation(status);
});

/**
 * Handlebars helper function meant to list out multiple e-mail addresses in a graceful manner within the DOM tree
 *
 * @params {String} emailAddresses - the list of e-mail addresses, delineated by commas
 *
 * @author kinsho
 */
_Handlebars.registerHelper('format_emails', function(emailAddresses)
{
	let emailHTML = '',
		emails = emailAddresses.split(',');

	for (let i = 0; i < emails.length; i += 1)
	{
		emailHTML += '<span>' + emails[i] + '</span>';
	}

	return emailHTML;
});

/**
 * Handlebars helper function meant to determine whether an admin is allowed to navigate to a particular part of the
 * administration platform
 *
 * @params {String} username - the admin's username to test
 *
 * @author kinsho
 */
_Handlebars.registerHelper('is_admin_allowed_to_navigate', function(adminPermissions, pageURL, block)
{
	let permissions = adminPermissions.split('|');

	for (let i = 0; i < permissions.length; i += 1)
	{
		if (permissions[i] === pageURL)
		{
			return block.fn(this);
		}
	}

	return block.inverse(this);
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
		let template;

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