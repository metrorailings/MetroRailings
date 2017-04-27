/**
 * The sub-view model for an order
 */

// ----------------- EXTERNAL MODULES --------------------------

import designCodes from 'shared/designs/designValidation';

// ----------------- VIEW MODEL DEFINITION -----------------------------

/**
 * The constructor function used to build a design model
 *
 * @param {Object} designObj - the design object to copy over into this model
 *
 * @returns {Object} - the design model studded with the getters and setters in this model
 *
 * @author kinsho
 */
function createNewModel(designObj)
{
	var designModel = {},
		keys = Object.keys(designObj),
		i;

	// Post Design
	Object.defineProperty(designModel, 'postDesign',
	{
		configurable: false,
		enumerable: false,

		get: () =>
		{
			return designModel.__postDesign;
		},

		set: (value) =>
		{
			designModel.__postDesign = designCodes.testProperty(value, designCodes.POST_OPTION_CODES);
		}
	});

	// Post End Design
	Object.defineProperty(designModel, 'postEndDesign',
	{
		configurable: false,
		enumerable: false,

		get: () =>
		{
			return designModel.__postEndDesign;
		},

		set: (value) =>
		{
			designModel.__postEndDesign = designCodes.testProperty(value, designCodes.TOP_END_CODES);
		}
	});

	// Post Cap Design
	Object.defineProperty(designModel, 'postCapDesign',
	{
		configurable: false,
		enumerable: false,

		get: () =>
		{
			return designModel.__postCapDesign;
		},

		set: (value) =>
		{
			designModel.__postCapDesign = designCodes.testProperty(value, designCodes.POST_CAP_CODES);
		}
	});

	// Center Design
	Object.defineProperty(designModel, 'centerDesign',
	{
		configurable: false,
		enumerable: false,

		get: () =>
		{
			return designModel.__centerDesign;
		},

		set: (value) =>
		{
			designModel.__centerDesign = designCodes.testProperty(value, designCodes.CENTER_DESIGN_CODES);
		}
	});

	// Now copy over the values from the passed design object into this design model
	for (i = keys.length - 1; i >= 0; i--)
	{
		designModel[keys[i]] = designObj[keys[i]];
	}

	return designModel;
}

// ----------------- EXPORT -----------------------------

export default createNewModel;