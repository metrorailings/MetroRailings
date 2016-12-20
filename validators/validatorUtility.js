/**
 * A simple utility module that will assist in building and verifying validation models
 */

// ----------------- MODULE DEFINITION -----------------------------

module.exports =
{
	/**
	 * Function constructs a generic validation model with basic properties that will be used
	 * to determine the validity of the model
	 *
	 * Keep in mind that this function is only meant to be invoked with the "new" operator
	 *
	 * @author kinsho
	 */
	generateValidationModel: function()
	{
		// The array of properties that have to be populated for the model to be considered valid
		Object.defineProperty(this, 'requiredProps',
		{
			configurable: false,
			enumerable: true,

			get: () =>
			{
				return this.__requiredProps;
			},

			set: (value) =>
			{
				this.__requiredProps = value;
			}
		});

		// The validation set that will be used to highlight that one or more properties within
		// the model has been just recently passed an invalid value
		Object.defineProperty(this, 'validationSet',
		{
			configurable: false,
			enumerable: true,

			get: () =>
			{
				return this.__validationSet;
			},

			set: (value) =>
			{
				this.__validationSet = value;
			}
		});

		// Initialize the new model
		this.requiredProps = [];
		this.validationSet = {};
	},

	/**
	 * Function validates the validation model
	 *
	 * @param {ValidationModel} validationModel - the model to check
	 *
	 * @returns {boolean} - indicating whether the model is indeed valid
	 *
	 * @author kinsho
	 */
	checkModel: function(validationModel)
	{
		var propValue,
			i;

		// If the invalid flag has been raised, return a false value to indicate that model
		// is not valid
		if (Object.keys(validationModel.validationSet).length)
		{
			return false;
		}

		// If any of the required properties are empty, return a false value to indicate that
		// model is not valid
		for (i = validationModel.requiredProps.length - 1; i >= 0; i--)
		{
			propValue = validationModel[validationModel.requiredProps[i]];
			if (!propValue && propValue !== false)
			{
				return false;
			}
		}

		// The model has been validated
		return true;
	},

	/**
	 * Function properly sets a value into the model should the property be marked as valid
	 * It will also update the model's interior validation tracking appropriately
	 *
	 * @param {boolean} isValid - a flag indicating whether the passed value is valid
	 * @param {ValidationModel} - the validation model that's having one of its properties tested
	 * @param {String} propertyName - the name of the property being tested
	 * @param {any} value - the value to set within the validation model should it be marked as valid
	 *
	 * @author kinsho
	 */
	validateProperty: function(isValid, model, propertyName, value)
	{
		value = (value && value.trim ? value.trim() : value);

		if (isValid)
		{
			model['__' + propertyName] = value;
			delete model.validationSet[propertyName];
		}
		else
		{
			model.validationSet[propertyName] = true;
		}
	}
}