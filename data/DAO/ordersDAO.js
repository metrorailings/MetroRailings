// ----------------- EXTERNAL MODULES --------------------------

var mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver'),

	creditCardProcessor = global.OwlStakes.require('utility/creditCardProcessor'),
	rQuery = global.OwlStakes.require('utility/rQuery'),

	pricingCalculator = global.OwlStakes.require('shared/pricing/pricingCalculator'),
	dateUtility = global.OwlStakes.require('shared/dateUtility'),
	statuses = global.OwlStakes.require('shared/orderStatus');

// ----------------- ENUMS/CONSTANTS --------------------------

var ORDERS_COLLECTION = 'orders',
	COUNTERS_COLLECTION = 'counters',
	REMOVED_ORDERS_COLLECTION = 'removedOrders',

	SYSTEM_USER_NAME = 'system',

	PENDING_STATUS = 'pending',
	QUEUE_STATUS = 'queue',
	CLOSED_STATUS = 'closed';

// ----------------- PRIVATE FUNCTIONS --------------------------

/**
 * Function responsible for creating a modification record to record who modified an order and at what time he
 * modified the order
 *
 * @param {Object} order - the order
 * @param {String} username - the name of the user modifying the order
 *
 * @author kinsho
 */
function _applyModificationUpdates(order, username)
{
	var modificationDate = new Date();

	order.lastModifiedDate = modificationDate;
	order.modHistory = order.modHistory || [];
	order.modHistory.push(
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

var ordersModule =
{
	/**
	 * Function responsible for fetching an existing order from the database using its ID
	 *
	 * @param {Object} orderNumber - the order identification number
	 *
	 * @returns {Object} - the order itself, in its entirety
	 *
	 * @author kinsho
	 */
	searchOrderById: async function (orderNumber)
	{
		try
		{
			var dbResults = await mongo.read(ORDERS_COLLECTION,
				{
					_id: orderNumber
				});

			return dbResults[0];
		}
		catch(error)
		{
			console.log('Ran into an error fetching an existing order using its ID...');
			console.log(error);

			return false;
		}
	},

	/**
	 * Function responsible for fetching orders from the database that were modified from a given date
	 *
	 * @param {Date} beginningDate - the date and time from which to look for new orders
	 *
	 * @returns Array<Object> - all orders that come on or after the passed datetime
	 *
	 * @author kinsho
	 */
	searchOrdersByDate: async function (beginningDate)
	{
		try
		{
			console.log('Searching for all orders that have been modified after ' + beginningDate);

			var dbResults = await mongo.read(ORDERS_COLLECTION,
				{
					lastModifiedDate: mongo.greaterThanOrEqualToOperator(beginningDate)
				},
				{
					lastModifiedDate: -1
				});

			return dbResults;
		}
		catch(error)
		{
			console.log('Ran into an error fetching orders!');
			console.log(error);

			return false;
		}
	},

	/**
	 * Function responsible for search for orders from the database given various criteria
	 *
	 * @param {Number} [orderID]- the order number associated with the order being sought
	 * @param {String} [email]- the e-mail address associated with the orders being sought
	 * @param {Number} [phoneTwo]- the last four digits of the phone number associated with the orders being sought
	 *
	 * @returns Array<Object> - all orders that match the search criteria
	 *
	 * @author kinsho
	 */
	searchOrdersByMisc: async function (orderID, email, phoneTwo)
	{
		var filterData = {};

		// Create the query by which to filter orders
		if (orderID)
		{
			filterData._id = orderID;
		}
		if (email)
		{
			filterData['customer.email'] = email;
		}
		if (phoneTwo)
		{
			filterData['customer.phoneTwo'] = phoneTwo;
		}

		try
		{
			console.log('Searching for orders...');

			var dbResults = await mongo.read(ORDERS_COLLECTION, filterData,
				{
					createDate: -1
				});

			return dbResults;
		}
		catch(error)
		{
			console.log('Ran into an error fetching orders!');
			console.log(error);

			return false;
		}
	},

	/**
	 * Function responsible for registering a new order into the database
	 *
	 * @param {Object} order - a new customer order to save into our system
	 * @param {Object} username - the admin creating this order
	 *
	 * @returns {Object} - the order, completely processed now that it has been stored in the database
	 *
	 * @author kinsho
	 */
	setUpNewOrder: async function (order, username)
	{
		var counterRecord = await mongo.readThenModify(COUNTERS_COLLECTION,
			{
				$inc: { seq: 1 }
			},
			{
				_id: ORDERS_COLLECTION
			});

		// Before saving the order into the database, set some system-default values into the order
		order.status = PENDING_STATUS;
		order.createDate = new Date();

		// Apply and initialize properties to indicate when this order was last modified
		_applyModificationUpdates(order, username);

		// Attach a new ID to the order
		order._id = counterRecord.seq;

		// Figure out how we'll be referencing the customer
		order.customer.nickname = (order.customer.name.split(' ').length > 1 ? rQuery.capitalize(order.customer.name.split(' ')[0]) : order.customer.name);

		// Calculate the amount to charge the customer
		order.pricing.orderTotal = pricingCalculator.calculateOrderTotal(order);

		// As the customer has not paid anything yet, the balance remaining should be equal to the order total
		order.pricing.balanceRemaining = order.pricing.orderTotal;

		// Now save the order
		try
		{
			await mongo.bulkWrite(ORDERS_COLLECTION, true, mongo.formInsertSingleQuery(order));

			return order;
		}
		catch(error)
		{
			console.log('Ran into an error saving a new order!');
			console.log(error);

			throw error;
		}
	},

	/**
	 * Function responsible for indicating that an order has been finalized and for saving any changes the customer
	 * may have made to the order while approving.
	 *
	 * @param {Object} approvedOrder - the approved order to save into our system
	 *
	 * @returns {Object} - the order, completely processed now that it has been finalized
	 *
	 * @author kinsho
	 */
	finalizeNewOrder: async function (approvedOrder)
	{
		var orderID = parseInt(approvedOrder._id, 10),
			order = await ordersModule.searchOrderById(orderID),
			dueDate,
			transactionID,
			updateRecord;

		order = rQuery.mergeObjects(approvedOrder, order);

		// Calculate the amount to charge the customer
		order.pricing.orderTotal = pricingCalculator.calculateOrderTotal(order);

		// Record that this order is being modified
		_applyModificationUpdates(order, SYSTEM_USER_NAME);

		// Note the date that this order was finalized
		order.finalizationDate = new Date();

		// Update the status to indicate that the order is now queued for production
		order.status = QUEUE_STATUS;

		// Run over this nickname logic again just in case the customer changed his name
		order.customer.nickname = (order.customer.name.split(' ').length > 1 ? rQuery.capitalize(order.customer.name.split(' ')[0]) : order.customer.name);

		// Figure out the due date on when this order is due, if a time limit has been specified
		if (order.timeLimit && order.timeLimit.original)
		{
			dueDate = new Date();
			dueDate.setDate(dueDate.getDate() + order.timeLimit.original);
			order.timeLimit.rawDueDate = dueDate;
			order.timeLimit.translatedDueDate = _generateUserFriendlyDate(dueDate);
			order.timeLimit.extension = 0;
		}

		// Generate a payment record for the order if the user provided a credit card number
		// And don't forget to charge the customer either
		if (order.ccToken)
		{
			try
			{
				order.stripe =
				{
					customer: await creditCardProcessor.generateCustomerRecord(order.ccToken, order.customer.name, order.customer.email),
					charges: []
				};

				// Charge the customer prior to saving the order. After charging the customer, store the transaction ID
				// inside the order itself
				transactionID = await creditCardProcessor.chargeTotal(order.pricing.orderTotal / 2, order.stripe.customer, order._id);
				order.stripe.charges.push(transactionID);
			}
			catch(error)
			{
				console.log('Ran into an error trying to transact some money...');
				console.log(error);

				throw error;
			}
		}
		// Else record that the order is being paid via check
		else
		{
			order.pricing.paidByCheck = true;
		}

		// Note that the order has yet to be paid off, as only half of the total amount has been paid up until now
		order.pricing.balanceRemaining = order.pricing.orderTotal / 2;

		// Now generate a record of data we will be using to update the database
		updateRecord = mongo.formUpdateOneQuery(
		{
			_id: orderID
		}, order, false);

		try
		{
			await mongo.bulkWrite(ORDERS_COLLECTION, true, updateRecord);

			return order;
		}
		catch(error)
		{
			console.log('Ran into an error approving order ' + order._id);
			console.log(error);

			throw error;
		}
	},

	/**
	 * Function responsible for updating status for a particular order
	 *
	 * @param {Object} orderNumber - the order identification number
	 * @param {String} username - the username of the admin updating this order
	 * @param {String} status - the new status to apply to the order
	 *
	 * @returns {Object} - the newly revised modification date as well as the new status applied to the order
	 *
	 * @author kinsho
	 */
	updateStatus: async function (orderNumber, username)
	{
		var order = await ordersModule.searchOrderById(orderNumber),
			nextStatus = statuses.moveStatusToNextLevel(order.status),
			updateRecord;

		// Ensure that the order is properly updated with a record indicating when this order was updated
		// and who updated this order
		_applyModificationUpdates(order, username);

		updateRecord = mongo.formUpdateOneQuery(
		{
			_id: orderNumber
		},
		{
			status: nextStatus,
			lastModifiedDate: order.lastModifiedDate,
			modHistory: order.modHistory
		},
		false);

		try
		{
			await mongo.bulkWrite(ORDERS_COLLECTION, true, updateRecord);

			return {
				lastModifiedDate: order.lastModifiedDate,
				status: nextStatus
			};
		}
		catch(error)
		{
			console.log('Ran into an error updating a status for order ' + orderNumber);
			console.log(error);

			throw error;
		}
	},

	/**
	 * Function responsible for saving changes made to an order and also generating transactions to either charge the
	 * customer or refund money back to him/her
	 *
	 * @param {Object} orderModifications - the order that contains the modified data
	 * @param {String} username - the name of the admin making the changes
	 *
	 * @returns {Boolean} - a simple flag indicating that the order was successfully saved
	 *
	 * @author kinsho
	 */
	saveChangesToOrder: async function (orderModifications, username)
	{
		var order = await ordersModule.searchOrderById(parseInt(orderModifications._id, 10)),
			amountToBePaid,
			transactionID,
			dataToUpdate,
			rawDueDate,
			updateRecord;

		// Ensure that the order is properly updated with a record indicating when this order was updated
		// and who updated this order
		_applyModificationUpdates(order, username);

		// Convert any modified pricing and other numeric data into a numerical format
		orderModifications.pricing.modification = _parseNumberOrReturnZero(orderModifications.pricing.modification);
		orderModifications.pricing.pricePerFoot = _parseNumberOrReturnZero(orderModifications.pricing.pricePerFoot);
		orderModifications.pricing.additionalPrice = _parseNumberOrReturnZero(orderModifications.pricing.additionalPrice);
		orderModifications.pricing.deductions = _parseNumberOrReturnZero(orderModifications.pricing.deductions);

		// Recalculate the total price of the order
		orderModifications.pricing.orderTotal = pricingCalculator.calculateOrderTotal(orderModifications);

		// If the order is still pending finalization, reset the balance remaining
		if (order.status === PENDING_STATUS)
		{
			orderModifications.pricing.balanceRemaining = orderModifications.pricing.orderTotal;
		}

		if (order.timeLimit && order.timeLimit.original && order.finalizationDate)
		{
			// If the time limit has been extended or shortened, adjust the due date. Otherwise, adjust the due date back to
			// what it was before it was adjusted
			rawDueDate = order.finalizationDate;
			rawDueDate.setDate(rawDueDate.getDate() + order.timeLimit.original + (orderModifications.timeLimit.extension || 0));
			orderModifications.timeLimit.rawDueDate = rawDueDate;
			orderModifications.timeLimit.translatedDueDate = _generateUserFriendlyDate(rawDueDate);
		}

		try
		{
			// Calculate the balance remaining to be paid
			amountToBePaid = order.pricing.balanceRemaining + orderModifications.pricing.modification;

			if (orderModifications.status === CLOSED_STATUS)
			{
				// Generate credit card transactions necessary to satisfy any changes that may have been made to the order
				// price only after the order has been closed
				if ( !(order.pricing.paidByCheck) && !(orderModifications.pricing.restByCheck) )
				{
					if (amountToBePaid > 0)
					{
						// Charge the customer if the order total has been increased
						transactionID = await creditCardProcessor.chargeTotal(amountToBePaid, order.stripe.customer, order._id);
						order.stripe.charges.push(transactionID);
					}
					else if (amountToBePaid < 0)
					{
						// Refund money back to the customer if the order total has been lessened
						await creditCardProcessor.refundMoney(Math.abs(amountToBePaid), order.stripe.charges, order._id);
					}
				}

				// If the order is closed, we assume that any balance has been paid off.
				orderModifications.pricing.balanceRemaining = 0;
			}
		}
		catch(error)
		{
			console.log('Ran into an error trying to transact some money...');
			console.log(error);

			throw error;
		}

		// Gather the data that we will need to put into the database
		dataToUpdate =
		{
			status: orderModifications.status,
			stripe: order.stripe,
			rushOrder: orderModifications.rushOrder,

			lastModifiedDate: order.lastModifiedDate,
			modHistory: order.modHistory,

			length: orderModifications.length,
			finishedHeight: orderModifications.finishedHeight,

			agreement: orderModifications.agreement,
			additionalFeatures: orderModifications.additionalFeatures,

			'customer.areaCode': orderModifications.customer.areaCode,
			'customer.phoneOne': orderModifications.customer.phoneOne,
			'customer.phoneTwo': orderModifications.customer.phoneTwo,
			'customer.email': orderModifications.customer.email,
			'customer.address': orderModifications.customer.address,
			'customer.aptSuiteNo': orderModifications.customer.aptSuiteNo,
			'customer.city': orderModifications.customer.city,
			'customer.state': orderModifications.customer.state,
			'customer.zipCode': orderModifications.customer.zipCode,

			'pricing.pricePerFoot': orderModifications.pricing.pricePerFoot,
			'pricing.additionalPrice': orderModifications.pricing.additionalPrice,
			'pricing.deductions': orderModifications.pricing.deductions,
			'pricing.modification': orderModifications.pricing.modification,
			'pricing.orderTotal': orderModifications.pricing.orderTotal,

			'design.post': orderModifications.design.post,
			'design.handrailing': orderModifications.design.handrailing,
			'design.picket': orderModifications.design.picket,
			'design.postEnd': orderModifications.design.postEnd,
			'design.postCap': orderModifications.design.postCap,
			'design.center': orderModifications.design.center,
			'design.color': orderModifications.design.color,

			'installation.coverPlates': orderModifications.installation.coverPlates,
			'installation.platformType': orderModifications.installation.platformType,

			'notes.internal': orderModifications.notes.internal,
			'notes.order': orderModifications.notes.order
		};

		// Set flags and other data now according to whether the order meets certain conditions
		if ( !(order.pricing.paidByCheck) )
		{
			dataToUpdate['pricing.restByCheck'] = orderModifications.pricing.restByCheck;
		}
		if (order.timeLimit && order.timeLimit.original && order.finalizationDate)
		{
			dataToUpdate.timeLimit =
			{
				original : order.timeLimit.original,
				extension : orderModifications.timeLimit.extension,
				rawDueDate : orderModifications.timeLimit.rawDueDate,
				translatedDueDate : orderModifications.timeLimit.translatedDueDate,
			};
		}
		// If the order is still pending finalization, reset the balance remaining
		if (order.status === PENDING_STATUS)
		{
			dataToUpdate['pricing.balanceRemaining'] = orderModifications.pricing.orderTotal;
		}

		// Now generate a record of data we will be using to update the database
		updateRecord = mongo.formUpdateOneQuery(
		{
			_id: order._id
		}, dataToUpdate, false);

		try
		{
			await mongo.bulkWrite(ORDERS_COLLECTION, true, updateRecord);

			return true;
		}
		catch(error)
		{
			console.log('Ran into an error updating order ' + orderModifications._id);
			console.log(error);

			throw error;
		}
	},

	/**
	 * Function responsible for saving images to an order record
	 *
	 * @param {String} orderID - the ID of the order being modified
	 * @param {Object} images - the metadata of the newly uploaded image(s)
	 * @param {String} username - the name of the admin making the changes
	 *
	 * @returns {Boolean} - a simple flag indicating whether changes to the order were successfully saved
	 *
	 * @author kinsho
	 */
	saveNewPicToOrder: async function (orderID, images, username)
	{
		var order = await ordersModule.searchOrderById(parseInt(orderID, 10)),
			updateRecord;

		// Ensure that the order is properly updated with a record indicating when this order was updated
		// and who updated this order
		_applyModificationUpdates(order, username);

		// If no image uploads have been associated with this order, instantiate a new collection
		order.pictures = order.pictures || [];

		// Push the new image metadata into the order record
		order.pictures.push(...images);

		// Generate a record to push into the database
		updateRecord = mongo.formUpdateOneQuery(
		{
			_id: order._id
		},
		{
			pictures: order.pictures
		},
		false);

		try
		{
			await mongo.bulkWrite(ORDERS_COLLECTION, true, updateRecord);

			return true;
		}
		catch(error)
		{
			console.log('Ran into an error updating order ' + order._id);
			console.log(error);

			throw error;
		}
	},

	/**
	 * Function responsible for deleting image metadata from an order record
	 *
	 * @param {String} orderID - the ID of the order being modified
	 * @param {Object} meta - the metadata of the image being deleted
	 * @param {String} username - the name of the admin making the changes
	 *
	 * @returns {Boolean} - a simple flag indicating whether changes to the order were successfully saved
	 *
	 * @author kinsho
	 */
	deletePicFromOrder: async function (orderID, imgMeta, username)
	{
		var order = await ordersModule.searchOrderById(parseInt(orderID, 10)),
			updateRecord,
			i;

		// Ensure that the order is properly updated with a record indicating when this order was updated
		// and who updated this order
		_applyModificationUpdates(order, username);

		// Find the index of the image to remove from the metadata collection
		for (i = order.pictures.length - 1; i >= 0; i--)
		{
			if (order.pictures[i].id === imgMeta.id)
			{
				break;
			}
		}

		// Splice out that image metadata
		order.pictures.splice(i, 1);

		// Generate a record to push the changes into the database
		updateRecord = mongo.formUpdateOneQuery(
		{
			_id: order._id
		},
		{
			pictures: order.pictures
		},
		false);

		try
		{
			await mongo.bulkWrite(ORDERS_COLLECTION, true, updateRecord);

			return true;
		}
		catch(error)
		{
			console.log('Ran into an error updating order ' + order._id);
			console.log(error);

			throw error;
		}
	},

	/**
	 * Function responsible for removing an order from being managed through the admin system
	 *
	 * @param {Number} orderID - the ID of the order being modified
	 * @param {String} username - the name of the admin making the changes
	 *
	 * @returns {Boolean} - a simple flag indicating whether the order was successfully removed
	 *
	 * @author kinsho
	 */
	removeOrder: async function (orderID, username)
	{
		var order = await ordersModule.searchOrderById(parseInt(orderID, 10));

		// Ensure that the order is properly updated with a record indicating when this order was updated
		// and who updated this order
		_applyModificationUpdates(order, username);

		try
		{
			// Add the order to remove from a collection specifically meant to house these removed orders
			await mongo.bulkWrite(REMOVED_ORDERS_COLLECTION, true, mongo.formInsertSingleQuery(order));

			// Remove the order from the main orders collection
			await mongo.bulkWrite(ORDERS_COLLECTION, true, mongo.formDeleteOneQuery({ _id : order._id }));

			return true;
		}
		catch(error)
		{
			console.log('Ran into an error removing order ' + order._id);
			console.log(error);

			throw error;
		}
	}
};

// ----------------- EXPORT MODULE --------------------------

module.exports = ordersModule;