/**
 * A module responsible for managing all credit card transactions
 *
 * @module creditCardProcessor
 */

// ----------------- EXTERNAL MODULES --------------------------

var config = global.OwlStakes.require('config/config'),

	_Q = require('q'),
	_stripe = require('stripe')(config.STRIPE_SECRET_KEY); // The stripe module has to be initialized prior to using it

// ----------------- ENUMS/CONSTANTS --------------------------

var ACCEPTABLE_CURRENCY = 'usd',
	ORDER_ID_PLACEHOLDER = '::orderID',

	TRANSACTION_DESCRIPTION =
	{
		CHARGE: 'Order ::orderID - Charge'
	};

// ----------------- GENERATOR TRANSFORMATION FUNCTIONS --------------------------

var _createCustomer = _Q.nbind(_stripe.customers.create, _stripe.customers),
	_chargeCard = _Q.nbind(_stripe.charges.create, _stripe.charges),
	_retrieveTransaction = _Q.nbind(_stripe.charges.retrieve, _stripe.charges),
	_refundMoney = _Q.nbind(_stripe.refunds.create, _stripe.refunds);

// ----------------- PRIVATE FUNCTIONS --------------------------

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Simple little function meant to create a new customer object from a Stripe credit card token.
	 * Creating a customer record would allow us to transact with that customer again without requesting his or her
	 * information again
	 *
	 * @param {String} ccToken - the credit card token ID
	 * @param {String} name - the customer's name
	 * @param {String} email - the customer's e-mail address
	 *
	 * @returns {String} - the ID of the customer record
	 *
	 * @author kinsho
	 */
	generateCustomerRecord: _Q.async(function* (ccToken, name, email)
	{
		var customer = yield _createCustomer(
			{
				source: ccToken,
				metadata: { Name: name },
				email: email,
				description: name
			});

		return customer.id;
	}),

	/**
	 * Function responsible for charging a customer's credit card
	 *
	 * @param {Number} orderTotal - the price to charge the customer
	 * @param {String} customerID - the ID of the customer who will be charged
	 * @param {Number} orderID - the ID of the order that's currently making us some money
	 *
	 * @returns {boolean} - the transaction ID
	 *
	 * @author kinsho
	 */
	chargeTotal: _Q.async(function* (orderTotal, customerID, orderID)
	{
		var charge = yield _chargeCard(
			{
				amount: orderTotal * 100,
				customer: customerID,
				currency: ACCEPTABLE_CURRENCY,
				metadata: { "Order ID" : orderID },
				description: TRANSACTION_DESCRIPTION.CHARGE.replace(ORDER_ID_PLACEHOLDER, orderID)
			});

		return charge.id;
	}),

	/**
	 * Function responsible for refunding some money back to a customer
	 *
	 * @param {Number} refundAmount - the money to send back to the customer
	 * @param {Array<String>} transactionIDs - the IDs of the transaction that will be used to refund money back to the customer
	 * @param {Number} orderID - the ID of the order that's currently being refunded
	 *
	 * @returns {boolean} - a true value simply to gracefully close out the function
	 *
	 * @author kinsho
	 */
	refundMoney: _Q.async(function* (refundAmount, transactionIDs, orderID)
	{
		var transaction,
			amountLeft, amountToRefund,
			i;

		// Loop through all the charges for an order in order to refund the money
		for (i = 0; i < transactionIDs.length; i++)
		{
			transaction = yield _retrieveTransaction(transactionIDs[i]);

			// Figure out how much money is left to refund from this transaction
			amountLeft = transaction.amount - transaction.amount_refunded;

			if (amountLeft > 0)
			{
				// Find out exactly how much money to refund from this particular transaction
				amountToRefund = (refundAmount - amountLeft > 0 ? amountLeft : refundAmount);

				// Now refund money from the transaction currently in context
				yield _refundMoney(
				{
					charge: transaction.id,
					amount: amountToRefund * 100,
					metadata: { "Order ID" : orderID },
				});

				// Update the variable we use to track the money left to give back to the customer
				refundAmount -= amountToRefund;
			}

			// Once we are done refunding the money, break out of this loop
			if (refundAmount === 0)
			{
				break;
			}
		}

		return true;
	})
};