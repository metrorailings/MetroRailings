/**
 * The view model for the design flow
 */

// ----------------- EXTERNAL MODULES --------------------------

// ----------------- ENUM/CONSTANTS -----------------------------

// ----------------- PRIVATE VARIABLES -----------------------------

// ----------------- VIEW MODEL DEFINITION -----------------------------

var viewModel = {};

// Railings Type
Object.defineProperty(viewModel, 'type',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__type;
	},

	set: (value) =>
	{
		viewModel.__type = value;
	}
});

// Post Design
Object.defineProperty(viewModel, 'post',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__post;
	},

	set: (value) =>
	{
		viewModel.__post = value;
	}
});

//
// ----------------- EXPORT -----------------------------

export default viewModel;