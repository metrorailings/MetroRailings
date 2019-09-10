// ----------------- EXTERNAL MODULES --------------------------

import creditCards from 'shared/ccAllowed';
import statuses from 'shared/orderStatus';
import designTranslator from 'shared/designs/translator';
import dateUtility from 'shared/dateUtility';

import rQueryClient from 'client/scripts/utility/rQueryClient';

// ----------------- ENUM/CONSTANTS -----------------------------

const	GOOGLE_MAPS_SEARCH_URL = 'https://www.google.com/maps/search/?api=1&query=::params',
	PARAMS_PLACEHOLDER = '::params';

// ----------------- HANDLEBAR HELPERS ---------------------------

/**
 * Helper designed to capitalize any string passed to it
 *
 * @author kinsho
 */
Handlebars.registerHelper('capitalize', function(str)
{
	str = str + '' || '';

	return rQueryClient.capitalize(str);
});

/**
 * Helper designed to help us figure out the next state to which to move an order
 */
Handlebars.registerHelper('next_state', function(str)
{
	return rQueryClient.capitalize(statuses.moveStatusToNextLevel(str));
});

/**
 * Helper designed to determine whether an order can have its status updated to the next level from the orders listing
 */
Handlebars.registerHelper('can_status_be_updated', function(str, block)
{
	if (statuses.moveStatusToNextLevel(str) && (statuses.isShopStatus(str)))
	{
		return block.fn(this);
	}
});

/**
 * Handlebars helper function designed to map a design's code name to a full name
 *
 * @author kinsho
 */
Handlebars.registerHelper('map_design_code_to_full_name', function(designCode)
{
	return designTranslator.findDesignName(designCode);
});

/**
 * Handlebars helper function designed to test whether multiple values are present at once
 *
 * @author kinsho
 */
Handlebars.registerHelper('if_group', function(obj, keys, block)
{
	let ifCheck = true;

	for (let i = 0; i < keys.length; i += 1)
	{
		if ( !(obj[keys[i]]) )
		{
			ifCheck = false;
		}
	}

	return (ifCheck ? block.fn(this) : block.inverse(this));
});

/**
 * Handlebars helper function designed to test whether two values are equal
 *
 * @author kinsho
 */
Handlebars.registerHelper('if_cond', function(val1, val2, block)
{
	return (val1 === val2 ? block.fn(this) : block.inverse(this));
});

/**
 * Helper designed to help us test for the equality of two values and execute opposite blocks of code depending on
 * the results of that test
 *
 * @author kinsho
 */
Handlebars.registerHelper('unless_cond', function(val1, val2, block)
{
	return (val1 === val2 ? block.inverse(this) : block.fn(this));
});

/**
 * Helper designed to help us test whether a value already exists within a set of given values. We execute
 * blocks of code depending on the results of that test
 *
 * @author kinsho
 */
Handlebars.registerHelper('if_cond_group', function(val, groupVals, block)
{
	groupVals = JSON.parse(groupVals);

	for (let i = groupVals.length - 1; i >= 0; i--)
	{
		if (groupVals[i] === val)
		{
			return block.fn(this);
		}
	}

	return block.inverse(this);
});

/**
 * Helper designed to test the existence of three properties at once
 *
 * @author kinsho
 */
Handlebars.registerHelper('if_and_set', function(val1, val2, val3, block)
{
	if (val1 && val2 && val3)
	{
		return block.fn(this);
	}
	else
	{
		return block.inverse(this);
	}
});

/**
 * Helper designed to help us test whether a value already exists within a set of given values. We execute opposite
 * blocks of code depending on the results of that test
 *
 * @author kinsho
 */
Handlebars.registerHelper('unless_cond_group', function(val, groupVals, block)
{
	groupVals = JSON.parse(groupVals);

	for (let i = groupVals.length - 1; i >= 0; i--)
	{
		if (groupVals[i] === val)
		{
			return block.inverse(this);
		}
	}

	return block.fn(this);
});

/**
 * Handlebars helper function designed to test whether a value qualifies as a string
 *
 * @author kinsho
 */
