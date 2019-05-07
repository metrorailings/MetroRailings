// ----------------- EXTERNAL MODULES --------------------------

const mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver'),

	pricingData = global.OwlStakes.require('shared/pricing/pricingData');

// ----------------- ENUMS/CONSTANTS --------------------------

const COUNTERS_COLLECTION = 'counters',
	PAYMENTS_COLLECTION = 'payments';

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function to store a new payment into the payments table
	 *
	 * @param {Number} amount - the amount that was paid
	 * @param {Enum} paymentType - the manner in which the payment was made
	 * @param {Object} order - the order with which this payment is to be associated
	 * @param {Enum} reason - the reason why this payment has been made
	 * @param {String} username - the adminstrator recording this payment
	 * @param {Object} [ccTransaction] - Stripe transaction details from a recent credit card charge, should the
	 * 		payment have been made through a credit card
	 * @param {Object} [image] - Dropbox metadata relating to a recently uploaded image of a check or cash instrument,
	 * 		should the payment have been made through either means
	 *
	 * @return {Object} - the payment record
	 *
	 * @author kinsho
	 */
	addNewPayment: async function (amount, paymentType, order, reason, username, ccTransaction, image)
	{
		try
		{
			let counterRecord = await mongo.readThenModify(COUNTERS_COLLECTION,
				{
					$inc: { seq: 1 }
				},
				{
					_id: PAYMENTS_COLLECTION
				}),
				tax = 0,
				data, txnMeta;

			// Determine what payment-specific details we should be storing
			if (ccTransaction)
			{
				txnMeta =
				{
					brand: ccTransaction.payment_method_details.card.brand,
					last4: ccTransaction.payment_method_details.card.last4
				};
			}
			else if (image)
			{
				txnMeta =
				{
					imgLink: image.shareLink
				};
			}

			// Determine wheteher taxes need to be assessed on this transaction
			// Keep in mind sales tax is only collected in the state of New Jersey for the time being
			if (order.pricing.isTaxApplied)
			{
				tax = amount / (1 + pricingData.NJ_SALES_TAX_RATE);
				tax = parseFloat(tax.toFixed(2));
			}

			// Organize the data to be stored in the database
			data =
			{
				id: counterRecord.seq,
				orderId: order._id,
				amount: amount,
				tax: tax,
				type: paymentType,
				admin: username,
				reason: reason,
				details: txnMeta,
				date: new Date(),
				state: order.customer.state
			};

			// Add the note to our notes collection
			await mongo.bulkWrite(PAYMENTS_COLLECTION, true, mongo.formInsertSingleQuery(data));

			return data;
		}
		catch(error)
		{
			console.log('Ran into an error saving a new payment into the system...');
			console.log(error);

			return false;
		}
	}
};