/**
 * A module listing important information about all the various glass railing types
 *
 * @module glassTypes
 */
// ----------------- EXTERNAL MODULES --------------------------

// @TODO - Incorporate pricing here
// import pricing from 'shared/pricing/pricingData';

// ----------------- MODULE DEFINITION --------------------------

var glassTypes =
{
	options:
	[
		{
			id: 'GLASS-FRAME',
			label: 'Framed Glass',
			technicalLabel: 'Framed',
			spanishLabel: 'Enmarcado',
			description: 'The railings will be constructed from glass panels, each of which will be housed within' +
				' aluminum frames. Rubber gaskets will be used to prevent the glass from directly making contact' +
				' with any metal.'
		},
		{
			id: 'GLASS-FLOOR',
			label: 'Floor-Mounted Glass',
			technicalLabel: 'Floor',
			spanishLabel: 'Piso',
			description: 'The railings will be constructed from glass panels that will be inserted into floor-level' +
				' channels. These grounded channels will feature locking mechanisms that will serve to hold the' +
				' glass securely into place. Rubber gaskets will be used to hide from view the metal components' +
				' inside the channel.' 
		},
		{
			id: 'GLASS-POST',
			label: 'Post-Mounted Glass',
			technicalLabel: 'Post',
			spanishLabel: 'Poste',
			description: 'The railings will be constructed from glass panels that will be inserted between metal' +
				' posts featuring specially-engineered clamps designed to hold glass securely.'
		},
		{
			id: 'GLASS-SIDE',
			label: 'Side-Mounted Glass',
			technicalLabel: 'Side',
			spanishLabel: 'Lado',
			description: 'The railings will be constructed from glass panels that will be screwed into the side of' +
				' whatever ledges need to be railed. Specialized screws will be drilled through the glass and into' +
				' the side of the platform. Essentially, these railings are designed to be as minimal as possible,' +
				' in that the metal components supporting the glass are completely hidden from view.'
		}
	],
	designMetadata: [],
	technicalLabel: 'Glass Type',
	spanishLabel: 'Tipo de Vidrio'
};

// ----------------- EXPORT --------------------------

module.exports = glassTypes;