/**
 * @module contactUsController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),
	_Handlebars = require('Handlebars'),
	_crypto = require('crypto'),

	config = global.OwlStakes.require('config/config'),

	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO'),
	supportDAO = global.OwlStakes.require('data/DAO/supportDAO'),

	requestModel = global.OwlStakes.require('validators/contactUs/request'),
	validatorUtility = global.OwlStakes.require('validators/validatorUtility'),

	controllerHelper = global.OwlStakes.require('controllers/utility/ControllerHelper'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	objectHelper = global.OwlStakes.require('utility/objectHelper'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	mailer = global.OwlStakes.require('utility/mailer'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'contactUs',

	CONTACT_US_EMAIL_SUBJECT_PREFIX = 'New support request - ',

	PARTIALS =
	{
		FORM_SECTION: 'form',
		SUBMISSION_SECTION: 'submissionSection'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the form itself
 */
_Handlebars.registerPartial('contactUsFormSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.FORM_SECTION));

/**
 * The template for the submission button
 */
_Handlebars.registerPartial('contactUsSubmissionSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.SUBMISSION_SECTION));

// ----------------- PRIVATE VARIABLES --------------------------

// ----------------- I/O FUNCTION TRANSFORMATIONS --------------------------

// ----------------- MODULE DEFINITION --------------------------
module.exports =
{
	/**
	 * Initializer function responsible for serving the page
	 *
	 * @author kinsho
	 */
	init: _Q.async(function* (params)
	{
		var populatedPageTemplate,
			pageData = {},
			bootData = {contactUs: {}},
			decipher = _crypto.createDecipher(config.ENCRYPTION_ALGORITHM, config.HASH_KEY),
			decipheredOrderID, order;

		console.log('Loading the contact us page...');

		// Render the page template
		populatedPageTemplate = yield templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		// Prepare the bootloaded data
		if (params.curves)
		{
			bootData.contactUs.curves = true;
		}
		if (params.orderId)
		{
			// Decrypt the order ID parameter to fetch the actual order ID
			try
			{
				decipheredOrderID = decipher.update(params.orderId, config.ENCRYPTION_OUTPUT_TYPE, config.ENCRYPTION_INPUT_TYPE);
				decipheredOrderID += decipher.final(config.ENCRYPTION_INPUT_TYPE);
				order = yield ordersDAO.searchOrderById(parseInt(decipheredOrderID, 10));
			}
			catch(error) {}

			if (order)
			{
				bootData.contactUs.orderId = order._id;
				bootData.contactUs.name = order.customer.name;
				bootData.contactUs.areaCode = order.customer.areaCode;
				bootData.contactUs.phoneOne = order.customer.phoneOne;
				bootData.contactUs.phoneTwo = order.customer.phoneTwo;
				bootData.contactUs.email = order.customer.email;
			}
		}

		return yield controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, bootData);
	}),

	sendRequest: _Q.async(function* (params)
	{
		console.log('Sending out an e-mail from an interested customer...');

		var requestValidationModel = requestModel(),
			// Verify that the user has provided at least some contact information
			contactInfoProvided = params.email ||
				(params.areaCode && params.phoneOne && params.phoneTwo),
			mailHTML;

		// Populate the request validation model
		objectHelper.cloneObject(params, requestValidationModel);

		// Verify the user has supplied valid and sufficient data before proceeding
		if (validatorUtility.checkModel(requestValidationModel) && contactInfoProvided)
		{
			// Store the new support request into the database for recording purposes
			if (yield supportDAO.insertNewContactRequest(params))
			{
				// Build the phone number in its entirety for easy reading purposes
				params.phoneNumber = '(' + params.areaCode + ') ' + params.phoneOne + '-' + params.phoneTwo;

				// Send out an e-mail to the support mailbox
				mailHTML = yield mailer.generateFullEmail(CONTROLLER_FOLDER, params, CONTROLLER_FOLDER);
				yield mailer.sendMail(mailHTML, '', config.SUPPORT_MAILBOX, CONTACT_US_EMAIL_SUBJECT_PREFIX + params.name, params.email);

				// Return a 200 response back to the client
				return {
					statusCode: responseCodes.OK,
					data: {}
				};
			}
		}

		// Should validation fail, return a bad request back to the client
		return {
			statusCode: responseCodes.BAD_REQUEST
		};
	})
};