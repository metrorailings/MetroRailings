// ----------------- APP_ROOT_PATH INSTANTIATION --------------------------

global.OwlStakes =
{
	require : require('app-root-path').require
};

// ----------------- EXTERNAL MODULES --------------------------

let mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver'),
	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO'),

	types = global.OwlStakes.require('shared/designs/types');

// ----------------- ENUMS/CONSTANTS --------------------------

const ORDERS_COLLECTION = 'orders',
	NOTES_COLLECTION = 'notes',
	COUNTERS_COLLECTION = 'counters',

	NEW_NOTE_CATEGORY = 'new',
	NOTE_TYPE = 'note',

	MIGRATION_USER = 'migration_bot',

	STATUS_CONVERSION_MAP =
	{
		prospect : 'prospect',
		pending : 'pending',
		queue : 'material',
		production : 'layout',
		finishing : 'painting',
		install : 'install',
		closed : 'closed'
	};

// ----------------- INITIALIZATION --------------------------

// Open up a connection to the database
(async function ()
{
	await mongo.initialize();

	let oldOrders = await ordersDAO.retrieveAllOrders(),
		oldOrder, newOrder,
		databaseParams = [ORDERS_COLLECTION, true],
		defaultDesignType = types.options.pop();

	for (let x = 0; x < oldOrders.length; x += 1)
	{
		oldOrder = oldOrders[x];
		newOrder = {};

		console.log('Converting Order #' + oldOrder._id);

		// Instantiate the first-level properties
		newOrder =
		{
			_id : '',
			customer : {},
			design : {},
			designDescription : {},
			dimensions : {},
			installation : {},
			pricing : {},
			status : '',
			text : {},
			payments : {},

			modHistory : [],
			dates : {},

			notes : [],

			pictures : [],
			drawings : [],
			files : []
		};

		// Transfer the ID
		newOrder._id = oldOrder._id;

		// Transfer the customer data
		newOrder.customer =
		{
			name : oldOrder.customer.name,
			company : '',
			email : oldOrder.customer.email || '',
			areaCode : oldOrder.customer.areaCode,
			phoneOne : oldOrder.customer.phoneOne,
			phoneTwo : oldOrder.customer.phoneTwo,
			address : oldOrder.customer.address,
			aptSuiteNo : oldOrder.customer.aptSuiteNo || '',
			city : oldOrder.customer.city,
			state : oldOrder.customer.state,
			zipCode : oldOrder.customer.zipCode || '',
			nickname : oldOrder.customer.nickname || '',
		};

		// Transfer the dates attached to the old order to one central location inside the new order
		newOrder.dates =
		{
			created : oldOrder.createDate ? new Date(oldOrder.createDate) : new Date(oldOrder.lastModifiedDate),
			lastModified : new Date(oldOrder.lastModifiedDate),
			finalized : oldOrder.finalizationDate ? new Date(oldOrder.finalizationDate) : '',
			due : ''
		};

		// Default the design details for simplicity's sake
		newOrder.design =
		{
			type : defaultDesignType.id
		};
		newOrder.designDescription =
		{
			type : ''
		};

		// Transfer the dimension and installation details over
		newOrder.dimensions =
		{
			length : oldOrder.length || '',
			finishedHeight : oldOrder.finishedHeight || ''
		};
		newOrder.installation =
		{
			platformType : oldOrder.installation ? oldOrder.installation.platformType : '',
			coverPlates : oldOrder.installation ? oldOrder.installation.coverPlates : ''
		};

		// Transfer the modification history as well, leaving the reason fields empty
		newOrder.modHistory = oldOrder.modHistory || [];
		for (let i = newOrder.modHistory.length - 1; i >= 0; i -= 1)
		{
			newOrder.modHistory[i].reason = '';
		}

		// Transfer the pricing/money details
		newOrder.pricing =
		{
			pricePerFoot : oldOrder.pricing ? oldOrder.pricing.pricePerFoot : '',
			additionalPrice : oldOrder.pricing ? oldOrder.pricing.additionalPrice : '',
			isTaxApplied : oldOrder.pricing ? oldOrder.pricing.isTaxApplied : '',
			isTariffApplied : oldOrder.pricing ? oldOrder.pricing.isTariffApplied : '',
			depositAmount : 0, // Default all deposit amounts
			subTotal : oldOrder.pricing ? oldOrder.pricing.subtotal : '',
			tax : oldOrder.pricing ? oldOrder.pricing.tax : '',
			tariff : oldOrder.pricing ? oldOrder.pricing.tariff : '',
			orderTotal : oldOrder.pricing ? oldOrder.pricing.orderTotal : '',
			shopBonus : 0 // Default all shop bonus amounts
		};

		// Default the payments object
		newOrder.payments =
		{
			balanceRemaining : oldOrder.pricing ? oldOrder.pricing.balanceRemaining : '',
			cards : [],
			charges : []
		};

		// Transfer the status over, converting over old nonexistant statuses to new statuses
		newOrder.status = STATUS_CONVERSION_MAP[oldOrder.status] || '';

		// Transfer the agreement and additional descriptive text over to the new order
		newOrder.text =
		{
			agreement : oldOrder.agreement || null,
			additionalDescription : oldOrder.additionalFeatures || ''
		};

		// Transfer the notes over to the notes collection
		newOrder.notes = [];
		if (oldOrder.notes.internal)
		{
			// Sometimes we may have a collection of notes
			if (Array.isArray(oldOrder.notes.internal))
			{
				for (let i = 0; i < oldOrder.notes.internal.length; i += 1)
				{
					let note = oldOrder.notes.internal[i],
						counterRecord = await mongo.readThenModify(COUNTERS_COLLECTION,
						{
							$inc: { seq : 1 }
						},
						{
							_id: NOTES_COLLECTION
						}),
						newNote = {};

					// Load the note with some additional metadata and clarify the existing metadata
					newNote._id = counterRecord.seq;
					newNote.orderId = newOrder._id;
					newNote.dates = { created : new Date(note.date) };
					newNote.author = note.author;
					newNote.category = NEW_NOTE_CATEGORY;
					newNote.type = NOTE_TYPE;
					newNote.text = note.note;

					// Add the note to our notes collection
					await mongo.bulkWrite(NOTES_COLLECTION, true, mongo.formInsertSingleQuery(newNote));

					// Add the ID of the newly-converted note to the order
					newOrder.notes.push(newNote._id);
				}
			}
			// And sometimes we'll have only a string indicating only one note
			else
			{
				let note = oldOrder.notes.internal,
					counterRecord = await mongo.readThenModify(COUNTERS_COLLECTION,
					{
						$inc: { seq : 1 }
					},
					{
						_id: NOTES_COLLECTION
					}),
					newNote = {};


				// Load the note with some additional metadata and clarify the existing metadata
				newNote._id = counterRecord.seq;
				newNote.orderId = newOrder._id;
				newNote.dates = { created : new Date(oldOrder.createDate) };
				newNote.author = MIGRATION_USER;
				newNote.category = NEW_NOTE_CATEGORY;
				newNote.type = NOTE_TYPE;
				newNote.text = note;

				// Add the note to our notes collection
				await mongo.bulkWrite(NOTES_COLLECTION, true, mongo.formInsertSingleQuery(newNote));

				// Add the ID of the newly-converted note to the order
				newOrder.notes.push(newNote._id);
			}
		}

		// If pictures are present on the order, carry them over
		if (oldOrder.pictures && oldOrder.pictures.length)
		{
			newOrder.pictures = [];
			for (let i = 0; i < oldOrder.pictures.length; i += 1)
			{
				let picture = oldOrder.pictures[i];

				// Instantiate additional metadata here so that the pictures render properly in the new admin system
				picture.thumbnail = picture.shareLink;
				picture.isImage = true;
				picture.shortname = picture.name.split('-').pop().trim();

				// Add the picture to the new order
				newOrder.pictures.push(picture);
			}
		}

		// Set a flag to indicate that this is an old order that was migrated
		newOrder.migrated = true;

		// Wrap the order in a database object and prepare it for inclusion in the database
		newOrder = mongo.formInsertSingleQuery(newOrder);
		databaseParams.push(newOrder);
	}

	// Delete all the old orders from the database
	for (let y = 0; y < oldOrders.length; y += 1)
	{
		await mongo.bulkWrite(ORDERS_COLLECTION, true, mongo.formDeleteOneQuery({ _id : oldOrders[y]._id } ));
	}

	// Send all these orders to the database
	await mongo.bulkWrite.apply(mongo, databaseParams);

	// Close out this program
	console.log('Done!');
	process.exit();
})();