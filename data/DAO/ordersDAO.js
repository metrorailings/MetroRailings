// ----------------- EXTERNAL MODULES --------------------------

const mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver'),

	rQuery = global.OwlStakes.require('utility/rQuery'),

	pricingCalculator = global.OwlStakes.require('shared/pricing/pricingCalculator'),
	statuses = global.OwlStakes.require('shared/orderStatus');

// ----------------- ENUMS/CONSTANTS --------------------------

const ORDERS_COLLECTION = 'orders',
	COUNTERS_COLLECTION = 'counters',
	REMOVED_ORDERS_COLLECTION = 'removedOrders',

	SYSTEM_USER_NAME = 'system',

	MODIFICATION_REASONS =
	{
		PROSPECT_CREATION: 'Prospect Created',
		PROSPECT_UPDATE: 'Prospect Updated',
		QUOTE_CREATION: 'Quote Created',
		ORDER_UPDATE: 'Quote Updated',
		FINALIZE_ORDER: 'Order Finalized',
		PAYMENT: 'Payment',
		DUE_DATE_CHANGE: 'Due Date Change',
		NEW_FILE_SAVED: 'New File Uploaded',
		FILE_DELETED: 'File Deleted',
		SHOP_STATUS_CHANGED: 'Production Status Updated',
		ORDER_CANCELLED: 'Order Cancelled'
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

// ----------------- MODULE DEFINITION --------------------------

let ordersModule =
{
	/**
	 * Function that will return all orders in our database, period
	 *
	 * @returns {Array<Object>} - a collection of every single order from our database
	 *
	 * @author kinsho
	 */
	retrieveAllOrders: async function()
	{
		try
		{
			let dbResults = await mongo.read(ORDERS_COLLECTION, {});

			return dbResults;
		}
		catch(error)
		{
			console.log('Ran into an error fetching all orders...');
			console.log(error);

			return false;
		}
	},

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
			orderNumber = parseInt(orderNumber, 10) || 0;

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
			let dbResults = await mongo.read(ORDERS_COLLECTION, 
				mongo.orOperator('status', statuses.listAllOpenStatuses()), { 'dates.due': 1 });

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
	 * @param {String} username - the user saving or modifying this prospect
	 *
	 * @author kinsho
	 */
	saveProspect: async function (prospect, username)
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
			orderId = counterRecord.seq;

			// Update the modification data on this prospect with a reason saying that we're creating a prospect
			_applyModificationUpdates(prospect, username, MODIFICATION_REASONS.PROSPECT_CREATION);
		}
		else
		{
			// Update the modification data on this prospect with a reason saying that we're updating the prospect
			_applyModificationUpdates(prospect, username, MODIFICATION_REASONS.PROSPECT_UPDATE);
		}

		// Attach a new ID to the order
		prospect._id = parseInt(orderId, 10);

		// Mark this order as a prospect
		prospect.status = statuses.ALL.PROSPECT;

		// Generate a record to upsert all this order information into our database
		databaseRecord = mongo.formUpdateOneQuery(
		{
			_id: prospect._id
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
		// Make sure to format the order ID so that we can properly set the database
		else
		{
			order._id = parseInt(order._id, 10);
		}

		// Set the status
		order.status = statuses.ALL.PENDING;

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

		// Properly format the deposit amount
		order.pricing.depositAmount = parseFloat(order.pricing.depositAmount);

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
	 * Function responsible for adding a live credit card to an order so that we could charge credit cards
	 * repeatedly if necessary
	 *
	 * @param {Number} orderId - the ID of the order which will store the token
	 * @param {Object} card - the card to store into the order
	 * @param {Object} customer - the Stripe customer record to log into the order
	 *
	 * @author kinsho
	 */
	addCardToOrder: async function (orderId, card, customer)
	{
		let order = await ordersModule.searchOrderById(parseInt(orderId, 10)),
			updateRecord;

		// Set up the credit card tokens collection if it hasn't been done so yet
		order.payments.cards = order.payments.cards || [];
		order.payments.cards.push(card);

		// Set the Stripe customer record inside the order as well, if it hasn't been done yet
		order.payments.customer = order.payments.customer || customer;

		// Now generate a record of data we will be using to update the database
		updateRecord = mongo.formUpdateOneQuery(
		{
			_id: orderId
		}, {
			payments: order.payments
		}, false);

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
	recordCharge: async function (order, username = SYSTEM_USER_NAME, transaction, amount)
	{
		let updateRecord;

		// Store those transaction details inside the order itself so that we can reference the payment for
		// tracking purposes
		order.payments.charges.unshift(transaction);

		// Adjust the balance remaining to reflect what has been paid off
		order.payments.balanceRemaining -= amount;

		// Record the modifications being made to this order
		_applyModificationUpdates(order, username, MODIFICATION_REASONS.PAYMENT);

		// Now generate a record of data we will be using to update the database
		updateRecord = mongo.formUpdateOneQuery(
		{
			_id: order._id
		},
		{
			payments: order.payments,
			dates: order.dates,
			modHistory: order.modHistory
		}, false);

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
			updateRecord;

		// Merge any order detail changes from the invoice page over into our database record
		order = rQuery.mergeObjects(approvedOrder, order);

		// Record that this order is being modified
		_applyModificationUpdates(order, SYSTEM_USER_NAME, MODIFICATION_REASONS.FINALIZE_ORDER);

		// Note the date that this order was finalized
		order.dates.finalized = new Date();

		// Update the status to indicate that the order is now ready for production and we need to start gathering
		// material
		order.status = statuses.ALL.MATERIAL;

		// Run over this nickname logic again just in case the customer changed his name
		order.customer.nickname = (order.customer.name.split(' ').length > 1 ? rQuery.capitalize(order.customer.name.split(' ')[0]) : order.customer.name);

		// Initialize the collection where we will keep track of all payments made for this order
		order.payments.charges = [];

		// Generate a payment record for the order if the user provided a credit card number
		// And don't forget to charge the customer either!!
		if (order.payments && order.payments.cards && order.payments.cards.length)
		{
			try
			{
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
	 * @param {String} status - the new status to apply to the order
	 * @param {String} [username] - the username of the admin updating this order
	 * @param {Boolean} [isStatusBeingChangedFromShop] - a flag indicating whether this change of status was issued
	 * 		from the shop
	 *
	 * @returns {Object} - the newly revised modification date as well as the new status applied to the order
	 *
	 * @author kinsho
	 */
	updateStatus: async function (orderNumber, status, username = SYSTEM_USER_NAME, isStatusBeingChangedFromShop)
	{
		let order = await ordersModule.searchOrderById(orderNumber),
			updateRecord;

		// Ensure that the order is properly updated with a record indicating when this order was updated
		// and who updated this order
		_applyModificationUpdates(order, username, (isStatusBeingChangedFromShop ? MODIFICATION_REASONS.SHOP_STATUS_CHANGED : ''));

		updateRecord = mongo.formUpdateOneQuery(
		{
			_id: orderNumber
		},
		{
			status: status,
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
	 * Function to store metadata for new files into an existing order
	 *
	 * @param {Number} orderId - the ID of the order
	 * @param {Array<Object>} fileMetas - a collection of metadata for all files that were recently uploaded during
	 * 		this server request
	 * @param {String} username - the name of the user uploading the files	
	 * @param {Function} updateFunc - the actual function to use to update the order properly. This is done in order
	 * 		to separate out the display logic from backend database logic
	 *
	 * @author kinsho
	 */
	saveFilesToOrder: async function (orderId, fileMetas, username, updateFunc)
	{
		let order = await ordersModule.searchOrderById(orderId),
			updateRecord;

		// Ensure that the order is properly updated with a record indicating when this order was updated
		// and who updated this order
		_applyModificationUpdates(order, username, MODIFICATION_REASONS.NEW_FILE_SAVED);

		// Instantiate the collection we'll be using to store the uploaded files, if they haven't been already
		// instantiated
		order.pictures = order.pictures || [];
		order.drawings = order.drawings || [];
		order.files = order.files || [];

		// Run the update function
		// The update function is either updateOrderWithImages, updateOrderWithDrawings, updateOrdersWithFiles
		updateFunc(order, fileMetas);

		// Generate the record we'll be using to update the database
		updateRecord = mongo.formUpdateOneQuery(
		{
			_id: orderId
		},
		{
			pictures: order.pictures,
			drawings: order.drawings,
			files: order.files,
			modHistory: order.modHistory,
			dates: order.dates
		},
		false);

		try
		{
			await mongo.bulkWrite(ORDERS_COLLECTION, true, updateRecord);

			return true;
		}
		catch(error)
		{
			console.log('Ran into an error uploading files for order ' + orderId);
			console.log(error);

			throw error;
		}
	},
	updateOrderWithImages: (order, fileMetas) => { order.pictures.push(...fileMetas); },
	updateOrderWithDrawings: (order, fileMetas) => { order.drawings.push(...fileMetas); },
	updateOrderWithFiles: (order, fileMetas) => { order.files.push(...fileMetas); },

	/**
	 * Function responsible for deleting a file from a particular order
	 *
	 * @param {Number} orderId - the ID of the order from which to remove a file
	 * @param {String} filename - the name of the file to remove from the order
	 *
	 * @returns {Object} - the metadata for the newly-removed file
	 *
	 * @author kinsho
	 */
	removeFileFromOrder: async function (orderId, filename)
	{
		try
		{
			let order = await ordersModule.searchOrderById(orderId),
				files = [...order.pictures, ...order.drawings, ...order.files],
				updateRecord, metadata,
				i;

			// Find the file to delete
			for (i = 0; i < files.length; i += 1)
			{
				if (files[i].name === filename)
				{
					break;
				}
			}

			// Splice out the file from its collection
			if (i < order.pictures.length)
			{
				metadata = order.pictures.splice(i, 1);
			}
			else if (i < order.pictures.length + order.drawings.length)
			{
				metadata = order.drawings.splice(i - order.pictures.length, 1);
			}
			else
			{
				metadata = order.files.splice(i - order.pictures.length - order.drawings.length, 1);
			}

			// Generate a record to push the changes into the database
			updateRecord = mongo.formUpdateOneQuery(
				{
					_id: order._id
				},
				{
					pictures: order.pictures,
					drawings: order.drawings,
					files: order.files
				},
				false);

			// Update the order within our database
			await mongo.bulkWrite(ORDERS_COLLECTION, true, updateRecord);

			return metadata[0];
		}
		catch(error)
		{
			console.log('Ran into an error deleting a file ' + (filename) + ' for order ' + orderId);
			console.log(error);

			throw error;
		}
	},

	/**
	 * Function responsible for fetching all pictures that belong to a particular order
	 *
	 * @param {Number} orderId - the ID of the order from which to fetch all pictures
	 *
	 * @returns {Array<Object>} - a collection of metadata structs that represent all images that belong to an order
	 *
	 * @author kinsho
	 */
	fetchAllPictures: async function (orderId)
	{
		try
		{
			let order = await this.searchOrderById(orderId);

			return order.pictures;
		}
		catch(error)
		{
			console.log('Ran into an error fetching pictures from an order...');
			console.log(error);

			return false;
		}
	},

	/**
	 * Function responsible for fetching all drawings that belong to a particular order
	 *
	 * @param {Number} orderId - the ID of the order from which to fetch all drawings
	 *
	 * @returns {Array<Object>} - a collection of metadata structs that represent all drawings that belong to an order
	 *
	 * @author kinsho
	 */
	fetchAllDrawings: async function (orderId)
	{
		try
		{
			let order = await this.searchOrderById(orderId);

			return order.drawings;
		}
		catch(error)
		{
			console.log('Ran into an error fetching drawings from an order...');
			console.log(error);

			return false;
		}
	},

	/**
	 * Function responsible for fetching all miscellaneous files that belong to a particular order
	 *
	 * @param {Number} orderId - the ID of the order from which to fetch all files
	 *
	 * @returns {Array<Object>} - a collection of metadata structs that represent all miscellaneous files that belong
	 * 		to an order
	 *
	 * @author kinsho
	 */
	fetchAllFiles: async function (orderId)
	{
		try
		{
			let order = await this.searchOrderById(orderId);

			return order.files;
		}
		catch(error)
		{
			console.log('Ran into an error fetching files from an order...');
			console.log(error);

			return false;
		}
	},

	/**
	 * Function responsible for saving changes made to an order and also generating transactions to either charge the
	 * customer or refund money back to him/her
	 *
	 * @param {Object} orderModifications - the order that contains the modified data
	 * @param {String} [username] - the name of the admin making the changes
	 *
	 * @returns {Boolean} - a simple flag indicating that the order was successfully saved
	 *
	 * @author kinsho
	 */
	saveChangesToOrder: async function (orderModifications, username = SYSTEM_USER_NAME)
	{
		let order = await ordersModule.searchOrderById(parseInt(orderModifications._id, 10)),
			updateRecord;

		// Format the ID of the change object here to make sure the database understands that we are not changing
		// the ID parameter
		orderModifications._id = parseInt(orderModifications._id, 10);

		// Ensure that the order is properly updated with a record indicating when this order was updated
		// and who updated this order
		// @TODO Indicate exactly what was updated in this order at a later date
		_applyModificationUpdates(order, username, MODIFICATION_REASONS.ORDER_UPDATE);
		orderModifications.dates = order.dates;
		orderModifications.modHistory = order.modHistory;

		// See if the nickname needs to be updated
		orderModifications.customer.nickname = (orderModifications.customer.name.split(' ').length > 1 ? rQuery.capitalize(orderModifications.customer.name.split(' ')[0]) : orderModifications.customer.name);

		// If the status of an order has been provided, update all pricing data to account for any changes
		if (orderModifications.status)
		{
			// Recalculate the total price of the order if the order is still pending to account for any pricing changes
			orderModifications.pricing.subtotal = pricingCalculator.calculateSubtotal(orderModifications);
			orderModifications.pricing.tax = pricingCalculator.calculateTax(orderModifications.pricing.subtotal, orderModifications);
			orderModifications.pricing.tariff = pricingCalculator.calculateTariffs(orderModifications.pricing.subtotal, orderModifications);
			orderModifications.pricing.orderTotal = pricingCalculator.calculateTotal(orderModifications);
			orderModifications.pricing.depositAmount = parseFloat(orderModifications.pricing.depositAmount);

			// Copy over the payments object from the original order, as the client does not send over any data
			// regarding payments
			orderModifications.payments = order.payments;
			orderModifications.payments.balanceRemaining = orderModifications.pricing.orderTotal;
		}

		// Now generate a record of data we will be using to update the database
		updateRecord = mongo.formUpdateOneQuery(
		{
			_id: orderModifications._id
		}, orderModifications, false);

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
		_applyModificationUpdates(order, username, MODIFICATION_REASONS.ORDER_CANCELLED);

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
	/**
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
	 */
};

// ----------------- EXPORT MODULE --------------------------

module.exports = ordersModule;