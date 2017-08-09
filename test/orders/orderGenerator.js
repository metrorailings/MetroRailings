// ----------------- EXTERNAL MODULES --------------------------

var _randomstring = require('randomstring'),
	creditCardProcessor = global.OwlStakes.require('utility/creditCardProcessor');

// ----------------- ENUM/CONSTANTS -----------------------------

var COLORS = ['white', 'black', 'silver', 'mahogany'],
	STATES = ['NJ'],
	CITIES = ['North Plainfield', 'Watchung', 'Warren', 'Clifton', 'Passaic', 'Parsippany'],
	DOMAINS = ['gmail.com', 'aol.com', 'outlook.com', 'yahoo.com'],
	STATUSES = ['estimate', 'pending', 'queue', 'production', 'finishing', 'install', 'closed', 'cancelled'],
	POST_DESIGNS = ['P-BPC', 'P-SP'],
	POST_END_DESIGNS = ['PE-VOL', 'PE-LT', 'PE-SCRL'],
	POST_CAP_DESIGNS = ['PC-BALL', 'PC-SQ'],
	CENTER_DESIGNS = ['CD-NONE', 'CD-SC', 'CD-GALE', 'CD-DHRT', 'CD-SNC'],

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

	ORDER_NOTES =
	{
		length: 100,
		charset: 'alphanumeric'
	},

	TEST_CC_TOKEN = 'tok_visa',

	ESTIMATE_STATUS = 'estimate';

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
module.exports = async function(status, dateCreatedBy, modificationDate)
{
	var order = {};

	if ( !(status) )
	{
		status = _randomSelect(STATUSES);
	}

	order =
	{
		_id: parseInt(_randomstring.generate(ID)),
		createDate: dateCreatedBy,
		lastModifiedDate: modificationDate,
		status: status,
		length: Math.floor(Math.random() * 20) + 20,
		ccToken: TEST_CC_TOKEN,

		notes:
		{
			order: _randomstring.generate(ORDER_NOTES),
			internal: ''
		},

		pricing:
		{
			pricePerFoot: Math.floor(Math.random() * 70) || 75,
			additionalPrice: Math.floor(Math.random() * 500),
			deductions: Math.floor(Math.random() * 200),
			paidByCheck: !!(Math.round(Math.random()))
		},

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
		},

		design:
		{
			post: _randomSelect(POST_DESIGNS),
			postEnd: _randomSelect(POST_END_DESIGNS),
			postCap: _randomSelect(POST_CAP_DESIGNS),
			center: _randomSelect(CENTER_DESIGNS),
			color: _randomSelect(COLORS),
		}
	};

	// Calculate the order total and the balance paid off
	order.pricing.orderTotal = (order.length * order.pricing.pricePerFoot) + order.pricing.additionalPrice - order.pricing.deductions;
	order.pricing.balanceRemaining = order.pricing.orderTotal / 2;

	// Generate a Stripe record for these transactions
	if (!order.pricing.paidByCheck)
	{
		order.stripe =
		{
			customer: await creditCardProcessor.generateCustomerRecord(order.ccToken, order.customer.name, order.customer.email),
			charges: []
		};

		order.stripe.charges.push(await creditCardProcessor.chargeTotal(order.pricing.orderTotal / 2, order.stripe.customer, order._id));
	}

	// Randomly delete the design specs for orders in Estimate status
	if ((status === ESTIMATE_STATUS) && (Math.round(Math.random())))
	{
		delete order.design;
	}

	return order;
};