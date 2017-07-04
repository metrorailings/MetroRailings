/**
 * The validator model for a customer record
 */

// ----------------- EXTERNAL MODULES --------------------------

var validatorUtility = global.OwlStakes.require('validators/validatorUtility');

// ----------------- ENUM/CONSTANTS -----------------------------

var CC_TOKEN = 'ccToken';

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

	// -------- Configuration -------------

	validationModel.requiredProps = [CC_TOKEN];

	return validationModel;
}

// ----------------- EXPORT -----------------------------

// We invoke a pseudo-constructor function here instead of the object itself because we need to generate a new instance
// of this object for every new request that necessitates the logic encapsulated within this model
module.exports = createNewModel;