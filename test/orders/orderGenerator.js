// ----------------- EXTERNAL MODULES --------------------------

var _randomstring = require('randomstring');

// ----------------- ENUM/CONSTANTS -----------------------------

var TYPES = ['stairs', 'deck'],
	STYLES = ['bars', 'collars', 'custom'],
	COLORS = ['white', 'black', 'silver', 'mahogany'],
	STATES = ['NJ'],
	CITIES = ['North Plainfield', 'Watchung', 'Warren', 'Clifton', 'Passaic', 'Parsippany'],
	DOMAINS = ['gmail.com', 'aol.com', 'outlook.com', 'yahoo.com'],
	STATUSES = ['open', 'consult', 'production', 'install', 'closed', 'cancelled'],

	ID =
	{
		length: 4,
		charset: 'numeric'
	},
	AREA_CODE =
	{
		length: 3,
		charset: 'numeric'
	},
	PHONE_ONE =
	{
		length: 3,
		charset: 'numeric'
	},
	PHONE_TWO =
	{
		length: 4,
		charset: 'numeric'
	},
	FIRST_NAME =
	{
		length: 6,
		charset: 'alphabetic'
	},
	LAST_NAME =
	{
		length: 4,
		charset: 'alphabetic'
	},
	ADDRESS =
	{
		length: 15,
		charset: 'alphabetic',
		capitalization: 'lowercase'
	},
	ZIP_CODE =
	{
		length: 5,
		charset: 'numeric'
	},
	EMAIL_ADDRESS =
	{
		length: 7,
		charset: 'alphanumeric'
	},

	GENERIC_CC_TOKEN = 'xyz_34834838';

// ----------------- PRIVATE FUNCTIONS -----------------------------

/**
 * Function randomly selects an element from a passed collection
 *
 * @param {Array<any>} collection - the collection from which to randomly pick an element
 *
 * @author kinsho
 */
function _randomSelect(collection)
{
	return collection[Math.floor(Math.random() * collection.length)];
}

// ----------------- MODULE DEFINITION --------------------------

/**
 * The module is a function that only accepts three parameters, one being the creation date to stamp on to the new order
 * being created, another being the modification date to apply to the order, and the last (but most important one) being
 * the status to apply to the order
 *
 * @param {String} status - the status to append to the order
 * @param {Date} dateCreatedBy - the creation date of the order
 * @param {Date} modificationDate - the date the order was last modified
 *
 * @author kinsho
 */
module.exports = function(status, dateCreatedBy, modificationDate)
{
	if ( !(status) )
	{
		status = _randomSelect(STATUSES);
	}

	return {
		_id: parseInt(_randomstring.generate(ID)),
		createDate: dateCreatedBy,
		lastModifiedDate: modificationDate,
		status: status,
		type: _randomSelect(TYPES),
		style: _randomSelect(STYLES),
		color: _randomSelect(COLORS),
		length: Math.floor(Math.random() * 20) + 20,
		orderTotal: Math.floor(Math.random() * 1200) + 1200,
		ccToken: GENERIC_CC_TOKEN,
		notes: '',
		customer:
		{
			name: _randomstring.generate(FIRST_NAME) + ' ' + _randomstring.generate(LAST_NAME),
			address: Math.floor(Math.random() * 100) + ' ' + _randomstring.generate(ADDRESS) + ' St.',
			email: _randomstring.generate(EMAIL_ADDRESS) + '@' + _randomSelect(DOMAINS),
			areaCode: _randomstring.generate(AREA_CODE),
			phoneOne: _randomstring.generate(PHONE_ONE),
			phoneTwo: _randomstring.generate(PHONE_TWO),
			city: _randomSelect(CITIES),
			state: _randomSelect(STATES),
			zipCode: _randomstring.generate(ZIP_CODE)
		}
	};
}