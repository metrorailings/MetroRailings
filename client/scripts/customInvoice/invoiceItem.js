/**
 * The validation model for invoice items
 */

// ----------------- EXTERNAL MODULES --------------------------

import formValidator from 'shared/formValidator';

import rQueryClient from 'client/scripts/utility/rQueryClient';

// ----------------- ENUM/CONSTANTS -----------------------------

var ERROR =
	{
		PRICE_INVALID: 'Please enter only a dollar amount here.'
	};

// ----------------- PRIVATE FUNCTIONS -----------------------------

/**
 * Function that validates this particular model
 *
 * @param {Object} validationModel - the model to set
 * @author kinsho
 */
function _validate(validationModel)
{
	validationModel.validItem = ((rQueryClient.validateModel(validationModel, validationModel.validationSet)) &&
		(validationModel.description) &&
		(validationModel.price >= 0));
}

// ----------------- VIEW MODEL DEFINITION -----------------------------

/**
 * Function responsible for producing a new instance of this validation model
 *
 * @param {DOMElement} descriptionField - the HTML field storing the item description
 * @param {DOMElement} priceField - the HTML field storing the price for this particular item
 * 
 * @returns {validationModel} - the new instance of the model
 *
 * @author kinsho
 */
function createNewModel(descriptionField, priceField)
{
	var validationModel = this;

	validationModel.validationSet = new Set();

	// Item description
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

	// Item price
	Object.defineProperty(validationModel, 'price',
	{
		configurable: false,
		enumerable: true,

		get: () =>
		{
			return validationModel.__price;
		},

		set: (value) =>
		{
			var isValid = formValidator.isNumeric(value + '', '.');

			rQueryClient.updateValidationOnField(!(isValid), priceField, ERROR.PRICE_INVALID, validationModel.validationSet);
			validationModel.__price = (isValid ? window.parseFloat(value) : 0);

			rQueryClient.setField(priceField, value, validationModel.validationSet);
			_validate(validationModel);
		}
	});

	// Validity Flag
	Object.defineProperty(validationModel, 'validItem',
	{
		configurable: false,
		enumerable: false,

		get: () =>
		{
			return validationModel.__validItem;
		},

		set: (value) =>
		{
			validationModel.__validItem = value;
		}
	});

	// Instantiate model properties with either preset values or empty values
	validationModel.description = descriptionField.value || '';
	validationModel.price = priceField.value || 0;
	_validate(validationModel);

	return validationModel;
}

// ----------------- EXPORT -----------------------------

// We invoke a pseudo-constructor function here instead of the object itself because we need to generate a new instance
// of this model for every new item that is generated on the page
export default createNewModel;