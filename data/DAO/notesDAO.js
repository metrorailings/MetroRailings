// ----------------- EXTERNAL MODULES --------------------------

const mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver'),

	orderDAO = global.OwlStakes.require('data/DAO/ordersDAO');

// ----------------- ENUMS/CONSTANTS --------------------------

const ORDERS_COLLECTION = 'orders',
	COUNTERS_COLLECTION = 'counters',
	NOTES_COLLECTION = 'notes',

	TYPES =
	{
		NOTE : 'note',
		TASK : 'task'
	},

	STATUSES =
	{
		OPEN : 'open',
		CLOSED : 'closed'
	};

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function to load a new task into our system
	 *
	 * @param {Object} noteData - the task and all its metadata
	 * @param {String} username - the user name
	 *
	 * @return {Object} - the task data studded with additional information
	 *
	 * @author kinsho
	 */
	addNewNote: async function (note, username)
	{
		let order,
			counterRecord;

		try
		{
			order = await orderDAO.searchOrderById(parseInt(note.orderId, 10));
			counterRecord = await mongo.readThenModify(COUNTERS_COLLECTION, 
			{
				$inc: { seq : 1 }
			}, 
			{
				_id: NOTES_COLLECTION
			});

			// Attach a new ID to this note
			note._id = counterRecord.seq;

			// Record the date when this order was created
			note.dates = { created : new Date() };

			// Record the author of this note
			note.author = username;

			// Convert the orer ID to a primitive number
			note.orderId = parseInt(note.orderId, 10);

			// If the note is a task, initialize the note
			if (note.type === TYPES.TASK)
			{
				note.status = STATUSES.OPEN;
			}

			// Add the note to our notes collection
			await mongo.bulkWrite(NOTES_COLLECTION, true, mongo.formInsertSingleQuery(note));

			// Initialize the notes collection inside the order object if none exists yet
			order.notes = order.notes || [];

			// Add a reference to the new note to the collection of notes
			order.notes.push(note._id);

			// Push the modified order into the database
			await mongo.bulkWrite(ORDERS_COLLECTION, true, mongo.formUpdateOneQuery(
			{
				_id : order._id
			}, order, false));

			return note;
		}
		catch(error)
		{
			console.log('Ran into an error saving a new note into the order...');
			console.log(error);

			return false;
		}
	},

	/**
	 * Function to retrieve all notes that belong to a particular order
	 *
	 * @param {Number} orderId - the ID of the order from which to fetch notes
	 *
	 * @return {Array<Object>} - the collection of notes that belong to that order
	 *
	 * @author kinsho
	 */
	fetchNotesByOrderId: async function (orderId)
	{
		try
		{
			return await mongo.read(NOTES_COLLECTION,
			{
				orderId : orderId
			},
			{
				'dates.created' : -1
			});
		}
		catch(error)
		{
			console.log('Ran into an error fetching all notes that belong to order #' + orderId);
			console.log(error);

			return false;
		}
	}
};