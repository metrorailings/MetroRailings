/**
 * @module checkOrderController
 */

// ----------------- EXTERNAL MODULES --------------------------

var _Q = require('q'),
	_Handlebars = require('handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),

	templateManager = global.OwlStakes.require('utility/templateManager'),
	formValidator = global.OwlStakes.require('utility/formValidator'),
	objectHelper = global.OwlStakes.require('utility/objectHelper'),
	fileManager = global.OwlStakes.require('utility/fileManager'),

	searchModel = global.OwlStakes.require('validators/checkOrder/search'),
	validatorUtility = global.OwlStakes.require('validators/validatorUtility'),

	responseCodes = global.OwlStakes.require('shared/responseStatusCodes'),

	ordersDAO = global.OwlStakes.require('data/DAO/ordersDAO');

// ----------------- ENUM/CONSTANTS --------------------------

var CONTROLLER_FOLDER = 'checkOrder',

	PARTIALS =
	{
		SEARCH: 'orderSearch',
		LISTING: 'orderSearchListing'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the order search section
 */
_Handlebars.registerPartial('orderSearch', fileManager.fetchTemplateSync(CONTROLLER_FOLDER, PARTIALS.SEARCH));

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
			specifiedOrderID = params.orderNumber,
			pageData = {},
			order;

		console.log('Loading the order checker page...');

		// If a specific order has been indicated as the target of the user's search, find the details pertaining to that order
		// and post those details on the rendered HTML
		if (specifiedOrderID && formValidator.isNumeric(specifiedOrderID))
		{
			order = yield ordersDAO.searchOrderById(specifiedOrderID);
		}

		// Grab the raw HTML of the order listing template
		pageData.orderSearchListingTemplate = yield fileManager.fetchTemplate(CONTROLLER_FOLDER, PARTIALS.LISTING);

		// Now render the page template
		populatedPageTemplate = yield templateManager.populateTemplate(pageData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return yield controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, { order: order });
	}),

	/**
	 * Action function that finds and returns orders that match given search criteria
	 *
	 * @author kinsho
	 */
	searchForOrders: _Q.async(function* (params)
	{
		console.log('Searching for orders...');

		var searchValidationModel = searchModel(),
			orders;

		// Users are only allowed to initiate a search should at least two of the three search filters be populated
		if ((params.orderID && params.email) || (params.orderID && params.phoneTwo) || (params.email && params.phoneTwo))
		{
			// Validate the inputs first before proceeding to query the database
			objectHelper.cloneObject(params, searchValidationModel);
			if (validatorUtility.checkModel(searchValidationModel))
			{
				// Fetch and return any orders that satisfy the search criteria
				orders = yield ordersDAO.searchOrdersByMisc(parseInt(params.orderID, 10), params.email, params.phoneTwo);
			}

			return {
				statusCode: responseCodes.OK,
				data: orders || []
			};
		}

		return {
			statusCode: responseCodes.BAD_REQUEST
		};
	})
};