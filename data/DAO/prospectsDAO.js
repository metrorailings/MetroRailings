// ----------------- EXTERNAL MODULES --------------------------

var mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver'),

	rQuery = global.OwlStakes.require('utility/rQuery'),

	pricingCalculator = global.OwlStakes.require('shared/pricing/pricingCalculator');

// ----------------- ENUMS/CONSTANTS --------------------------

var ORDERS_COLLECTION = 'orders',
	COUNTERS_COLLECTION = 'counters',

	UNKNOWN_AUTHOR = 'Unknown',

	PROSPECT_STATUS = 'prospect',
	PENDING_STATUS = 'pending';

// ----------------- PRIVATE FUNCTIONS --------------------------

/**
 * Function responsible for creating a modification record to record who modified an order and at what time he
 * modified the order
 *
 * @param {Object} prospect - the prospect
 * @param {String} username - the name of the user modifying the order
 *
 * @author kinsho
 */
function _applyModificationUpdates(prospect, username)
{
	var modificationDate = new Date();

	prospect.lastModifiedDate = modificationDate;
	prospect.modHistory = prospect.modHistory || [];
	prospect.modHistory.unshift(
	{
		user: username,
		date: modificationDate
	});
}

/**
 * Function responsible for storing a note in a special format that would allow us to track all the notes that were
 * written on this prospect
 *
 * @param {Object} prospect - the prospect
 * @param {String} note - the note
 * @param {String} username - the name of the user writing the note
 *
 * @author kinsho
 */
function _formNoteRecord(prospect, note, username)
{
	prospect.notes.internal = prospect.notes.internal || [];

	// If we are dealing with old orders here, we need to convert the old notes so that they remain accessible
	// through the new format
	if (typeof prospect.notes.internal === 'string')
	{
		prospect.notes.internal =
		[{
			note: prospect.notes.internal,
			author: UNKNOWN_AUTHOR,
			date: prospect.lastModifiedDate
		}];
	}

	if (note && note.trim())
	{
		prospect.notes.internal.unshift(
		{
			note: note,
			author: username,
			date: new Date()
		});
	}
}

// ----------------- MODULE DEFINITION --------------------------

