/**
 * @module paymentController
 */

// ----------------- EXTERNAL MODULES --------------------------

const responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),
	pricingCalculator = global.OwlStakes.require('shared/pricing/pricingCalculator'),

	creditCardProcessor = global.OwlStakes.require('utility/creditCardProcessor'),
	cookieManager = global.OwlStakes.require('utility/cookies'),
	dropbox = global.OwlStakes.require('utility/dropbox'),

	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO'),
	usersDAO = global.OwlStakes.require('data/DAO/userDAO'),
	paymentsDAO = global.OwlStakes.require('data/DAO/paymentsDAO');

// ----------------- ENUM/CONSTANTS --------------------------

const TRANSACTION_REASONS =
	{
		ORDER_ID: 'Order ',
		DEPOSIT: ' - Deposit',
		PROGRESS: ' - Payment',
		CLOSING: ' - Closing Payment',
		FULL: ' - Full'
	},

	PAYMENT_TYPES =
	{
		CREDIT_CARD: 'card',
		CHECK: 'check',
		CASH: 'cash'
	};

// ----------------- PRIVATE METHODS --------------------------

/**
 * Function responsible for figuring out whether the transaction is a deposit, a progress payment, or a closing payment
 *
 * @param {Object} order - the order to analyze
 * @param {Number} amount - the amount of the transaction
 *
 * @returns {Enum} - an enumerated string listing the nature of the transaction
 *
 * @author kinsho
 */
