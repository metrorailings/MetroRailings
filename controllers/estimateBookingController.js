/**
 * @module estimateLocationController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Handlebars = require('handlebars'),

	config = global.OwlStakes.require('config/config'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),

	fileManager = global.OwlStakes.require('utility/fileManager'),
	templateManager = global.OwlStakes.require('utility/templateManager'),
	objectHelper = global.OwlStakes.require('utility/objectHelper'),
	cookieManager = global.OwlStakes.require('utility/cookies'),
	mailer = global.OwlStakes.require('utility/mailer'),

	DAO = global.OwlStakes.require('data/DAO/estimatesDAO'),

	customerModel = global.OwlStakes.require('validators/estimateBooking/customer'),
	creditCardModel = global.OwlStakes.require('validators/estimateBooking/creditCard'),
	validatorUtility = global.OwlStakes.require('validators/validatorUtility'),

	pricingCalculator = global.OwlStakes.require('shared/pricing/pricingCalculator'),
	responseCodes = global.OwlStakes.require('shared/responseStatusCodes');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'estimateBooking',

	COOKIE_ESTIMATE_DISTANCE_INFO = 'estimateDistance',
	COOKIE_CUSTOMER_INFO = 'customerInfo',

	ESTIMATE_CONFIRMATION_EMAIL = 'estimateConfirmation',
	ESTIMATE_CONFIRMATION_HEADER = 'Your estimate is being scheduled',

	PARTIALS =
	{
		INVOICE_SECTION: 'invoiceSection',
		AGREEMENT_SECTION: 'agreement',
		PERSONAL_INFO_SECTION: 'personalInfoSection',
		CREDIT_CARD_SECTION: 'ccSection',
		SUBMISSION_SECTION: 'submissionSection'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template that displays the amount to charge the customer
 */
_Handlebars.registerPartial('estimateBookingInvoice', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.INVOICE_SECTION));

/**
 * The template for the agreement
 */
_Handlebars.registerPartial('estimateBookingAgreement', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.AGREEMENT_SECTION));

/**
 * The template gathers information about the customer booking the estimate
 */
_Handlebars.registerPartial('estimateBookingPersonalInfoSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.PERSONAL_INFO_SECTION));

/**
 * The template for the credit card section
 */
_Handlebars.registerPartial('estimateBookingPaymentSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.CREDIT_CARD_SECTION));

/**
 * The template for the submission button
 */
_Handlebars.registerPartial('estimateBookingSubmissionSection', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.SUBMISSION_SECTION));

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Initializer function responsible for serving the page
	 *
	 * @author kinsho
	 */
	init: async function(params, cookie)
	{
		var cookieData = cookieManager.parseCookie(cookie || ''),
			distanceData = JSON.parse(cookieData[COOKIE_ESTIMATE_DISTANCE_INFO]),
			pageData = distanceData,
			expirationYears = [],
			populatedPageTemplate,
			currentYear = new Date().getFullYear(),
			i;

		console.log('Loading the booking page for the estimate scheduling process...');

		// Find some years that can be placed into the expiration year dropdown as selectable options
		for (i = currentYear; i <= currentYear + 10; i++)
		{
			expirationYears.push(i);
		}

		pageData =
		{
			expirationYears: expirationYears,
			totalPrice: pricingCalculator.calculateEstimateTotal(distanceData.distance)
		};

		// Render the page template
		populatedPageTemplate = await templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {});
	},

	bookEstimate: async function(params, cookie)
	{
		console.log('Saving a new estimate into the system...');

		var customerValidationModel = customerModel(),
			creditCardValidationModel = creditCardModel(),
			cookieData = cookieManager.parseCookie(cookie || ''),
			addressCookie = JSON.parse(cookieData[COOKIE_ESTIMATE_DISTANCE_INFO]),
			processedEstimate,
			mailHTML;

		// Populate the customer validation model
		objectHelper.cloneObject(params.customer, customerValidationModel);

		// Populate the credit card validation model
		objectHelper.cloneObject(params, creditCardValidationModel);

		// Verify that both models are valid before proceeding
		if (validatorUtility.checkModel(customerValidationModel) && validatorUtility.checkModel(creditCardValidationModel))
		{
			// Load the address data stored in the cookie into the customer data structure
			params.customer.address = addressCookie.address;
			params.customer.aptSuiteNumber = addressCookie.aptSuiteNumber;
			params.customer.city = addressCookie.city;
			params.customer.state = addressCookie.state;
			params.customer.zipCode = addressCookie.zipCode;

			try
			{
				// Save the estimate data into the database
				processedEstimate = await DAO.saveNewEstimate(params, addressCookie.distance);
			}
			catch(error)
			{
				return {
					statusCode: responseCodes.BAD_REQUEST
				};
			}

			// Send out an e-mail to the customer confirming that the estimate is being scheduled
			mailHTML = await mailer.generateFullEmail(ESTIMATE_CONFIRMATION_EMAIL, processedEstimate, ESTIMATE_CONFIRMATION_EMAIL);
			await mailer.sendMail(mailHTML, '', params.customer.email, ESTIMATE_CONFIRMATION_HEADER, config.SUPPORT_MAILBOX);

			// Send out an e-mail to us just to alert us that an estimate has been scheduled
			await mailer.sendMail(mailHTML, '', config.SUPPORT_MAILBOX, ESTIMATE_CONFIRMATION_HEADER, config.SUPPORT_MAILBOX);

			// Return a 200 response along with a cookie that we will use to render parts of the order confirmation page
			return {
				statusCode: responseCodes.OK,
				data: {},

				// Set up this cookie so that we can render some needed data on the order confirmation page
				cookie: cookieManager.formCookie(COOKIE_CUSTOMER_INFO,
				{
					areaCode: processedEstimate.customer.areaCode,
					phoneOne: processedEstimate.customer.phoneOne,
					phoneTwo: processedEstimate.customer.phoneTwo,
					email: processedEstimate.customer.email,
				})
			};
		}

		return {
			statusCode: responseCodes.BAD_REQUEST
		};
	}
};