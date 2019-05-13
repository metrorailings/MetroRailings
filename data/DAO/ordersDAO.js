// ----------------- EXTERNAL MODULES --------------------------

const mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver'),

	creditCardProcessor = global.OwlStakes.require('utility/creditCardProcessor'),
	rQuery = global.OwlStakes.require('utility/rQuery'),

	pricingCalculator = global.OwlStakes.require('shared/pricing/pricingCalculator'),
	dateUtility = global.OwlStakes.require('shared/dateUtility'),
	statuses = global.OwlStakes.require('shared/orderStatus');

// ----------------- ENUMS/CONSTANTS --------------------------

const ORDERS_COLLECTION = 'orders',
	COUNTERS_COLLECTION = 'counters',
	REMOVED_ORDERS_COLLECTION = 'removedOrders',

	SYSTEM_USER_NAME = 'system',
	UNKNOWN_USER_NAME = 'Unknown',

	STATUS =
	{
		PROSPECT: 'prospect',
		PENDING: 'pending',
		MATERIAL: 'material',
		LAYOUT: 'layout',
		WELDING: 'welding',
		GRINDING: 'grinding',
		PAINTING: 'painting',
		INSTALL: 'install',
		CLOSING: 'closing',
		CLOSED: 'closed',
		CANCELLED: 'cancelled'
	},

	MODIFICATION_REASONS =
	{
		QUOTE_CREATION: 'Quote Created',
		FINALIZE_ORDER: 'Order Finalized',
		PAYMENT: 'Payment',
		DUE_DATE_CHANGE: 'Due Date Change'
	};

// ----------------- PRIVATE FUNCTIONS --------------------------

/**
 * Function responsible for creating a modification record to record who modified an order and at what time he
 * modified the order
 *
 * @param {Object} order - the order
 * @param {String} username - the name of the user modifying the order
 * @param {String} [reason] - the reason which this order is being modified
 *
 * @author kinsho
 */
function _applyModificationUpdates(order, username, reason)
{
	let modificationDate = new Date();

	order.dates = order.dates || {};

	order.dates.lastModified = modificationDate;
	order.modHistory = order.modHistory || [];
	order.modHistory.push(
	{
		user: username,
		date: modificationDate,
		reason: reason || ''
	});
}

/**
 * Function responsible for storing a note in a special format that would allow us to track all the notes that were
 * written on this order
 *
 * @param {Object} order - the order
 * @param {String} note - the note
 * @param {String} username - the name of the user writing the note
 *
 * @author kinsho
 */
