/**
 * @module ccController
 */

// ----------------- EXTERNAL MODULES --------------------------

const responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),

	creditCardProcessor = global.OwlStakes.require('utility/creditCardProcessor'),
	cookieManager = global.OwlStakes.require('utility/cookies'),
	dropbox = global.OwlStakes.require('utility/dropbox'),

	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO'),
	usersDAO = global.OwlStakes.require('data/DAO/usersDAO');

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
			let token = await creditCardProcessor.generateToken(params.number, params.exp_month, params.exp_year, params.cvc),
				tokens;

			// Store the token inside the order
			tokens = await ordersDAO.addTokenToOrder(params.orderId, token);

			return {
				statusCode: responseCodes.OK,
				data:
				{
					token: token,
					tokens: tokens
				}
			};
		}
		catch (error)
		{
			console.log('Credit card was unable to be processed...');

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
				transaction, payments;

			console.log('Recording a new credit card payment...');

			// Initializes the charges array if a charge has not been recorded for this order yet
			order.payments.charges = order.payments.charges || [];

			try
			{
				// Determine whether this is the first payment being made on this order, the last payment being made, or
				// simply a progress payment
				if ( !(order.payments.charges.length) )
				{
					transactionReason += TRANSACTION_REASONS.DEPOSIT;
				}
				else if (params.amount === order.payments.balanceRemaining)
				{
					if ( !(order.payments.charges.length) )
					{
						transactionReason += TRANSACTION_REASONS.FULL;
					}
					else
					{
						transactionReason += TRANSACTION_REASONS.CLOSING;
					}
				}
				else
				{
					transactionReason += TRANSACTION_REASONS.PROGRESS;
				}

				// Now charge the customer
				transaction = await creditCardProcessor.chargeTotal(params.amount, params.orderId, params.token, order.customer.email, order.customer.name, order.customer.company, transactionReason);

				// Record the payment information in our database
				transaction = creditCardProcessor.whittleTransaction(transaction);

				// Record the transaction in our database for tracking purposes
				payments = await ordersDAO.recordCardCharge(order, username, transaction, params.amount);

				return {
					statusCode: responseCodes.OK,
					data: payments
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
	recordCheckPayment: async function (params)
	{
		if (await usersDAO.verifyAdminCookie(cookie, request.headers['user-agent']))
		{
			let username = cookieManager.retrieveAdminCookie(cookie)[0],
				transaction,
				imgMeta;

			console.log('Recording a new check payment...');

			// Upload the check image to Dropbox
			imgMeta = await dropbox.uploadImage(params.orderId, params.checkImage);
			imgMeta = imgMeta.pop();

			if (imgMeta.length)
			{
				// Now that the image has been successfully uploaded, tease out the relevant details about the check
				transaction =
				{
					image: imgMeta,
					
				};

				// Save all the metadata from the newly uploaded images into the database
				await ordersDAO.saveNewPicToOrder(params.id, imgMetas, username);

				return {
					statusCode: responseCodes.OK,
					data: imgMeta
				};
			}
			else
			{
				return {
					statusCode: responseCodes.BAD_REQUEST
				};
			}
		}
	}
};