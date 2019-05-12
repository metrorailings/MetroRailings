// ----------------- EXTERNAL MODULES --------------------------

let _randomstring = require('randomstring'),

	dateUtility = global.OwlStakes.require('shared/dateUtility'),
	pricingData = global.OwlStakes.require('shared/pricing/pricingData'),

	ada = global.OwlStakes.require('shared/designs/ada'),
	baskets = global.OwlStakes.require('shared/designs/basketDesigns'),
	cableCaps = global.OwlStakes.require('shared/designs/cableCaps'),
	cables = global.OwlStakes.require('shared/designs/cableSizes'),
	centerDesigns = global.OwlStakes.require('shared/designs/centerDesigns'),
	collars = global.OwlStakes.require('shared/designs/collarDesigns'),
	colors = global.OwlStakes.require('shared/designs/colors'),
	glassBuilds = global.OwlStakes.require('shared/designs/glassBuilds'),
	glassTypes = global.OwlStakes.require('shared/designs/glassTypes'),
	handrailings = global.OwlStakes.require('shared/designs/handrailingDesigns'),
	picketSizes = global.OwlStakes.require('shared/designs/picketSizes'),
	picketStyles = global.OwlStakes.require('shared/designs/picketStyles'),
	postCaps = global.OwlStakes.require('shared/designs/postCapDesigns'),
	postEnds = global.OwlStakes.require('shared/designs/postEndDesigns'),
	posts = global.OwlStakes.require('shared/designs/postDesigns'),
	valences = global.OwlStakes.require('shared/designs/valenceDesigns'),
	types = global.OwlStakes.require('shared/designs/types'),

	creditCardProcessor = global.OwlStakes.require('utility/creditCardProcessor');

// ----------------- ENUM/CONSTANTS -----------------------------

const STATES = ['NJ', 'NY'],
	CITIES = ['North Plainfield', 'Watchung', 'Warren', 'Clifton', 'Passaic', 'Parsippany'],
	COMPANIES = ['Metro Railings', 'Two Kings Real Estate', 'Deck Remodelers', '', ''],
	DOMAINS = ['gmail.com', 'aol.com', 'outlook.com', 'yahoo.com'],
	STATUSES = ['prospect', 'pending', 'material', 'layout', 'welding', 'grinding', 'painting', 'install', 'closed', 'cancelled'],
	PLATFORM_TYPES = ['earth', 'cement', 'tile', 'wood', 'limestone'],

	DESIGN_TYPES =
	{
		TRADITIONAL: 'T-TRA',
		MODERN: 'T-MOD',
		HANDRAILING: 'T-HR',
		CABLE: 'T-CABLE',
		GLASS: 'T-GLASS',
		IRON: 'T-IRON',
		FENCE: 'T-FENCE',
		GATE: 'T-GATE',
		MISC: 'T-MISC'
	},

	ID =
	{
		length: 4,
		charset: 'numeric'
	},
	AREA_CODE =
	{
		length: 3,
		charset: 'numeric'
	},
	PHONE_ONE =
	{
		length: 3,
		charset: 'numeric'
	},
	PHONE_TWO =
	{
		length: 4,
		charset: 'numeric'
	},
	FIRST_NAME =
	{
		length: 6,
		charset: 'alphabetic'
	},
	LAST_NAME =
	{
		length: 4,
		charset: 'alphabetic'
	},
	ADDRESS =
	{
		length: 15,
		charset: 'alphabetic',
		capitalization: 'lowercase'
	},
	ZIP_CODE =
	{
		length: 5,
		charset: 'numeric'
	},
	EMAIL_ADDRESS =
	{
		length: 7,
		charset: 'alphanumeric'
	},

	AGREEMENT_TEXT =
	{
		length: 200,
		charset: 'alphanumeric'
	},

	TEST_CC_TOKEN = 'tok_visa';

// ----------------- PRIVATE FUNCTIONS -----------------------------

/**
 * Function randomly selects an element from a passed collection
 *
 * @param {Array<any>} collection - the collection from which to randomly pick an element
 *
 * @returns {any} - a random element from the passed collection
 *
 * @author kinsho
 */