function _formNoteRecord(order, note, username)
{
	order.notes.internal = order.notes.internal || [];

	// If we are dealing with old orders here, we need to convert the old notes so that they remain accessible
	// through the new format
	if (typeof order.notes.internal === 'string')
	{
		order.notes.internal =
		[{
			note: order.notes.internal,
			author: UNKNOWN_USER_NAME,
			date: order.lastModifiedDate
		}];
	}

	if (note && note.trim())
	{
		order.notes.internal.unshift(
		{
			note: note,
			author: username,
			date: new Date()
		});
	}
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

let ordersModule =
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
			let dbResults = await mongo.read(ORDERS_COLLECTION,
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
	 * Function responsible for fetching all open orders
	 *
	 * @author kinsho
	 */
	searchForOpenOrders: async function ()
	{
		try
		{
			let dbResults = await mongo.read(ORDERS_COLLECTION, mongo.orOperator('status', 
				[STATUS.MATERIAL, STATUS.LAYOUT, STATUS.WELDING, STATUS.GRINDING, STATUS.PAINTING, STATUS.INSTALL]),
				{ 'dates.due': 1 });

			return dbResults;
		}
		catch(error)
		{
			console.log('Ran into an error fetching all open orders...');
			console.log(error);

			return false;
		}
	},

	/**
	 * Function responsible for fetching a removed order from the database using its ID
	 *
	 * @param {Object} orderNumber - the order identification number
	 *
	 * @returns {Object} - the order itself, in its entirety
	 *
	 * @author kinsho
	 */
	searchRemovedOrderById: async function (orderNumber)
	{
		try
		{
			let dbResults = await mongo.read(REMOVED_ORDERS_COLLECTION,
				{
					_id: orderNumber
				});

			return dbResults[0];
		}
		catch(error)
		{
			console.log('Ran into an error fetching a removed order using its ID...');
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

			let dbResults = await mongo.read(ORDERS_COLLECTION,
				{
					'dates.lastModified': mongo.greaterThanOrEqualToOperator(beginningDate)
				},
				{
					'dates.lastModified': 1
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
		let filterData = {};

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

			let dbResults = await mongo.read(ORDERS_COLLECTION, filterData,
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
	 * Function responsible for saving or updating a prospect in the database
	 *
	 * @param {Object} order - the order data to save into our system
	 *
	 * @author kinsho
	 */
	saveProspect: async function (prospect)
	{
		let orderId = prospect._id,
			counterRecord,
			databaseRecord;

		// If the order is not extant in our database, then assign a new ID to the order
		if ( !(orderId) )
		{
			counterRecord = await mongo.readThenModify(COUNTERS_COLLECTION,
				{
					$inc: { seq: 1 }
				},
				{
					_id: ORDERS_COLLECTION
				});

			// Attach a new ID to the order
			prospect._id = counterRecord.seq;
		}

		// Mark this order as a prospect
		prospect.status = STATUS.PROSPECT;

		// Generate a record to upsert all this order information into our database
		databaseRecord = mongo.formUpdateOneQuery(
		{
			_id: orderId
		}, prospect, true);

		// Now save the order
		try
		{
			await mongo.bulkWrite(ORDERS_COLLECTION, true, databaseRecord);

			return true;
		}
		catch(error)
		{
			console.log('Ran into an error saving data to a prospect!');
			console.log(error);

			throw error;
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
		let counterRecord,
			databaseRecord;

		// If the order is not a prospect being converted to an order, then assign a new ID to the order
		if ( !(order._id) )
		{
			counterRecord = await mongo.readThenModify(COUNTERS_COLLECTION,
			{
				$inc: { seq: 1 }
			},
			{
				_id: ORDERS_COLLECTION
			});

			// Attach a new ID to the order
			order._id = counterRecord.seq;
		}
		else
		{
		}

		// Set the status
		order.status = STATUS.PENDING;

		// Set the creation date of the order
		order.dates = order.dates || {};
		order.dates.created = new Date();

		// Apply and/or initialize properties to indicate when this order was last modified
		_applyModificationUpdates(order, username, MODIFICATION_REASONS.QUOTE_CREATION);

		// Figure out how we'll be referencing the customer
		order.customer.nickname = (order.customer.name.split(' ').length > 1 ? rQuery.capitalize(order.customer.name.split(' ')[0]) : order.customer.name);

		// Calculate the amount to charge the customer
		order.pricing.subtotal = pricingCalculator.calculateSubtotal(order);
		order.pricing.tax = pricingCalculator.calculateTax(order.pricing.subtotal, order);
		order.pricing.tariff = pricingCalculator.calculateTariffs(order.pricing.subtotal, order);
		order.pricing.orderTotal = pricingCalculator.calculateTotal(order);

		// Generate an empty hash object to record all payments made on this order
		order.payments = {};

		// As the customer has not paid anything yet, the balance remaining should be equal to the order total
		order.payments.balanceRemaining = order.pricing.orderTotal;

		// Generate a record to upsert all this order information into our database
		databaseRecord = mongo.formUpdateOneQuery(
		{
			_id: order._id
		}, order, true);

		// Now save the order
		try
		{
			await mongo.bulkWrite(ORDERS_COLLECTION, true, databaseRecord);

			return order;
		}
		catch(error)
		{
			console.log('Ran into an error formalizing a new order!');
			console.log(error);

			throw error;
		}
	},

	/**
	 * Function responsible for adding a securitized token to an order so that we could charge credit cards
	 * repeatedly if necessary
	 *
	 * @param {Number} orderId - the ID of the order which will store the token
	 * @param {Object} token - the token to store into the order
	 *
	 * @param {Array<Object>} - the list of credit cards that have been used for payments on this order
	 *
	 * @author kinsho
	 */
	addTokenToOrder: async function (orderId, token)
	{
		let order = await ordersModule.searchOrderById(parseInt(orderId, 10)),
			updateRecord;

		order.payments.ccTokens = order.payments.ccTokens || [];
		order.payments.ccTokens.push(token);

		// Now generate a record of data we will be using to update the database
		updateRecord = mongo.formUpdateOneQuery(
		{
			_id: orderId
		}, order, false);

		try
		{
			await mongo.bulkWrite(ORDERS_COLLECTION, true, updateRecord);

			return order.payments.ccTokens;
		}
		catch(error)
		{
			console.log('Ran into an error approving order ' + order._id);
			console.log(error);

			throw error;
		}

	},

	/**
	 * Function responsible for recording details about a recent charge made on this order
	 *
	 * @param {Object} order - the actual order to modify
	 * @param {String} username - the name of the user recording this charge
	 * @param {Object} transaction - the transaction details to store
	 * @param {Number} amount - the amount that was charged
	 *
	 * @returns {Object} - the payments property for the order being modified
	 *
	 * @author kinsho
	 */
	recordCharge: async function (order, username, transaction, amount)
	{
		let updateRecord;

		// Store those transaction details inside the order itself so that we can reference the payment for
		// tracking purposes
		order.payments.charges.push(transaction);

		// Adjust the balance remaining to reflect what has been paid off
		order.payments.balanceRemaining -= amount;

		// Record the modifications being made to this order
		_applyModificationUpdates(order, username, MODIFICATION_REASONS.PAYMENT);

		// Now generate a record of data we will be using to update the database
		updateRecord = mongo.formUpdateOneQuery(
		{
			_id: order._id
		}, order, false);

		// Save the order now that it has been updated and the payment has been successfully made
		try
		{
			await mongo.bulkWrite(ORDERS_COLLECTION, true, updateRecord);

			return true;
		}
		catch(error)
		{
			console.log('Ran into an error approving order ' + order._id);
			console.log(error);

			throw error;
		}

	},

	/**
	 * Function responsible for indicating that an order has been finalized and for saving any changes the customer
	 * may have made to the order while approving.
	 *
	 * @param {Object} approvedOrder - certain details of the approved order to save into our system
	 *
	 * @returns {Object} - the order, completely processed now that it has been finalized
	 *
	 * @author kinsho
	 */
	finalizeNewOrder: async function (approvedOrder)
	{
		let orderId = parseInt(approvedOrder._id, 10),
			order = await ordersModule.searchOrderById(orderId),
			transaction,
			updateRecord;

		// Merge any order detail changes from the invoice page over into our database record
		order = rQuery.mergeObjects(approvedOrder, order);

		// Record that this order is being modified
		_applyModificationUpdates(order, SYSTEM_USER_NAME, MODIFICATION_REASONS.FINALIZE_ORDER);

		// Note the date that this order was finalized
		order.dates.finalized = new Date();

		// Update the status to indicate that the order is now ready for production and we need to start gathering
		// material
		order.status = STATUS.MATERIAL;

		// Run over this nickname logic again just in case the customer changed his name
		order.customer.nickname = (order.customer.name.split(' ').length > 1 ? rQuery.capitalize(order.customer.name.split(' ')[0]) : order.customer.name);

		// Initialize the collection where we will keep track of all payments made for this order
		order.payments.charges = [];

		// Generate a payment record for the order if the user provided a credit card number
		// And don't forget to charge the customer either!!
		if (order.payments && order.payments.ccTokens && order.payments.ccTokens.length)
		{
			try
			{
				// Charge the customer prior to saving the order
				transaction = await creditCardProcessor.chargeTotal(order.pricing.depositAmount, order._id, order.payments.ccTokens[0].id, order.customer.email, order.customer.name, order.customer.company,TRANSACTION_REASONS.ORDER_ID + orderId + TRANSACTION_REASONS.DEPOSIT);

				// Adjust the balance remaining to reflect that a portion of the price has been paid off
				order.payments.balanceRemaining -= order.pricing.depositAmount;
			}
			catch(error)
			{
				console.log('Ran into an error trying to process a credit card for Order #' + orderId);
				console.log(error);

				throw error;
			}
		}

		// Now generate a record of data we will be using to update the database
		updateRecord = mongo.formUpdateOneQuery(
		{
			_id: orderId
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
		let order = await ordersModule.searchOrderById(orderNumber),
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
	 * Function responsible for changing the due date for a given order in the database
	 *
	 * @param {Number} orderId - the ID of the order to modify
	 * @param {Date || falsy} dueDate - the new due date, if one was presented to this function
	 *
	 * @author kinsho
	 */
	changeDueDate: async function (orderId, dueDate, username)
	{
		let order = await ordersModule.searchOrderById(orderId),
			updateRecord;

		// Ensure that the order is properly updated with a record indicating when this order was updated
		// and who updated this order
		_applyModificationUpdates(order, username, MODIFICATION_REASONS.DUE_DATE_CHANGE);

		// Update the due date
		order.dates.due = dueDate;

		// Generate the record that will update the database
		updateRecord = mongo.formUpdateOneQuery(
		{
			_id: orderId
		},
		{
			dates: order.dates,
			modHistory: order.modHistory
		},
		false);

		try
		{
			await mongo.bulkWrite(ORDERS_COLLECTION, true, updateRecord);

			return true;
		}
		catch(error)
		{
			console.log('Ran into an error updating the due date for order ' + orderId);
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
		let order = await ordersModule.searchOrderById(parseInt(orderModifications._id, 10)),
			amountToBePaid,
			transactionID,
			dataToUpdate,
			rawDueDate,
			updateRecord;

		// Ensure that the order is properly updated with a record indicating when this order was updated
		// and who updated this order
		_applyModificationUpdates(order, username);

		// Properly store any notes that may have been added to this order
		_formNoteRecord(order, orderModifications.notes.internal, username);

		// Convert any modified pricing and other numeric data into a numerical format
		orderModifications.pricing.modification = _parseNumberOrReturnZero(orderModifications.pricing.modification);
		orderModifications.pricing.pricePerFoot = _parseNumberOrReturnZero(orderModifications.pricing.pricePerFoot);
		orderModifications.pricing.additionalPrice = _parseNumberOrReturnZero(orderModifications.pricing.additionalPrice);
		orderModifications.pricing.deductions = _parseNumberOrReturnZero(orderModifications.pricing.deductions);

		// Recalculate the total price of the order
		orderModifications.pricing.subtotal = pricingCalculator.calculateOrderTotal(orderModifications);
		orderModifications.pricing.tax = pricingCalculator.calculateTax(orderModifications.pricing.subtotal, orderModifications);
		orderModifications.pricing.tariff = pricingCalculator.calculateTariffs(order.pricing.subtotal, orderModifications);
		orderModifications.pricing.orderTotal = pricingCalculator.calculateTotal(orderModifications);

		// If the order is still pending finalization, reset the balance remaining
		if (order.status === STATUS.PENDING)
		{
			orderModifications.pricing.balanceRemaining = orderModifications.pricing.orderTotal;
			orderModifications.pricing.taxRemaining = orderModifications.pricing.tax;
		}
		else
		{
			orderModifications.pricing.balanceRemaining = order.pricing.balanceRemaining;
			orderModifications.pricing.taxRemaining = order.pricing.taxRemaining;
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
			if (orderModifications.status === STATUS.CLOSED)
			{
				// Generate credit card transactions necessary to satisfy any changes that may have been made to the order
				// price only after the order has been closed
				if ( !(order.pricing.paidByCheck) && !(orderModifications.pricing.restByCheck) )
				{
					// Calculate the balance remaining to be paid
					amountToBePaid = order.pricing.balanceRemaining + orderModifications.pricing.modification + pricingCalculator.calculateTax(orderModifications.pricing.modification, orderModifications);

					if (amountToBePaid > 0)
					{
						// Charge the customer if the order total has been increased
						transactionID = await creditCardProcessor.chargeTotal(amountToBePaid, order.stripe.customer, order._id, orderModifications.customer.email);
						order.stripe.charges.push(transactionID);
					}
					else if (amountToBePaid < 0)
					{
						// Refund money back to the customer if the order total has been lessened
						await creditCardProcessor.refundMoney(Math.abs(amountToBePaid), order.stripe.charges, order._id);
					}
				}

				// If the order is closed, we assume that any balance has been paid off.
				order.pricing.balanceRemaining = 0;
				order.pricing.taxRemaining = 0;
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
			'pricing.subtotal': orderModifications.pricing.subtotal,
			'pricing.isTaxApplied': orderModifications.pricing.isTaxApplied,
			'pricing.isTariffApplied': orderModifications.pricing.isTariffApplied,
			'pricing.orderTotal': orderModifications.pricing.orderTotal,
			'pricing.tax': orderModifications.pricing.tax,
			'pricing.tariff': orderModifications.pricing.tariff,
			'pricing.taxRemaining': order.pricing.taxRemaining || 0,
			'pricing.balanceRemaining': orderModifications.pricing.balanceRemaining,

			'design.post': orderModifications.design.post,
			'design.handrailing': orderModifications.design.handrailing,
			'design.picket': orderModifications.design.picket,
			'design.postEnd': orderModifications.design.postEnd,
			'design.postCap': orderModifications.design.postCap,
			'design.center': orderModifications.design.center,
			'design.color': orderModifications.design.color,

			'installation.coverPlates': orderModifications.installation.coverPlates,
			'installation.platformType': orderModifications.installation.platformType,

			'notes.internal': order.notes.internal,
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
		if (order.status === STATUS.PENDING)
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
		let order = await ordersModule.searchOrderById(parseInt(orderID, 10)),
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
		let order = await ordersModule.searchOrderById(parseInt(orderID, 10)),
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
		let order = await ordersModule.searchOrderById(parseInt(orderID, 10));

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
	},

	/**
	 * Function responsible for restoring an order that was removed from the system
	 *
	 * @param {Number} orderID - the ID of the order being restored
	 * @param {String} [username] - the name of the admin making the changes
	 *
	 * @returns {Boolean} - a simple flag indicating whether the order was successfully removed
	 *
	 * @author kinsho
	 */
	restoreRemovedOrder: async function (orderID, username)
	{
		let order = await ordersModule.searchRemovedOrderById(parseInt(orderID, 10));

		// Ensure that the order is properly updated with a record indicating when this order was updated
		// and who updated this order
		_applyModificationUpdates(order, username || UNKNOWN_USER_NAME);

		try
		{
			// Add the order to remove from a collection specifically meant to house these removed orders
			await mongo.bulkWrite(ORDERS_COLLECTION, true, mongo.formInsertSingleQuery(order));

			// Remove the order from the main orders collection
			await mongo.bulkWrite(REMOVED_ORDERS_COLLECTION, true, mongo.formDeleteOneQuery({ _id : order._id }));

			return true;
		}
		catch(error)
		{
			console.log('Ran into an error restoring order ' + order._id);
			console.log(error);

			throw error;
		}
	}
};

// ----------------- EXPORT MODULE --------------------------

module.exports = ordersModule;