var prospectsModule =
{
	PROSPECT_SETUP_CODES:
	{
		SET_UP_BY_ADMIN: 'admin'
	},

	/**
	 * Function responsible for retrieving an existing prospect from the database using its ID
	 *
	 * @param {Object} idNumber - the prospect identification number
	 *
	 * @returns {Object} - the prospect itself, in its entirety
	 *
	 * @author kinsho
	 */
	searchProspectById: async function (id)
	{
		try
		{
			var dbResults = await mongo.read(ORDERS_COLLECTION,
				{
					_id: id
				});

			return dbResults[0];
		}
		catch(error)
		{
			console.log('Ran into an error fetching an existing prospect using its ID...');
			console.log(error);

			return false;
		}
	},

	/**
	 * Function responsible for registering a new prospect into the database
	 *
	 * @param {Object} order - a new prospect to save into our system
	 * @param {Object} username - the admin registering this prospect
	 * @param {String} prospectCreationMethod - an enumerated string indicating how this prospect came to be
	 * 		recorded into the system
	 *
	 * @author kinsho
	 */
	setUpNewProspect: async function (prospect, username, prospectCreationMethod)
	{
		var counterRecord = await mongo.readThenModify(COUNTERS_COLLECTION,
			{
				$inc: { seq: 1 }
			},
			{
				_id: ORDERS_COLLECTION
			}),
			initialNote = prospect.notes.internal;

		prospect.status = PROSPECT_STATUS;

		// Apply and initialize properties to indicate when this prospect was last modified
		_applyModificationUpdates(prospect, username);

		// Attach a new ID to this prospect
		prospect._id = counterRecord.seq;

		// Format any notes written on this prospect
		prospect.notes.internal = ''; // For sanity's sake, wipe out any notes that may have been stored in the prospect object
		_formNoteRecord(prospect, initialNote, username);

		// Attach other metadata showing exactly how this prospect came to be
		prospect.conception =
		{
			userType: prospectCreationMethod,
			user: (prospectCreationMethod === this.PROSPECT_SETUP_CODES.SET_UP_BY_ADMIN ? username : prospect.customer.name)
		};

		// Now save the order
		try
		{
			await mongo.bulkWrite(ORDERS_COLLECTION, true, mongo.formInsertSingleQuery(prospect));
		}
		catch(error)
		{
			console.log('Ran into an error saving a new prospect!');
			console.log(error);

			throw error;
		}
	},

	/**
	 * Function responsible for saving changes made to a prospect
	 *
	 * @param {Object} prospectModifications - the prospect that houses the modified data
	 * @param {String} username - the name of the admin making the changes
	 *
	 * @returns {boolean} - a simple flag indicating that the prospect was successfully modified
	 *
	 * @author kinsho
	 */
	saveChangesToProspect: async function (prospectModifications, username)
	{
		var originalProspect = await prospectsModule.searchProspectById(parseInt(prospectModifications._id, 10)),
			dataToUpdate,
			updateRecord;

		// Ensure that the prospect is properly updated with a record indicating when this prospect was updated
		// and who updated this prospect
		_applyModificationUpdates(originalProspect, username);

		// Properly store any notes that may have been added to this prospect
		_formNoteRecord(originalProspect, prospectModifications.notes.internal, username);

		// Gather the data that we will need to put into the database
		dataToUpdate =
		{
			lastModifiedDate: originalProspect.lastModifiedDate,
			modHistory: originalProspect.modHistory,

			'customer.areaCode': prospectModifications.customer.areaCode,
			'customer.phoneOne': prospectModifications.customer.phoneOne,
			'customer.phoneTwo': prospectModifications.customer.phoneTwo,
			'customer.email': prospectModifications.customer.email,
			'customer.address': prospectModifications.customer.address,
			'customer.aptSuiteNo': prospectModifications.customer.aptSuiteNo,
			'customer.city': prospectModifications.customer.city,
			'customer.state': prospectModifications.customer.state,
			'customer.zipCode': prospectModifications.customer.zipCode,

			'notes.internal': originalProspect.notes.internal
		};

		// Now generate a record of data we will be using to update the database
		updateRecord = mongo.formUpdateOneQuery(
		{
			_id: originalProspect._id
		}, dataToUpdate, false);

		try
		{
			await mongo.bulkWrite(ORDERS_COLLECTION, true, updateRecord);

			return true;
		}
		catch(error)
		{
			console.log('Ran into an error updating prospect ' + originalProspect._id);
			console.log(error);

			throw error;
		}
	},

	/**
	 * Function responsible for saving images to a prospect record
	 *
	 * @param {String} orderID - the ID of the prospect being modified
	 * @param {Object} meta - the metadata of the newly uploaded image(s)
	 * @param {String} username - the name of the admin making the changes
	 *
	 * @returns {boolean} - a simple flag indicating whether changes to the order were successfully saved
	 *
	 * @author kinsho
	 */
	saveNewPicToProspect: async function (prospectID, images, username)
	{
		var prospect = await prospectsModule.searchProspectById(parseInt(prospectID, 10)),
			updateRecord;

		// Ensure that the order is properly updated with a record indicating when this order was updated
		// and who updated this order
		_applyModificationUpdates(prospect, username);

		// If no image uploads have been associated with this order, instantiate a new collection
		prospect.pictures = prospect.pictures || [];

		// Push the new image metadata into the order record
		prospect.pictures.push(...images);

		// Generate a record to push into the database
		updateRecord = mongo.formUpdateOneQuery(
		{
			_id: prospect._id
		},
		{
			pictures: prospect.pictures
		},
		false);

		try
		{
			await mongo.bulkWrite(ORDERS_COLLECTION, true, updateRecord);

			return true;
		}
		catch(error)
		{
			console.log('Ran into an error updating prospect ' + prospect._id);
			console.log(error);

			throw error;
		}
	},

	/**
	 * Function responsible for deleting image metadata from a prospect record
	 *
	 * @param {String} prospectID - the ID of the prospect being modified
	 * @param {Object} meta - the metadata of the image being deleted
	 * @param {String} username - the name of the admin making the changes
	 *
	 * @returns {Boolean} - a simple flag indicating whether changes to the prospect were successfully saved
	 *
	 * @author kinsho
	 */
	deletePicFromOrder: async function (prospectID, imgMeta, username)
	{
		var prospect = await prospectsModule.searchProspectById(parseInt(prospectID, 10)),
			updateRecord,
			i;

		// Ensure that the prospect is properly updated with a record indicating when this order was updated
		// and who updated this order
		_applyModificationUpdates(prospect, username);

		// Find the index of the image to remove from the metadata collection
		for (i = prospect.pictures.length - 1; i >= 0; i--)
		{
			if (prospect.pictures[i].id === imgMeta.id)
			{
				break;
			}
		}

		// Splice out that image metadata
		prospect.pictures.splice(i, 1);

		// Generate a record to push the changes into the database
		updateRecord = mongo.formUpdateOneQuery(
		{
			_id: prospect._id
		},
		{
			pictures: prospect.pictures
		},
		false);

		try
		{
			await mongo.bulkWrite(ORDERS_COLLECTION, true, updateRecord);

			return true;
		}
		catch(error)
		{
			console.log('Ran into an error updating prospect ' + prospect._id);
			console.log(error);

			throw error;
		}
	},

	/**
	 * Function responsible for converting an existing prospect into an order
	 *
	 * @param {String} prospectID - the ID of the prospect being converted into an order
	 * @param {Object} orderDetails - the various details of the order that's not already present in the prospect record
	 * @param {String} username - the name of the admin making the changes
	 *
	 * @returns {Object} - the order, now in pending status
	 *
	 * @author kinsho
	 */
	convertToOrder: async function (prospectID, order, username)
	{
		var prospect = await prospectsModule.searchProspectById(prospectID),
			updateRecord;

		// Set the ID of the prospect into the order
		order._id = parseInt(prospectID, 10);

		// Set the status
		order.status = PENDING_STATUS;

		// Set the creation date of the order
		order.createDate = new Date();

		// Copy over the modification history from the prospect to the order
		order.lastModifiedDate = prospect.lastModifiedDate;
		order.modHistory = prospect.modHistory;
		_applyModificationUpdates(order, username);

		// Copy over any image uploads as well
		order.pictures = prospect.pictures || [];

		// Copy over any internal notes that were written on the prospect
		order.notes.internal = prospect.notes.internal;

		// Figure out how we'll be referencing the customer
		order.customer.nickname = (prospect.customer.name.split(' ').length > 1 ? rQuery.capitalize(prospect.customer.name.split(' ')[0]) : prospect.customer.name);

		// Calculate the amount to charge the customer
		order.pricing.subTotal = pricingCalculator.calculateOrderTotal(order);
		order.pricing.tax = pricingCalculator.calculateTax(order.pricing.subTotal, order);
		order.pricing.tariff = pricingCalculator.calculateTariffs(order.pricing.subTotal, order);
		order.pricing.orderTotal = order.pricing.subTotal + order.pricing.tax + order.pricing.tariff;

		// As the customer has not paid anything yet, the balance remaining should be equal to the order total
		order.pricing.balanceRemaining = order.pricing.orderTotal;

		// Generate a record to push into the database
		updateRecord = mongo.formUpdateOneQuery(
		{
			_id: order._id
		}, order, false);

		// Now save the order
		try
		{
			await mongo.bulkWrite(ORDERS_COLLECTION, true, updateRecord);

			return prospect;
		}
		catch(error)
		{
			console.log('Ran into an error saving a new order!');
			console.log(error);

			throw error;
		}
	}

};

// ----------------- EXPORT MODULE --------------------------

module.exports = prospectsModule;