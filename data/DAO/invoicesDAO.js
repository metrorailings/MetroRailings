// ----------------- EXTERNAL MODULES --------------------------

var mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver'),
	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO'),

	dateUtility = global.OwlStakes.require('shared/dateUtility');

// ----------------- ENUMS/CONSTANTS --------------------------

var INVOICES_COLLECTION = 'invoices',
	ORDERS_COLLECTION = 'orders',
	COUNTERS_COLLECTION = 'counters',

	UNPAID_STATUS = 'unpaid',
	PAID_STATUS = 'paid';

// ----------------- PRIVATE FUNCTIONS --------------------------

/**
 * Function responsible for creating a modification record to record who modified an invoice and at what time he
 * modified the invoice
 *
 * @param {Object} invoice - the invoice
 * @param {String} username - the name of the user modifying the order
 *
 * @author kinsho
 */
function _applyModificationUpdates(invoice, username)
{
	var modificationDate = new Date();

	invoice.lastModifiedDate = modificationDate;
	invoice.modHistory = invoice.modHistory || [];
	invoice.modHistory.push(
	{
		user: username,
		date: modificationDate
	});
}

/**
 * Simple utility function that's meant to parse a number from a string or return a zero otherwise if the string cannot
 * be parsed to yield a non-zero number
 *
 * @param {String} num - the string to be parsed
 *
 * @returns {Number} - the number that the string conveys
 *
 * @author kinsho
 */
function _parseNumberOrReturnZero(num)
{
	return (num ? (parseFloat(num) || 0) : 0);
}

/**
 * Simple utility function that's to generate a fully-formed user-friendly date from a Date object
 *
 * @param {Date} date - the date to transform
 *
 * @returns {String} - the date, formatted and ready to be presented to users
 *
 * @author kinsho
 */
function _generateUserFriendlyDate(date)
{
	return dateUtility.FULL_MONTHS[date.getMonth()] + ' ' + date.getDate() + dateUtility.findOrdinalSuffix(date.getDate()) + ', ' + date.getFullYear();
}

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function responsible for fetching an existing invoice from the database using its ID
	 *
	 * @param {Number} invoiceNumber - the invoice identification number
	 *
	 * @returns {Object} - the invoice itself, in its entirety
	 *
	 * @author kinsho
	 */
	searchInvoiceById: async function (invoiceNumber)
	{
		try
		{
			var dbResults = await mongo.read(INVOICES_COLLECTION,
				{
					_id: invoiceNumber
				});

			return dbResults[0];
		}
		catch(error)
		{
			console.log('Ran into an error fetching existing invoice #' + invoiceNumber);
			console.log(error);

			return false;
		}
	},

	/**
	 * Function responsible for registering a new invoice into the system
	 *
	 * @param {Object} prospect - a new invoice to save into our system
	 * @param {Object} username - the admin registering this invoice
	 *
	 * @author kinsho
	 */
	saveInvoice: async function (invoice, username)
	{
		var counterRecord = await mongo.readThenModify(COUNTERS_COLLECTION,
			{
				$inc: { seq: 13 }
			},
			{
				_id: INVOICES_COLLECTION
			});

		// Attach a new ID to this invoice
		invoice._id = counterRecord.seq;

		// Apply an initial status of unpaid to the invoice
		invoice.status = UNPAID_STATUS;

		// Note the date and time this invoice was created
		invoice.createDateTime = new Date();

		// Apply and initialize properties to indicate when this invoice was initially founded
		_applyModificationUpdates(invoice, username);

		// Now save the invoice
		try
		{
			await mongo.bulkWrite(INVOICES_COLLECTION, true, mongo.formInsertSingleQuery(invoice));

			return invoice;
		}
		catch(error)
		{
			console.log('Ran into an error saving a new invoice!');
			console.log(error);

			throw error;
		}
	},

	/**
	 * Function responsible for noting that an invoice is associated with a particular order 
	 *
	 * @param {Number} invoiceID - the ID of the invoice
	 * @param {Number} orderID - the ID of the order
	 *
	 * @author kinsho
	 */
	associateInvoiceWithOrder: async function (invoiceID, orderID)
	{
		var order = await ordersDAO.searchOrderById(orderID),
			updateRecord;

		if (order)
		{
			// If the order has no invoices collection, create one
			order.invoices = order.invoices || [];

			// Link this invoice to the order
			order.invoices.push(invoiceID);

			updateRecord = mongo.formUpdateOneQuery(
			{
				_id: orderID
			}, order, false);

			await mongo.bulkWrite(ORDERS_COLLECTION, true, updateRecord);
		}
	}
};