function _determineTxnReason(order, amount)
{
	if ( !(order.payments.charges.length) )
	{
		return TRANSACTION_REASONS.DEPOSIT;
	}
	else if (amount === order.payments.balanceRemaining)
	{
		if ( !(order.payments.charges.length) )
		{
			return TRANSACTION_REASONS.FULL;
		}
		else
		{
			return TRANSACTION_REASONS.CLOSING;
		}
	}
	else
	{
		return TRANSACTION_REASONS.PROGRESS;
	}
}

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function responsible for generating a new token that encapsulates information for any one credit card
	 *
	 * @param {Object} params - the credit card information we will be using to create the token
	 *
	 * @author kinsho
	 */
	generateCCToken: async function (params)
	{
		try
		{
			let order = await ordersDAO.searchOrderById(params.orderId),
				token = await creditCardProcessor.generateToken(params.number, params.exp_month, params.exp_year, params.cvc),
				card;

			// Determine if a Stripe customer has been associated with the order for which this token is being created
			// If not, create that customer within Stripe's systems
			if ( !(order.payments.customer) )
			{
				order.payments.customer = await creditCardProcessor.createCustomer(order.customer.name, order._id);
			}

			// Register the card in Stripe to the customer
			card = await creditCardProcessor.createCard(order.payments.customer.id, token.id);

			// Store the card inside the order
			await ordersDAO.addCardToOrder(parseInt(params.orderId, 10), card, order.payments.customer);

			return {
				statusCode: responseCodes.OK,
				data: card
			};
		}
		catch (error)
		{
			console.log('Credit card was unable to be processed for the following reason...');
			console.error(error);

			return {
				statusCode: responseCodes.BAD_REQUEST
			};
		}
	},

	/**
	 * Function responsible for processing credit card payments
	 *
	 * @param {Object} params - the credit card information and the amount which to charge that credit card
	 *
	 * @author kinsho
	 */
	processCCPayment: async function (params, cookie, request)
	{
		if (await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent']))
		{
			let username = cookieManager.retrieveAdminCookie(cookie)[0],
				order = await ordersDAO.searchOrderById(params.orderId),
				transactionReason = TRANSACTION_REASONS.ORDER_ID + params.orderId,
				tax = pricingCalculator.calculateTax(params.amount, order),
				transaction, transactionNature;

			console.log('Recording a new credit card payment...');

			// Initializes the charges array if a charge has not been recorded for this order yet
			order.payments.charges = order.payments.charges || [];

			// Find out the nature of the transaction
			transactionNature = _determineTxnReason(order, parseFloat(params.amount));

			try
			{
				// Now charge the customer
				transaction = await creditCardProcessor.chargeTotal(parseFloat(params.amount), order._id, params.card, order.payments.customer.id, order.customer.email, order.customer.name, order.customer.company, transactionReason + transactionNature);

				// Record the payment information in the payments collection in our database
				transaction = await paymentsDAO.addNewPayment(parseFloat(params.amount), tax, PAYMENT_TYPES.CREDIT_CARD, order, transactionNature.split(' ').pop(), username, params.memo, transaction);

				// Also, record the transaction in the order that's associated with it
				await ordersDAO.recordCharge(order, username, transaction, parseFloat(params.amount));

				// Return the processed transaction metadata back to the client
				return {
					statusCode: responseCodes.OK,
					data: transaction
				};
			}
			catch(error)
			{
				console.log('Ran into an error trying to process a credit card for Order #' + params.orderId);
				console.log(error);

				throw error;
			}
		}
	},

	/**
	 * Function responsible for recording check payments
	 *
	 * @param {Object} params - the check information to store, including an image of the check itself
	 *
	 * @author kinsho
	 */
	recordCheckPayment: async function (params, cookie, request)
	{
		if (await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent']))
		{
			let username = cookieManager.retrieveAdminCookie(cookie)[0],
				order = await ordersDAO.searchOrderById(params.orderId),
				transactionReason = TRANSACTION_REASONS.ORDER_ID + params.orderId,
				tax = pricingCalculator.calculateTax(params.amount, order),
				imgMeta, transaction;

			console.log('Recording a new check payment...');

			// Initializes the charges array if a charge has not been recorded for this order yet
			order.payments.charges = order.payments.charges || [];

			// Find out the nature of the transaction
			transactionReason += _determineTxnReason(order, parseFloat(params.amount));

			try
			{
				// Upload the check image to Dropbox
				imgMeta = await dropbox.uploadFile(params.orderId, params.checkImage, dropbox.DIRECTORY.PAYMENTS);

				if (imgMeta.length)
				{
					// Record the payment information in the payments collection in our database
					transaction = await paymentsDAO.addNewPayment(parseFloat(params.amount), tax, PAYMENT_TYPES.CHECK, order, transactionReason.split(' ').pop(), username, params.memo, null, imgMeta[0]);

					// Also, record the transaction in the order that's associated with it
					await ordersDAO.recordCharge(order, username, transaction, parseFloat(params.amount));

					return {
						statusCode: responseCodes.OK,
						data: transaction
					};
				}
				else
				{
					return {
						statusCode: responseCodes.BAD_REQUEST
					};
				}
			}
			catch(error)
			{
				console.log('Ran into an error trying to record a check payment for Order #' + params.orderId);
				console.log(error);

				throw error;
			}
		}
	},

	/**
	 * Function responsible for recording cash payments
	 *
	 * @param {Object} params - the payment information to store, including an image of the cash or money order itself
	 *
	 * @author kinsho
	 */
	recordCashPayment: async function (params, cookie, request)
	{
		if (await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent']))
		{
			let username = cookieManager.retrieveAdminCookie(cookie)[0],
				order = await ordersDAO.searchOrderById(params.orderId),
				transactionReason = TRANSACTION_REASONS.ORDER_ID + params.orderId,
				tax = pricingCalculator.calculateTax(params.amount, order),
				imgMeta, transaction;

			console.log('Recording a new cash payment...');

			// Initializes the charges array if a charge has not been recorded for this order yet
			order.payments.charges = order.payments.charges || [];

			// Find out the nature of the transaction
			transactionReason += _determineTxnReason(order, parseFloat(params.amount));

			try
			{
				// Upload the check image to Dropbox
				imgMeta = await dropbox.uploadFile(params.orderId, params.cashImage, dropbox.DIRECTORY.PAYMENTS);

				if (imgMeta.length)
				{
					// Record the payment information in the payments collection in our database
					transaction = await paymentsDAO.addNewPayment(parseFloat(params.amount), tax, PAYMENT_TYPES.CASH, order, transactionReason.split(' ').pop(), username, params.memo, null, imgMeta[0]);

					// Also, record the transaction in the order that's associated with it
					await ordersDAO.recordCharge(order, username, transaction, parseFloat(params.amount));

					return {
						statusCode: responseCodes.OK,
						data: transaction
					};
				}
				else
				{
					return {
						statusCode: responseCodes.BAD_REQUEST
					};
				}
			}
			catch(error)
			{
				console.log('Ran into an error trying to record a cash payment for Order #' + params.orderId);
				console.log(error);

				throw error;
			}
		}
	}
};