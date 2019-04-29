// ----------------- EXTERNAL MODULES --------------------------

const mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver');

// ----------------- ENUMS/CONSTANTS --------------------------

const COUNTERS_COLLECTION = 'counters',
	PAYMENTS_COLLECTION = 'payments';

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function that extracts relevant information from a Stripe transaction record
	 *
	 * @param {Object} transaction - the Stripe record
	 *
	 * @returns {Object} - relevant details about the card that we will need
	 *
	 * @author kinsho
	 */
	extractCardDetails: function(transaction)
	{
		return {
			brand: transaction.payment_method_details.card.brand,
			last4: transaction.payment_method_details.card.last4
		};
	},

	/**
	 * Function to store a new payment into the payments table
	 *
	 * @param {Number} amount - the amount that was paid
	 * @param {Enum} paymentType - the manner in which the payment was made
	 * @param {Number} orderId - the ID of the order with which this payment is to be associated
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
	addNewPayment: async function (amount, paymentType, orderId, reason, username, ccTransaction, image)
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

			// Organize the data to be stored in the database
			data =
			{
				id: counterRecord.seq,
				orderId: orderId,
				amount: amount,
				type: paymentType,
				admin: username,
				details: txnMeta
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