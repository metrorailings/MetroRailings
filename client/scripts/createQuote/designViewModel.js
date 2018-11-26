/**
 * The view model for the design database model
 */

function generateViewModel()
{
	var viewModel = {},
		keys;

	// Type
	Object.defineProperty(viewModel, 'type',
	{
		configurable: true,
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

	// Post Type/Size
	Object.defineProperty(viewModel, 'post',
	{
		configurable: true,
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

	// Handrailing
	Object.defineProperty(viewModel, 'handrailing',
	{
		configurable: true,
		enumerable: true,

		get: () =>
		{
			return viewModel.__handrailing;
		},

		set: (value) =>
		{
			viewModel.__handrailing = value;
		}
	});

	// Post End
	Object.defineProperty(viewModel, 'postEnd',
	{
		configurable: true,
		enumerable: true,

		get: () =>
		{
			return viewModel.__postEnd;
		},

		set: (value) =>
		{
			viewModel.__postEnd = value;
		}
	});

	// Post Cap
	Object.defineProperty(viewModel, 'postCap',
	{
		configurable: true,
		enumerable: true,

		get: () =>
		{
			return viewModel.__postCap;
		},

		set: (value) =>
		{
			viewModel.__postCap = value;
		}
	});

	// Color
	Object.defineProperty(viewModel, 'color',
	{
		configurable: true,
		enumerable: true,

		get: () =>
		{
			return viewModel.__color;
		},

		set: (value) =>
		{
			viewModel.__color = value;
		}
	});

	// Center Design
	Object.defineProperty(viewModel, 'centerDesign',
	{
		configurable: true,
		enumerable: true,

		get: () =>
		{
			return viewModel.__centerDesign;
		},

		set: (value) =>
		{
			viewModel.__centerDesign = value;
		}
	});

	// Collars
	Object.defineProperty(viewModel, 'collars',
	{
		configurable: true,
		enumerable: true,

		get: () =>
		{
			return viewModel.__collars;
		},

		set: (value) =>
		{
			viewModel.__collars = value;
		}
	});

	// Baskets
	Object.defineProperty(viewModel, 'baskets',
	{
		configurable: true,
		enumerable: true,

		get: () =>
		{
			return viewModel.__baskets;
		},

		set: (value) =>
		{
			viewModel.__baskets = value;
		}
	});

	// Valence
	Object.defineProperty(viewModel, 'valence',
	{
		configurable: true,
		enumerable: true,

		get: () =>
		{
			return viewModel.__valence;
		},

		set: (value) =>
		{
			viewModel.__valence = value;
		}
	});

	// Picket Size
	Object.defineProperty(viewModel, 'picketSize',
	{
		configurable: true,
		enumerable: true,

		get: () =>
		{
			return viewModel.__picketSize;
		},

		set: (value) =>
		{
			viewModel.__picketSize = value;
		}
	});

	// Picket Style
	Object.defineProperty(viewModel, 'picketStyle',
	{
		configurable: true,
		enumerable: true,

		get: () =>
		{
			return viewModel.__picketStyle;
		},

		set: (value) =>
		{
			viewModel.__picketStyle = value;
		}
	});

	// Cable Size
	Object.defineProperty(viewModel, 'cableSize',
	{
		configurable: true,
		enumerable: true,

		get: () =>
		{
			return viewModel.__cableSize;
		},

		set: (value) =>
		{
			viewModel.__cableSize = value;
		}
	});

	// Cable Caps
	Object.defineProperty(viewModel, 'cableCap',
	{
		configurable: true,
		enumerable: true,

		get: () =>
		{
			return viewModel.__cableCap;
		},

		set: (value) =>
		{
			viewModel.__cableCap = value;
		}
	});

	// Glass Type (type of glass railing)
	Object.defineProperty(viewModel, 'glassType',
	{
		configurable: true,
		enumerable: true,

		get: () =>
		{
			return viewModel.__glassType;
		},

		set: (value) =>
		{
			viewModel.__glassType = value;
		}
	});

	// Glass Build (the type of glass)
	Object.defineProperty(viewModel, 'glassBuild',
	{
		configurable: true,
		enumerable: true,

		get: () =>
		{
			return viewModel.__glassType;
		},

		set: (value) =>
		{
			viewModel.__glassType = value;
		}
	});

	// Initialize each enumerable property of this object, as we need to instantiate the private counterparts to the
	// public properties
	keys = Object.keys(viewModel);
	for (let i = keys.length - 1; i >= 0; i -= 1)
	{
		viewModel[keys[i]] = '';
	}

	// Prevent any properties from being added to this object, as this object is the definitive data dictionary for all
	// our design options
	viewModel = Object.seal(viewModel);

	return viewModel;
}

// ----------------- EXPORT -----------------------------

export default generateViewModel;