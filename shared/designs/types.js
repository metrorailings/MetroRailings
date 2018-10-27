/**
 * A module listing important information about all the types of product we offer
 *
 * @module types
 */
// ----------------- EXTERNAL MODULES --------------------------

// ----------------- MODULE DEFINITION --------------------------

var types =
{
	options:
	[
		{
			id: 'T-TRA',
			label: 'Traditional Railings',
			technicalLabel: 'Traditional',
			spanishLabel: 'Tradicional',
			description: 'The railings will be designed in the traditional style, in that the pickets of the' +
				' railing will travel vertically.'
		},
		{
			id: 'T-MOD',
			label: 'Modern Railings',
			technicalLabel: 'Horizontal',
			spanishLabel: 'Horizontal',
			description: 'The railings will be designed in the modern style, in that the pickets of the' +
				' railing will travel horizontally.'
		},
		{
			id: 'T-CABLE',
			label: 'Stainless Steel Cable Railings',
			technicalLabel: 'Cable',
			spanishLabel: 'Cable',
			description: 'The bodies of the railings will consist of tightly-wound stainless steel cables instead of' +
				' metal pickets or channels.'
		},
		{
			id: 'T-GLASS',
			label: 'Glass Railings',
			technicalLabel: 'Glass',
			spanishLabel: 'Vidrio',
			description: 'The bodies of the railings will prominently feature glass.'
		},
		{
			id: 'T-IRON',
			label: 'Wrought Iron Railings',
			technicalLabel: 'Iron',
			spanishLabel: 'Hierro',
			description: 'The railings will be fabricated entirely from wrought-iron components and moldings.'
		},
		{
			id: 'T-FENCE',
			label: 'Fencing',
			technicalLabel: 'Fences',
			spanishLabel: 'Cerca',
			description: 'Fencing is the label we apply to any railing built taller than usual as well as any railing' +
				' that will be installed directly into the earth.'
		},
		{
			id: 'T-GATE',
			label: 'Gating',
			technicalLabel: 'Gates',
			spanishLabel: 'Puertas',
			description: 'The railings being built here will act functionally as gates responsible for opening or' +
				' closing off access to a path or entrance.'
		},
		{
			id: 'T-MISC',
			label: 'Miscellaneous',
			technicalLabel: 'Miscellaneous',
			spanishLabel: 'Diverso'
		}
	],
	designMetadata: [],
	technicalLabel: 'Product Type',
	spanishLabel: 'Tipo de Producto'
};

// ----------------- EXPORT --------------------------

module.exports = types;