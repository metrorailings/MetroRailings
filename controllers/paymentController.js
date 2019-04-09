/**
 * @module ccController
 */

// ----------------- EXTERNAL MODULES --------------------------

const responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),

	creditCardProcessor = global.OwlStakes.require('utility/creditCardProcessor');

// ----------------- ENUM/CONSTANTS --------------------------

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
			let token = await creditCardProcessor.generateToken(params.number, params.exp_month, params.exp_year, params.cvc);

			return {
				statusCode: responseCodes.OK,
				data: token
			};
		}
		catch (error)
		{
			console.log('Credit card was unable to be processed...');

			return {
				statusCode: responseCodes.BAD_REQUEST
			};
		}
	}
};