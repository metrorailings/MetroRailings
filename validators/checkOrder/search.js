/**
 * The validator model for an order search
 */

// ----------------- EXTERNAL MODULES --------------------------

var formValidator = global.OwlStakes.require('shared/formValidator'),
	validatorUtility = global.OwlStakes.require('validators/validatorUtility');

// ----------------- ENUM/CONSTANTS -----------------------------

var ORDER_NUMBER = 'orderID',
	PHONE_TWO = 'phoneTwo',
	EMAIL = 'email';

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

	// Order identification number
	Object.defineProperty(validationModel, ORDER_NUMBER,
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel['__' + ORDER_NUMBER];
		},

		set: (value) =>
		{
			validatorUtility.validateProperty(formValidator.isNumeric(value), validationModel, ORDER_NUMBER, value);
		}
	});

	// Last 4 digits of phone number
	Object.defineProperty(validationModel, PHONE_TWO,
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel['__' + PHONE_TWO];
		},

		set: (value) =>
		{
			validatorUtility.validateProperty(formValidator.isNumeric(value), validationModel, PHONE_TWO, value);
		}
	});

	// E-mail address
	Object.defineProperty(validationModel, EMAIL,
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel['__' + EMAIL];
		},

		set: (value) =>
		{
			validatorUtility.validateProperty(formValidator.isEmail(value), validationModel, EMAIL, value);
		}
	});

	// -------- Configuration -------------

	validationModel.requiredProps = [];

	return validationModel;
}

// ----------------- EXPORT -----------------------------

// We invoke a pseudo-constructor function here instead of the object itself because we need to generate a new instance
// of this object for every new request that necessitates the logic encapsulated within this model
module.exports = createNewModel;