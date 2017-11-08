// ----------------- EXTERNAL MODULES --------------------------

var mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver'),

	creditCardProcessor = global.OwlStakes.require('utility/creditCardProcessor'),
	rQuery = global.OwlStakes.require('utility/rQuery'),

	pricingCalculator = global.OwlStakes.require('shared/pricing/pricingCalculator');

// ----------------- ENUMS/CONSTANTS --------------------------

var COUNTERS_COLLECTION = 'counters',
	ESTIMATES_COLLECTION = 'estimates';

// ----------------- MODULE DEFINITION --------------------------

var estimatesModule =
{
	/**
	 * Function responsible for saving a new estimate into the database
	 *
	 * @param {Object} estimateData - a collection of data necessary to service an estimate
	 * @param {Number} distance - the number of miles we would need to travel in order to conduct the estimate
	 *
	 * @returns {Object} - the estimate and all its associated data, completely processed
	 *
	 * @author kinsho
	 */
	saveNewEstimate: async function (estimate, distance)
	{
		var transactionID,
			counterRecord = await mongo.readThenModify(COUNTERS_COLLECTION,
			{
				$inc: { seq: 1 }
			},
			{
				_id: ESTIMATES_COLLECTION
			});

		// Attach a new ID to the estimate
		estimate._id = counterRecord.seq;

		// Before saving the order into the database, set some system-default values into the order
		estimate.createDate = new Date();

		// Calculate the amount to charge the customer
		estimate.totalPrice = pricingCalculator.calculateEstimateTotal(distance);
		estimate.totalPrice = estimate.totalPrice.toFixed(2);

		// Generate a payment record for the order
		estimate.stripe =
		{
			customer: await creditCardProcessor.generateCustomerRecord(estimate.ccToken, estimate.customer.name, estimate.customer.email),
			charges: []
		};

		// Charge the customer prior to saving the order. After charging the customer, store the transaction ID
		// inside the order itself
		transactionID = await creditCardProcessor.chargeTotal(estimate.totalPrice, estimate.stripe.customer, estimate._id, estimate.customer.email);
		estimate.stripe.charges.push(transactionID);

		// Figure out how we'll be referencing the customer
		estimate.customer.nickname = (estimate.customer.name.split(' ').length > 1 ? rQuery.capitalize(estimate.customer.name.split(' ')[0]) : estimate.customer.name);

		// Now save the order
		try
		{
			await mongo.bulkWrite(ESTIMATES_COLLECTION, true, mongo.formInsertSingleQuery(estimate));

			return estimate;
		}
		catch(error)
		{
			console.log('Ran into an error saving a new estimate!');
			console.log(error);

			throw error;
		}
	},

};

// ----------------- EXPORT MODULE --------------------------

module.exports = estimatesModule;