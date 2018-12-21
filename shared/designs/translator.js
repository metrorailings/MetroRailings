/**
 * A module responsible for fetching design names
 *
 * @module translator
 */

// ----------------- EXTERNAL MODULES --------------------------
// Dependencies must be pulled differently depending on whether we are pulling these files from within the server
// or within the client

var designs;

if (global.OwlStakes)
{
	designs =
	{
		types: global.OwlStakes.require('shared/designs/types'),
		posts: global.OwlStakes.require('shared/designs/postDesigns'),
		handrailings: global.OwlStakes.require('shared/designs/handrailingDesigns'),
		postCaps: global.OwlStakes.require('shared/designs/postCapDesigns'),
		postEnds: global.OwlStakes.require('shared/designs/postEndDesigns'),
		colors: global.OwlStakes.require('shared/designs/colors'),
		centerDesign: global.OwlStakes.require('shared/designs/centerDesigns'),
		collars: global.OwlStakes.require('shared/designs/collarDesigns'),
		baskets: global.OwlStakes.require('shared/designs/basketDesigns'),
		valence: global.OwlStakes.require('shared/designs/valenceDesigns'),
		picketSize: global.OwlStakes.require('shared/designs/picketSizes'),
		picketStyle: global.OwlStakes.require('shared/designs/picketStyles'),
		cableSize: global.OwlStakes.require('shared/designs/cableSizes'),
		cableCap: global.OwlStakes.require('shared/designs/cableCaps'),
		glassType: global.OwlStakes.require('shared/designs/glassTypes'),
		glassBuild: global.OwlStakes.require('shared/designs/glassBuilds'),
		ada: global.OwlStakes.require('shared/designs/ada')
	};
}
else
{
	designs =
	{
		types: require('shared/designs/types'),
		posts: require('shared/designs/postDesigns'),
		handrailings: require('shared/designs/handrailingDesigns'),
		postCaps: require('shared/designs/postCapDesigns'),
		postEnds: require('shared/designs/postEndDesigns'),
		colors: require('shared/designs/colors'),
		centerDesign: require('shared/designs/centerDesigns'),
		collars: require('shared/designs/collarDesigns'),
		baskets: require('shared/designs/basketDesigns'),
		valence: require('shared/designs/valenceDesigns'),
		picketSize: require('shared/designs/picketSizes'),
		picketStyle: require('shared/designs/picketStyles'),
		cableSize: require('shared/designs/cableSizes'),
		cableCap: require('shared/designs/cableCaps'),
		glassType: require('shared/designs/glassTypes'),
		glassBuild: require('shared/designs/glassBuilds'),
		ada: require('shared/designs/ada')
	};
}

// ----------------- INITIALIZATION LOGIC --------------------------

var designMapper = {},
	categories = Object.keys(designs),
	categoryOptions;

for (let i = 0; i < categories.length; i += 1)
{
	categoryOptions = designs[categories[i]].options;

	for (let j = 0; j < categoryOptions.length; j += 1)
	{
		designMapper[categoryOptions[j].id] = categoryOptions[j].label;
	}
}

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function that returns the design name that relates to a particular code, if such a code exists within our
	 * dictionary
	 *
	 * @param {String} designCode - the design code associated with the design that we're looking for
	 *
	 * @returns {String} - the full name of the design or the design code should there not be a name within our
	 * 		dictionary
	 *
	 * @author kinsho
	 */
	findDesignName: function(designCode)
	{
		return (designMapper[designCode] || designCode);
	}
};