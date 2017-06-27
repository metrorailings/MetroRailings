/**
 * The validator model for a given address
 */

// ----------------- EXTERNAL MODULES --------------------------

var formValidator = global.OwlStakes.require('shared/formValidator'),
	validatorUtility = global.OwlStakes.require('validators/validatorUtility');

// ----------------- ENUM/CONSTANTS -----------------------------

var VALID_STATES =
	{
		NJ: true,
		NY: true,
		PA: true
	},

	CUSTOMER_ADDRESS = 'address',
	CUSTOMER_APT_SUITE_NUMBER = 'aptSuiteNumber',
	CUSTOMER_CITY = 'city',
	CUSTOMER_STATE = 'state',
	CUSTOMER_ZIP_CODE = 'zipCode';

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

	// Customer Address
	Object.defineProperty(validationModel, CUSTOMER_ADDRESS,
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel['__' + CUSTOMER_ADDRESS];
		},

		set: (value) =>
		{
			validatorUtility.validateProperty(formValidator.isAlphaNumeric(value, ' .'), validationModel, CUSTOMER_ADDRESS, value);
		}
	});

	// Customer Apartment/Suite Number
	Object.defineProperty(validationModel, CUSTOMER_APT_SUITE_NUMBER,
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel['__' + CUSTOMER_APT_SUITE_NUMBER];
		},

		set: (value) =>
		{
			validatorUtility.validateProperty(formValidator.isAlphaNumeric(value, ' .-'), validationModel, CUSTOMER_APT_SUITE_NUMBER, value);
		}
	});

	// Customer City
	Object.defineProperty(validationModel, CUSTOMER_CITY,
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel['__' + CUSTOMER_CITY];
		},

		set: (value) =>
		{
			validatorUtility.validateProperty(formValidator.isAlphabetical(value, ' .-'), validationModel, CUSTOMER_CITY, value);
		}
	});

	// Customer State
	Object.defineProperty(validationModel, CUSTOMER_STATE,
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel['__' + CUSTOMER_STATE];
		},

		set: (value) =>
		{
			validatorUtility.validateProperty(VALID_STATES[value], validationModel, CUSTOMER_STATE, value);
		}
	});

	// Customer Zip Code
	Object.defineProperty(validationModel, CUSTOMER_ZIP_CODE,
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel['__' + CUSTOMER_ZIP_CODE];
		},

		set: (value) =>
		{
			var isValid = (value.length === 5) && (formValidator.isNumeric(value));

			validatorUtility.validateProperty(isValid, validationModel, CUSTOMER_ZIP_CODE, value);
		}
	});

	// -------- Configuration -------------

	validationModel.requiredProps = [CUSTOMER_ADDRESS, CUSTOMER_CITY, CUSTOMER_STATE, CUSTOMER_ZIP_CODE];

	return validationModel;
}

// ----------------- EXPORT -----------------------------

// We invoke a pseudo-constructor function here instead of the object itself because we need to generate a new instance
// of this object for every new request that necessitates the logic encapsulated within this model
module.exports = createNewModel;