Handlebars.registerHelper('is_string', function(val)
{
	return (typeof val === 'string');
});

/**
 * Handlebars helper function designed to translate computerized dates into user-friendly text
 *
 * @author kinsho
 */
Handlebars.registerHelper('format_date', function(date)
{
	date = new Date(date);

	return dateUtility.FULL_MONTHS[date.getMonth()] + ' ' + date.getDate() + dateUtility.findOrdinalSuffix(date.getDate()) + ', ' + date.getFullYear();
});

/**
 * Handlebars helper function designed to pull a full month out of a serialized date
 *
 * @author kinsho
 */
Handlebars.registerHelper('get_month', function(date)
{
	// Take out any time zone information from the passed datestring
	if (date.toString().endsWith('Z'))
	{
		date = date.toString().slice(0, -1);
	}

	return dateUtility.FULL_MONTHS[new Date(date).getMonth()];
});

/**
 * Handlebars helper function designed to pull a specifica date out of a serialized date object
 *
 * @author kinsho
 */
Handlebars.registerHelper('get_date', function(date)
{
	// Take out any time zone information from the passed datestring
	if (date.toString().endsWith('Z'))
	{
		date = date.toString().slice(0, -1);
	}

	return new Date(date).getDate();
});

/**
 * Handlebars helper function designed to translate computerized time strings into user-friendly text
 *
 * @author kinsho
 */
Handlebars.registerHelper('format_time', function(date)
{
	let dateObj = new Date(date),
		militaryHour = dateObj.getHours(),
		readableHour = (militaryHour % 12 ? militaryHour % 12 : 12),
		useAMorPM = (militaryHour - 12 < 0 ? 'AM' : 'PM'),
		readableMinute = dateObj.getMinutes(),
		readableSecond = dateObj.getSeconds();

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
 * Handlebars helper function designed to generate a Google Maps URL for an address
 *
 * @params {Object} customer - the customer construct that contains information about the location to map
 *
 * @author kinsho
 */
Handlebars.registerHelper('form_google_maps_url', function(customer)
{
	let params = '' + customer.address.trim().split(' ').join('+') + '+' + customer.city.trim().split(' ').join('+') + '+' + customer.state;
	if (customer.zipCode)
	{
		params += customer.zipCode;
	}

	return GOOGLE_MAPS_SEARCH_URL.replace(PARAMS_PLACEHOLDER, params);
});

/**
 * Handlebars helper function designed to split multiple e-mail addresses across different lines so that it looks
 * better in display
 *
 * @params {String} email - the email(s) to split across multiple lines, should more than one e-mail be present here
 *
 * @author kinsho
 */
Handlebars.registerHelper('format_multiple_emails', function(email)
{
	let blockToInsert = '';

	if (email)
	{
		email = email.split(',');

		for (let i = 0; i < email.length; i++)
		{
			if (i - 1 >= 0)
			{
				blockToInsert += '<br />';
			}

			blockToInsert += email[i];
		}
	}

	return blockToInsert;
});

/**
 * Handlebars helper function designed to hide an order ID within a jumble of alphabetical characters
 *
 * @params {Number} id - the ID to hide 
 *
 * @author kinsho
 */
Handlebars.registerHelper('obfuscate_id', function(id)
{
	return rQueryClient.obfuscateNumbers(id);
});

/**
 * Handlebars helper function designed to round any number to a fixed number of decimal digits
 *
 * @author kinsho
 */
Handlebars.registerHelper('to_fixed', function(num, decimalDigits)
{
	return num.toFixed(decimalDigits);
});

/**
 * Handlebars helper function to translate an order status into Spanish text
 *
 * @params {String} status - the status to translate
 *
 * @author kinsho
 */
Handlebars.registerHelper('translate_status', function(status)
{
	return statuses.getSpanishTranslation(status);
});

/**
 * Handlebars helper function designed to determine which credit card icon to display depending on the value passed
 * into the function
 *
 * @author kinsho
 */
Handlebars.registerHelper('determine_cc_icon', function(val)
{
	return creditCards.ccIcon(val);
});