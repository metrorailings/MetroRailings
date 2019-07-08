/**
 * A module responsible for managing all credit card transactions
 *
 * @module creditCardProcessor
 */

// ----------------- EXTERNAL MODULES --------------------------

	// Import the configuration file first as we need it to properly instantiate the stripe module
let config = global.OwlStakes.require('config/config'),

	_Q = require('q'),
	_stripe = require('stripe')(config.STRIPE_SECRET_KEY); // The stripe module has to be initialized prior to using it

// ----------------- ENUMS/CONSTANTS --------------------------

const ACCEPTABLE_CURRENCY = 'usd',
	CREDIT_CARD_PAYMENT_TYPE = 'card';

// ----------------- GENERATOR TRANSFORMATION FUNCTIONS --------------------------

let _chargeCard = _Q.nbind(_stripe.charges.create, _stripe.charges),
	_retrieveTransaction = _Q.nbind(_stripe.charges.retrieve, _stripe.charges),
	_refundMoney = _Q.nbind(_stripe.refunds.create, _stripe.refunds),
	_createToken = _Q.nbind(_stripe.tokens.create, _stripe.tokens),
	_createCustomer = _Q.nbind(_stripe.customers.create, _stripe.customers),
	_createCard = _Q.nbind(_stripe.customers.createSource, _stripe.customers);

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function meant to codify all credit card information into a token
	 *
	 * @param {String} ccNumber - the credit card number, in full
	 * @param {Number} expMonth - the month on which this credit card will expire
	 * @param {Number} expYear - the year on which this credit card will expire
	 * @param {String} cvc - the credit card verification code
	 *
	 * @returns {Object} - the credit card token we can use to generate new transactions
	 *
	 * @author kinsho
	 */
	generateToken: async function (ccNumber, expMonth, expYear, cvc)
	{
		let token = await _createToken(
		{
			card :
			{
				number: ccNumber,
				exp_month: parseInt(expMonth, 10),
				exp_year: parseInt(expYear, 10),
				cvc: cvc
			}
		});

		return token;
	},

	/**
	 * Function meant to create a customer for an order so that we can store credit cards that can be repeatedly charged
	 *
	 * @param {String} name - the name of the customer
	 * @param {Number} orderId - the ID of the order associated with the customer
	 *
	 * @returns {Object} - the customer object from Stripe
	 *
	 * @author kinsho
	 */
	createCustomer: async function (name, orderId)
	{
		let customer = await _createCustomer(
		{
			name: name + ' - ' + orderId,
			metadata:
			{
				orderId: orderId,
			}
		});

		return customer;
	},

	/**
	 * Function meant to create a credit card object inside Stripe
	 *
	 * @param {String} customerId - the ID of the customer using this card
	 * @param {String} tokenId - the ID of the credit card token to associate with the customer
	 *
	 * @returns {Object} - the card object to store within our database
	 *
	 * @author kinsho
	 */
	createCard: async function (customerId, tokenId)
	{
		let creditCard = await _createCard(customerId,
		{
			source: tokenId
		});

		return creditCard;
	},

	/**
	 * Function responsible for charging a customer's credit card
	 *
	 * @param {Number} orderTotal - the price to charge the customer
	 * @param {Number} orderId - the ID of the order that's currently making us some money
	 * @param {String} cardId - the ID of the credit card we'll be using to process payment
	 * @param {String} customerId - the ID of the customer associated with the credit card we'll be charging
	 * @param {String} [emailAddr] - the e-mail address which to e-mail the receipt to once the transaction is complete
	 * @param {String} [customerName] - the name of the customer
	 * @param {String} [companyName] - the company that the customer is affiliated with
	 * @param {String} [txDescription] - the description that identifies the purpose of this transaction
	 *
	 * @returns {boolean} - the transaction ID
	 *
	 * @author kinsho
	 */
	chargeTotal: async function (orderTotal, orderId, cardId, customerId, emailAddr, customerName, companyName, txDescription)
	{
		let chargeParams =
			{
				amount: Math.floor(orderTotal * 100),
				customer: customerId,
				currency: ACCEPTABLE_CURRENCY,
				metadata: { 'Order ID' : orderId },
				source: cardId,
				description: txDescription
			};

		// Prep an e-mail recipient should at least one e-mail address be provided
		if (emailAddr)
		{
			chargeParams.receipt_email = emailAddr.split(',')[0];
		}

		// Update the metadata if additional information was provided about the customer
		if (customerName)
		{
			chargeParams.metadata.name = customerName;
		}
		if (companyName)
		{
			chargeParams.metadata.company = companyName;
		}

		return await _chargeCard(chargeParams);
	},

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
	refundMoney: async function (refundAmount, transactionIDs, orderID)
	{
		let transaction,
			amountLeft, amountToRefund,
			i;

		// Loop through all the charges for an order in order to refund the money
		for (i = 0; i < transactionIDs.length; i++)
		{
			transaction = await _retrieveTransaction(transactionIDs[i]);

			// Figure out how much money is left to refund from this transaction
			amountLeft = transaction.amount - transaction.amount_refunded;

			if (amountLeft > 0)
			{
				// Find out exactly how much money to refund from this particular transaction
				amountToRefund = (refundAmount - amountLeft > 0 ? amountLeft : refundAmount);

				// Now refund money from the transaction currently in context
				await _refundMoney(
				{
					charge: transaction.id,
					amount: amountToRefund * 100,
					metadata: { 'Order ID' : orderID },
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
	},

	/**
	 * Function that parses out only relevant information from transactions
	 *
	 * @param {Object} transaction - the transaction to whittle down
	 *
	 * @return {Object} - a leaner transaction object
	 *
	 * @author kinsho
	 */
	whittleTransaction: function (transaction)
	{
		return {
			id: transaction.id,
			type: CREDIT_CARD_PAYMENT_TYPE,
			amount: transaction.amount,
			refund: transaction.amount_refunded,
			cardDetails:
			{
				brand: transaction.payment_method_details.card.brand,
				last4: transaction.payment_method_details.card.last4
			}
		};
	}
};