function _randomSelect(collection)
{
	return collection[Math.floor(Math.random() * collection.length)];
}

/**
 * Function returns a random 'true' or 'false' value
 *
 * @returns {Boolean} - a randomly generated boolean
 *
 * @author kinsho
 */
function _randomBoolean()
{
	return !!(Math.round(Math.random()));
}

/**
 * Simple utility function that's to generate a fully-formed user-friendly date from a Date object
 *
 * @param {Date} date - the date to transform
 *
 * @returns {String} - the date, formatted and ready to be presented to users
 *
 * @author kinsho
 */
function _generateUserFriendlyDate(date)
{
	return dateUtility.FULL_MONTHS[date.getMonth()] + ' ' + date.getDate() + dateUtility.findOrdinalSuffix(date.getDate()) + ', ' + date.getFullYear();
}

// ----------------- MODULE DEFINITION --------------------------

/**
 * The module is a function that only accepts three parameters, one being the creation date to stamp on to the new order
 * being created, another being the modification date to apply to the order, and the last (but most important one) being
 * the status to apply to the order
 *
 * @param {String} status - the status to append to the order
 * @param {Date} dateCreatedBy - the creation date of the order
 * @param {Date} modificationDate - the date the order was last modified
 *
 * @author kinsho
 */
module.exports = async function(status, dateCreatedBy, modificationDate)
{
	let order = { design : {}, designDescription : {} },
		pricePerFoot = Math.floor(Math.random() * 70) || 75,
		length = Math.floor(Math.random() * 20) + 20,
		additionalPrice = Math.floor(Math.random() * 500),
		subTotal = length * pricePerFoot + additionalPrice,
		isTaxApplied = _randomBoolean(),
		isTariffApplied = _randomBoolean(),
		tax, tariff, orderTotal, depositAmount,

		type, post, handrailing, picketSize, picketStyle, valence, postCap, postEnd, cableSize, cableCap, glassType, glassBuild;

	// Deduce the pricing properties
	if (isTaxApplied)
	{
		tax = subTotal * pricingData.NJ_SALES_TAX_RATE;
	}
	if (isTariffApplied)
	{
		tariff = subTotal * pricingData.TARIFF_RATE;
	}
	orderTotal = subTotal + (tax || 0) + (tariff || 0);
	depositAmount = parseFloat((orderTotal / 2).toFixed(2));

	if ( !(status) )
	{
		status = _randomSelect(STATUSES);
	}

	// Figure out a valid design here
	type = _randomSelect(types.options);
	order.design.type = type.id;
	order.designDescription.type = type.description;

	post = _randomSelect(posts.options);
	handrailing = _randomSelect(handrailings.options);
	picketSize = _randomSelect(picketSizes.options);
	picketStyle = _randomSelect(picketStyles.options);
	valence = _randomSelect(valences.options);
	postEnd = _randomSelect(postEnds.options);
	postCap = _randomSelect(postCaps.options);
	cableSize = _randomSelect(cables.options);
	cableCap = _randomSelect(cableCaps.options);
	glassType = _randomSelect(glassTypes.options);
	glassBuild = _randomSelect(glassBuilds.options);

	if ((type.id === DESIGN_TYPES.TRADITIONAL) ||
		(type.id === DESIGN_TYPES.FENCE) ||
		(type.id === DESIGN_TYPES.IRON) ||
		(type.id === DESIGN_TYPES.GATE))
	{
		order.design.post = post.id;
		order.design.postCap = postCap.id;
		order.design.handrailing = handrailing.id;
		order.design.picketSize = picketSize.id;
		order.design.picketStyle = picketStyle.id;
		order.design.valence = valence.id;

		order.designDescription.post = post.description;
		order.designDescription.postEnd = postEnd.description;
		order.designDescription.handrailing = handrailing.description;
		order.designDescription.picketSize = picketSize.description;
		order.designDescription.picketStyle = picketStyle.description;
		order.designDescription.valence = valence.description;
	}
	else if (type.id === DESIGN_TYPES.MODERN)
	{
		order.design.post = post.id;
		order.design.postEnd = postEnd.id;
		order.design.handrailing = handrailing.id;
		order.design.picketSize = picketSize.id;
		order.design.picketStyle = picketStyle.id;
		order.design.valence = valence.id;

		order.designDescription.post = post.description;
		order.designDescription.postEnd = postEnd.description;
		order.designDescription.handrailing = handrailing.description;
		order.designDescription.picketSize = picketSize.description;
		order.designDescription.picketStyle = picketStyle.description;
		order.designDescription.valence = valence.description;
	}
	else if (type.id === DESIGN_TYPES.HANDRAILING)
	{
		order.design.post = post.id;
		order.design.postEnd = postEnd.id;
		order.design.handrailing = handrailing.id;

		order.designDescription.post = post.description;
		order.designDescription.postEnd = postEnd.description;
		order.designDescription.handrailing = handrailing.description;
	}
	else if (type.id === DESIGN_TYPES.CABLE)
	{
		order.design.post = post.id;
		order.design.postEnd = postEnd.id;
		order.design.handrailing = handrailing.id;
		order.design.cableSize = cableSize.id;
		order.design.cableCap = handrailing.id;

		order.designDescription.post = post.description;
		order.designDescription.postEnd = postEnd.description;
		order.designDescription.handrailing = handrailing.description;
		order.designDescription.cableSize = cableSize.description;
		order.designDescription.cableCap = handrailing.description;
	}
	else if (type.id === DESIGN_TYPES.GLASS)
	{
		order.design.post = post.id;
		order.design.postEnd = postEnd.id;
		order.design.handrailing = handrailing.id;
		order.design.glassType = glassType.id;
		order.design.glassBuild = glassBuild.id;

		order.designDescription.post = post.description;
		order.designDescription.postEnd = postEnd.description;
		order.designDescription.handrailing = handrailing.description;
		order.designDescription.glassType = glassType.description;
		order.designDescription.glassBuild = glassBuild.description;
	}

	order =
	{
		_id: parseInt(_randomstring.generate(ID)),

		dates:
		{
			created: dateCreatedBy,
			lastModified: modificationDate,
			finalized: new Date(modificationDate.getTime() + 2 * 24 * 60 * 60 * 1000),
			due: new Date(modificationDate.getTime() + 10 * 24 * 60 * 60 * 1000)
		},

		status: status,

		dimensions:
		{
			length: Math.floor(Math.random() * 20) + 20,
			finishedHeight: Math.floor(Math.random() * 20) + 10
		},

		customer:
		{
			name: _randomstring.generate(FIRST_NAME) + ' ' + _randomstring.generate(LAST_NAME),
			company: _randomSelect(COMPANIES),
			address: Math.floor(Math.random() * 100) + ' ' + _randomstring.generate(ADDRESS) + ' St.',
			email: _randomstring.generate(EMAIL_ADDRESS) + '@' + _randomSelect(DOMAINS),
			areaCode: _randomstring.generate(AREA_CODE),
			phoneOne: _randomstring.generate(PHONE_ONE),
			phoneTwo: _randomstring.generate(PHONE_TWO),
			city: _randomSelect(CITIES),
			state: _randomSelect(STATES),
			zipCode: _randomstring.generate(ZIP_CODE),
			nickname: _randomstring.generate(FIRST_NAME)
		},

		// @TODO - Add new notes

		pricing:
		{
			pricePerFoot: pricePerFoot,
			additionalPrice: additionalPrice,
			isTaxApplied: isTaxApplied,
			isTariffApplied: isTariffApplied,
			subTotal: subTotal,
			tax: tax,
			tariff: tariff,
			depositAmount: depositAmount,
			orderTotal: orderTotal
		},

		design: order.design,
		designDescription: order.designDescription,

		text:
		{
			agreement: _randomstring.generate(AGREEMENT_TEXT)
		},

		installation:
		{
			platformType: _randomSelect(PLATFORM_TYPES),
			coverPlates: _randomBoolean()
		}
	};

	return order;
};