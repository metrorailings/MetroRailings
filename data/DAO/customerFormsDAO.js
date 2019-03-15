// ----------------- EXTERNAL MODULES --------------------------

const mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver');

// ----------------- ENUMS/CONSTANTS --------------------------

const CUSTOMER_FORM_COLLECTION = 'customerForms',
	COUNTERS_COLLECTION = 'counters';

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function responsible for storing a new form into the database
	 *
	 * @param {Object} data - the data to push into the database
	 *
	 * @returns {Object} - the newly registered customer form, now with a database ID
	 *
	 * @author kinsho
	 */
	insertNewForm: async function (data)
	{
		try
		{
			let counterRecord = await mongo.readThenModify(COUNTERS_COLLECTION,
				{
					$inc: { seq: 1 }
				},
				{
					_id: CUSTOMER_FORM_COLLECTION
				});

			// Append a custom ID
			data._id = counterRecord.seq;

			// Format the due date properly, if there is one
			if (data.dueDate)
			{
				data.dueDate = new Date(data.dueDate);
			}

			// Insert a new contact request into the database
			await mongo.bulkWrite(CUSTOMER_FORM_COLLECTION, true, mongo.formInsertSingleQuery(data));

			return data;
		}
		catch(error)
		{
			console.log('Ran into an error when trying to store a new customer form!');
			console.log(error);

			return false;
		}
	},

	/**
	 * Function responsible for retrieving form data
	 *
	 * @param {Number} id - the ID of the dataset to fetch
	 *
	 * @returns {Object} - the form data being sought after
	 *
	 * @author kinsho
	 */
	getFormData: async function (id)
	{
		try
		{
			let formData = await mongo.read(CUSTOMER_FORM_COLLECTION,
			{
				_id : id
			});

			return formData[0];
		}
		catch(error)
		{
			console.log('Ran into an error retrieving customer data...');
			console.log(error);

			return false;
		}
	}
};