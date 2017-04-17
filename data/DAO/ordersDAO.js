// ----------------- EXTERNAL MODULES --------------------------

var mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver'),

	creditCardProcessor = global.OwlStakes.require('utility/creditCardProcessor'),

	pricingStructure = global.OwlStakes.require('shared/pricingStructure'),
	statuses = global.OwlStakes.require('shared/orderStatus');

// ----------------- ENUMS/CONSTANTS --------------------------

var ORDERS_COLLECTION = 'orders',
	COUNTERS_COLLECTION = 'counters',

	SYSTEM_USER_NAME = 'system',
	OPEN_STATUS = 'open';

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
				console.log('Ran into an error fetching an existing order for the order details page!');
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
		 * Function responsible for saving a new order into the database
		 *
		 * @param {Object} order - a new customer order to save into our system
		 *
		 * @returns {Object} - the order, completely processed now that it has been stored in the database
		 *
		 * @author kinsho
		 */
		saveNewOrder: async function (order)
		{
			var transactionID,
				counterRecord = await mongo.readThenModify(COUNTERS_COLLECTION,
					{
						$inc: { seq: 1 }
					},
					{
						_id: ORDERS_COLLECTION
					});

			// Before saving the order into the database, set some system-default values into the order
			order.notes = '';
			order.status = OPEN_STATUS;
			order.createDate = new Date();

			// Apply and initialize properties to indicate when this order was last modified
			_applyModificationUpdates(order, SYSTEM_USER_NAME);

			// Attach a new ID to the order
			order._id = counterRecord.seq;

			// Calculate the amount to charge the customer
			order.orderTotal = pricingStructure.calculateOrderTotal(order.length);

			// Generate a payment record for the order
			order.stripe =
			{
				customer: await creditCardProcessor.generateCustomerRecord(order.ccToken, order.customer.name, order.customer.email),
				charges: []
			};

			// Charge the customer prior to saving the order. After charging the customer, store the transaction ID
			// inside the order itself
			transactionID = await creditCardProcessor.chargeTotal(order.orderTotal, order.stripe.customer, order._id);
			order.stripe.charges.push(transactionID);

			// Figure out how we'll be referencing the customer
			order.customer.nickname = (order.customer.name.split(' ').length > 1 ? order.customer.name.split(' ')[0] : order.customer.name);

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
		 * Function resposible for saving changes made to an order and also generating transactions to either charge the
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
				amountToTransact = order.orderTotal - parseFloat(orderModifications.orderTotal),
				transactionID,
				updateRecord;

			// Ensure that the order is properly updated with a record indicating when this order was updated
			// and who updated this order
			_applyModificationUpdates(order, username);

			try
			{
				// Generate transactions necessary to satisfy any changes that may have been made to the order price
				if (amountToTransact > 0)
				{
					// Charge the customer if the order total has been increased
					transactionID = await creditCardProcessor.chargeTotal(amountToTransact, order.stripe.customer, order._id);
					order.stripe.charges.push(transactionID);
				}
				else if (amountToTransact < 0)
				{
					// Refund money back to the customer if the order total has been lessened
					await creditCardProcessor.refundMoney(Math.abs(amountToTransact), order.stripe.charges, order._id);
				}
			}
			catch(error)
			{
				console.log('Ran into an error trying to transact some money...');
				console.log(error);

				throw error;
			}

			// Now generate a record of data we will be using to update the database
			updateRecord = mongo.formUpdateOneQuery(
				{
					_id: order._id
				},
				{
					status: orderModifications.status,
					notes: orderModifications.notes,
					type: orderModifications.type,
					style: orderModifications.style,
					color: orderModifications.color,
					length: orderModifications.length,
					orderTotal: parseFloat(orderModifications.orderTotal),
					stripe: order.stripe,
					lastModifiedDate: order.lastModifiedDate,
					modHistory: order.modHistory,
					'customer.areaCode': orderModifications.customer.areaCode,
					'customer.phoneOne': orderModifications.customer.phoneOne,
					'customer.phoneTwo': orderModifications.customer.phoneTwo,
					'customer.email': orderModifications.customer.email,
					'customer.address': orderModifications.customer.address,
					'customer.aptSuiteNo': orderModifications.customer.aptSuiteNo,
					'customer.city': orderModifications.customer.city,
					'customer.state': orderModifications.customer.state,
					'customer.zipCode': orderModifications.customer.zipCode
				},
			false);

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
		 * Function responsible for saving image metadata to an order record
		 *
		 * @param {String} orderID - the ID of the order being modified
		 * @param {Object} meta - the metadata of the newly uploaded image
		 * @param {String} username - the name of the admin making the changes
		 *
		 * @returns {Boolean} - a simple flag indicating whether changes to the order were successfully saved
		 *
		 * @author kinsho
		 */
		saveNewPicToOrder: async function (orderID, imgMeta, username)
		{
			var order = await ordersModule.searchOrderById(parseInt(orderID, 10)),
				updateRecord;

			// Ensure that the order is properly updated with a record indicating when this order was updated
			// and who updated this order
			_applyModificationUpdates(order, username);

			// If no image uploads have been associated with this order, instantiate a new collection
			order.pictures = order.pictures || [];

			// Push the new image metadata into the order record
			order.pictures.push(imgMeta);

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
		}
	};

// ----------------- EXPORT MODULE --------------------------

module.exports = ordersModule;