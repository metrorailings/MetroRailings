/**
 * The validator model for a customer record
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

	CUSTOMER_NAME = 'name',
	CUSTOMER_AREA_CODE = 'areaCode',
	CUSTOMER_PHONE_ONE = 'phoneOne',
	CUSTOMER_PHONE_TWO = 'phoneTwo',
	CUSTOMER_EMAIL = 'email',
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

	// Customer Name
	Object.defineProperty(validationModel, CUSTOMER_NAME,
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel['__' + CUSTOMER_NAME];
		},

		set: (value) =>
		{
			validatorUtility.validateProperty(formValidator.isAlphabetical(value, ' \'-'), validationModel, CUSTOMER_NAME, value);
		}
	});

	// Customer Area Code
	Object.defineProperty(validationModel, CUSTOMER_AREA_CODE,
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel['__' + CUSTOMER_AREA_CODE];
		},

		set: (value) =>
		{
			var isValid = (formValidator.isNumeric(value)) && (value.length === 3);

			validatorUtility.validateProperty(isValid, validationModel, CUSTOMER_AREA_CODE, value);
		}
	});

	// Customer Phone Number (the first three digits)
	Object.defineProperty(validationModel, CUSTOMER_PHONE_ONE,
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel['__' + CUSTOMER_PHONE_ONE];
		},

		set: (value) =>
		{
			var isValid = (formValidator.isNumeric(value)) && (value.length === 3);

			validatorUtility.validateProperty(isValid, validationModel, CUSTOMER_PHONE_ONE, value);
		}
	});


	// Customer Phone Number (the last four digits)
	Object.defineProperty(validationModel, CUSTOMER_PHONE_TWO,
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel['__' + CUSTOMER_PHONE_TWO];
		},

		set: (value) =>
		{
			var isValid = (formValidator.isNumeric(value)) && (value.length === 4);

			validatorUtility.validateProperty(isValid, validationModel, CUSTOMER_PHONE_TWO, value);
		}
	});

	// Customer E-mail Address
	Object.defineProperty(validationModel, CUSTOMER_EMAIL,
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel['__' + CUSTOMER_EMAIL];
		},

		set: (value) =>
		{
			validatorUtility.validateProperty(formValidator.isEmail(value), validationModel, CUSTOMER_EMAIL, value);
		}
	});

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

	validationModel.requiredProps = [CUSTOMER_NAME, CUSTOMER_AREA_CODE, CUSTOMER_PHONE_ONE, CUSTOMER_PHONE_TWO, CUSTOMER_ADDRESS,
		CUSTOMER_CITY, CUSTOMER_STATE, CUSTOMER_ZIP_CODE];

	return validationModel;
}

// ----------------- EXPORT -----------------------------

// We invoke a pseudo-constructor function here instead of the object itself because we need to generate a new instance
// of this object for every new request that necessitates the logic encapsulated within this model
module.exports = createNewModel;