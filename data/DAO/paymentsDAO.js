// ----------------- EXTERNAL MODULES --------------------------

const mongo = global.OwlStakes.require('data/DAO/utility/databaseDriver'),

	pricingCalculator = global.OwlStakes.require('shared/pricing/pricingCalculator');

// ----------------- ENUMS/CONSTANTS --------------------------

const COUNTERS_COLLECTION = 'counters',
	PAYMENTS_COLLECTION = 'payments',

	SYSTEM_USER_NAME = 'system';

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function to store a new payment into the payments table
	 *
	 * @param {Number} amount - the amount that was paid
	 * @param {Number} tax - the taxable amount that can be withheld from the amount paid
	 * @param {Enum} paymentType - the manner in which the payment was made
	 * @param {Object} order - the order with which this payment is to be associated
	 * @param {Enum} reason - the reason why this payment has been made
	 * @param {String} username - the adminstrator recording this payment
	 * @param {String} memo - the memo note to associate with this payment
	 * @param {Object} [ccTransaction] - Stripe transaction details from a recent credit card charge, should the
	 * 		payment have been made through a credit card
	 * @param {Object} [image] - Dropbox metadata relating to a recently uploaded image of a check or cash instrument,
	 * 		should the payment have been made through either means
	 *
	 * @return {Object} - the payment record
	 *
	 * @author kinsho
	 */
	addNewPayment: async function (amount, tax, paymentType, order, reason, username = SYSTEM_USER_NAME, memo, ccTransaction, image)
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
				tax, data, txnMeta;

			// Determine what payment-specific details we should be storing
			if (ccTransaction)
			{
				txnMeta =
				{
					brand: ccTransaction.payment_method_details.card.brand,
					last4: ccTransaction.payment_method_details.card.last4,
					fee: pricingCalculator.calculateStripeFee(amount) // the Stripe fee
				};
			}
			else if (image)
			{
				txnMeta =
				{
					imgLink: image.shareLink
				};
			}

			// Calculate the sales taxes collected on this order, if applicable
			tax = pricingCalculator.calculateTax(amount, order);

			// Organize the data to be stored in the database
			data =
			{
				_id: counterRecord.seq,
				orderId: order._id,
				amount: amount,
				tax: tax,
				memo: memo || '',
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