/**
 * The validator model for a new order
 */

// ----------------- EXTERNAL MODULES --------------------------

var formValidator = global.OwlStakes.require('shared/formValidator'),

	validatorUtility = global.OwlStakes.require('validators/validatorUtility'),

	pricingCalculator = global.OwlStakes.require('shared/pricing/pricingCalculator');

// ----------------- ENUM/CONSTANTS -----------------------------

var VALID_TYPES =
	{
		stairs: true,
		deck: true
	},

	ORDER_TYPE = 'type',
	ORDER_LENGTH = 'length',
	ORDER_DESIGN = 'design',
	CC_TOKEN = 'ccToken',
	CUSTOMER = 'customer';

// ----------------- VALIDATION MODEL DEFINITION -----------------------------

/**
 * Function responsible for producing a new instance of this validation model
 *
 * @returns {validationModel} - the new instance of the model
 *
 * @author kinsho
 */
function createNewModel()
{
	var validationModel = new validatorUtility.generateValidationModel();

	// Railings Type
	Object.defineProperty(validationModel, ORDER_TYPE,
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel['__' + ORDER_TYPE];
		},

		set: (value) =>
		{
			validatorUtility.validateProperty(VALID_TYPES[value], validationModel, ORDER_TYPE, value);
		}
	});

	// Railings Length
	Object.defineProperty(validationModel, ORDER_LENGTH,
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel['__' + ORDER_LENGTH];
		},

		set: (value) =>
		{
			validatorUtility.validateProperty(formValidator.isNumeric(value), validationModel, ORDER_LENGTH, parseInt(value, 10));
		}
	});

	// Railings Design
	Object.defineProperty(validationModel, ORDER_DESIGN,
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel['__' + ORDER_DESIGN];
		},

		set: (value) =>
		{
			var keys = Object.keys(value),
				i;

			// Cycle through each design option to ensure that the design selections are all valid selections
			for (i = keys.length - 1; i >= 0; i--)
			{
				if ( pricingCalculator.findDesignPricing(value[keys[i]]) || !(value[keys[i]]) )
				{
					continue;
				}

				return false;
			}

			validationModel['__' + ORDER_DESIGN] = value;
		}
	});

	// Credit Card Token
	Object.defineProperty(validationModel, CC_TOKEN,
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel['__' + CC_TOKEN];
		},

		set: (value) =>
		{
			validatorUtility.validateProperty(!!(value), validationModel, CC_TOKEN, value);
		}
	});

	// Customer
	Object.defineProperty(validationModel, CUSTOMER,
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel['__' + CUSTOMER];
		},

		set: (value) =>
		{
			validationModel['__' + CUSTOMER] = value;
		}
	});

	// -------- Configuration -------------

	validationModel.requiredProps = [ORDER_LENGTH, ORDER_TYPE, ORDER_DESIGN, CC_TOKEN, CUSTOMER];

	return validationModel;
}

// ----------------- EXPORT -----------------------------

// We invoke a pseudo-constructor function here instead of the object itself because we need to generate a new instance
// of this object for every new request that necessitates the logic encapsulated within this model
module.exports = createNewModel;