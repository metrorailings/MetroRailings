/**
 * The validator model for a new order
 */

// ----------------- EXTERNAL MODULES --------------------------

var formValidator = global.OwlStakes.require('utility/formValidator'),
	validatorUtility = global.OwlStakes.require('validators/validatorUtility');

// ----------------- ENUM/CONSTANTS -----------------------------

var VALID_TYPES =
	{
		stairs: true,
		deck: true
	},

	VALID_STYLES =
	{
		bars: true,
		collars: true,
		custom: true
	},

	VALID_COLORS =
	{
		white: true,
		black: true,
		silver: true,
		mahogany: true
	},

	ORDER_TYPE = 'type',
	ORDER_LENGTH = 'length',
	ORDER_STYLE = 'style',
	ORDER_COLOR = 'color';

// ----------------- PRIVATE VARIABLES -----------------------------

// ----------------- PRIVATE FUNCTIONS -----------------------------

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

	// Railings Style
	Object.defineProperty(validationModel, ORDER_STYLE,
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel['__' + ORDER_STYLE];
		},

		set: (value) =>
		{
			validatorUtility.validateProperty(VALID_STYLES[value], validationModel, ORDER_STYLE, value);
		}
	});

	// Railings Color
	Object.defineProperty(validationModel, ORDER_COLOR,
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel['__' + ORDER_COLOR];
		},

		set: (value) =>
		{
			validatorUtility.validateProperty(VALID_COLORS[value], validationModel, ORDER_COLOR, value);
		}
	});

	// -------- Configuration -------------

	validationModel.requiredProps = [ORDER_COLOR, ORDER_LENGTH, ORDER_TYPE, ORDER_STYLE];

	return validationModel;
}

// ----------------- EXPORT -----------------------------

// We invoke a pseudo-constructor function here instead of the object itself because we need to generate a new instance
// of this object for every new request that necessitates the logic encapsulated within this model
module.exports = createNewModel;