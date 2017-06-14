/**
 * The validator model for a new order
 */

// ----------------- EXTERNAL MODULES --------------------------

var formValidator = global.OwlStakes.require('shared/formValidator'),
	validatorUtility = global.OwlStakes.require('validators/validatorUtility');

// ----------------- ENUM/CONSTANTS -----------------------------

var USERNAME = 'username',
	PASSWORD = 'password',
	REMEMBER_ME = 'rememberMe';

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

	// User name
	Object.defineProperty(validationModel, USERNAME,
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel['__' + USERNAME];
		},

		set: (value) =>
		{
			validatorUtility.validateProperty(formValidator.isAlphaNumeric(value, '_'), validationModel, USERNAME, value);
		}
	});

	// Password
	Object.defineProperty(validationModel, PASSWORD,
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel['__' + PASSWORD];
		},

		set: (value) =>
		{
			validatorUtility.validateProperty(formValidator.isAlphaNumeric(value, ' '), validationModel, PASSWORD, value);
		}
	});

	// Remember Me Flag
	Object.defineProperty(validationModel, REMEMBER_ME,
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel['__' + REMEMBER_ME];
		},

		set: (value) =>
		{
			var isValid = ((value === true) || (value === false));

			validatorUtility.validateProperty(isValid, validationModel, REMEMBER_ME, value);
		}
	});

	// -------- Configuration -------------

	validationModel.requiredProps = [USERNAME, PASSWORD, REMEMBER_ME];

	return validationModel;
}

// ----------------- EXPORT -----------------------------

// We invoke a pseudo-constructor function here instead of the object itself because we need to generate a new instance
// of this object for every new request that necessitates the logic encapsulated within this model
module.exports = createNewModel;