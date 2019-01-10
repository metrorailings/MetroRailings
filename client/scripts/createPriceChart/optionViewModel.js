/**
 * The validation model for price chart options
 */

// ----------------- EXTERNAL MODULES --------------------------

import formValidator from 'shared/formValidator';

import rQueryClient from 'client/scripts/utility/rQueryClient';

// ----------------- ENUM/CONSTANTS -----------------------------

var NAME_FIELD = 'optionName',
	REGULAR_PRICE_FIELD = 'optionRegularPrice',
	FLAT_CURVE_PRICE_FIELD = 'optionFlatCurvePrice',
	STAIR_CURVE_PRICE_FIELD = 'optionStairCurvePrice',

	DESCRIPTION_FIELD = 'chartOptionDescriptionField',

	ERROR =
	{
		PRICE_INVALID: 'Please enter only a dollar amount here.'
	};

// ----------------- PRIVATE FUNCTIONS -----------------------------

/**
 * Function that validates this particular model
 *
 * @param {Object} validationModel - the model to set
 *
 * @author kinsho
 */
function _validate(validationModel)
{
	validationModel.validOption = ((rQueryClient.validateModel(validationModel, validationModel.validationSet)) &&
		(validationModel.name) &&
		(validationModel.description) &&
		(validationModel.regularPrice >= 0));
}

// ----------------- VIEW MODEL DEFINITION -----------------------------

/**
 * Function responsible for producing a new instance of this validation model
 *
 * @param {HTMLElement} optionSection - the HTML of the new option being introduced into the page
 *
 * @returns {validationModel} - the new instance of the model
 *
 * @author kinsho
 */
function createNewModel(optionSection)
{
	var validationModel = this,
		nameField = optionSection.getElementsByClassName(NAME_FIELD)[0],
		regularPriceField = optionSection.getElementsByClassName(REGULAR_PRICE_FIELD)[0],
		flatCurveField = optionSection.getElementsByClassName(FLAT_CURVE_PRICE_FIELD)[0],
		stairCurveField = optionSection.getElementsByClassName(STAIR_CURVE_PRICE_FIELD)[0],
		descriptionField = optionSection.getElementsByClassName(DESCRIPTION_FIELD)[0];

	validationModel.validationSet = new Set();

	// Option name
	Object.defineProperty(validationModel, 'name',
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel.__name;
		},

		set: (value) =>
		{
			// Ensure that the value does not simply consist of spaces
			value = (value.trim() ? value : '');
			validationModel.__name = value;

			rQueryClient.setField(nameField, value, validationModel.validationSet);
			_validate(validationModel);
		}
	});

	// Regular price rate
	Object.defineProperty(validationModel, 'regularPrice',
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel.__regularPrice;
		},

		set: (value) =>
		{
			var isValid = formValidator.isNumeric(value + '', '.');

			rQueryClient.updateValidationOnField(!(isValid), regularPriceField, ERROR.PRICE_INVALID, validationModel.validationSet);
			validationModel.__regularPrice = (isValid ? window.parseFloat(value) : 0);

			rQueryClient.setField(regularPriceField, value, validationModel.validationSet);
			_validate(validationModel);
		}
	});

	// Flat curve price rate
	Object.defineProperty(validationModel, 'flatCurvePrice',
	{
		configurable: false,
		enumerable: false,

		get: () =>
		{
			return validationModel.__flatCurvePrice;
		},

		set: (value) =>
		{
			var isValid = formValidator.isNumeric(value + '', '.');

			rQueryClient.updateValidationOnField(!(isValid), flatCurveField, ERROR.PRICE_INVALID, validationModel.validationSet);
			validationModel.__flatCurvePrice = (isValid ? window.parseFloat(value) : 0);

			rQueryClient.setField(regularPriceField, value, validationModel.validationSet);
			_validate(validationModel);
		}
	});

	// Stair curve price rate 
	Object.defineProperty(validationModel, 'stairCurvePrice',
	{
		configurable: false,
		enumerable: false,

		get: () =>
		{
			return validationModel.__stairCurvePrice;
		},

		set: (value) =>
		{
			var isValid = formValidator.isNumeric(value + '', '.');

			rQueryClient.updateValidationOnField(!(isValid), stairCurveField, ERROR.PRICE_INVALID, validationModel.validationSet);
			validationModel.__stairCurvePrice = (isValid ? window.parseFloat(value) : 0);

			rQueryClient.setField(stairCurveField, value, validationModel.validationSet);
			_validate(validationModel);
		}
	});

	// Description
	Object.defineProperty(validationModel, 'description',
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel.__description;
		},

		set: (value) =>
		{
			// Ensure that the value does not simply consist of spaces
			value = (value.trim() ? value : '');
			validationModel.__description = value;

			rQueryClient.setField(descriptionField, value, validationModel.validationSet);
			_validate(validationModel);
		}
	});

	// Extras
	Object.defineProperty(validationModel, 'extras',
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel.__extras;
		},

		set: (value) =>
		{
			validationModel.__extras = value;
		}
	});

	// Images
	Object.defineProperty(validationModel, 'images',
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel.__images;
		},

		set: (value) =>
		{
			validationModel.__images = value;
		}
	});

	// Instantiate model properties with either preset values or empty values
	validationModel.name = nameField.value || '';
	validationModel.regularPrice = regularPriceField.value || 0;
	validationModel.flatCurvePrice = flatCurveField.value || 0;
	validationModel.stairCurvePrice = stairCurveField.value || 0;
	validationModel.description = descriptionField.value || '';
	_validate(validationModel);

	return validationModel;
}

// ----------------- EXPORT -----------------------------

// We invoke a pseudo-constructor function here instead of the object itself because we need to generate a new instance
// of this model for every new item that is generated on the page
export default createNewModel;