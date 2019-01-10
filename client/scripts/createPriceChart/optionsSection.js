// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createPriceChart/viewModel';
import optionVM from 'client/scripts/createPriceChart/optionViewModel';

import rQueryClient from 'client/scripts/utility/rQueryClient';
import tooltipManager from 'client/scripts/utility/tooltip';

import formValidator from 'shared/formValidator';

// ----------------- ENUMS/CONSTANTS ----------------------

var COMPANY_NAME_TEXTFIELD = 'companyName',
	ADD_NEW_PRODUCT_OPTION_LINK = 'addNewProductOptionLink',

	OPTION_NAME_FIELD = 'optionName',
	REGULAR_PRICE_FIELD = 'optionRegularPrice',
	FLAT_CURVE_PRICE_FIELD = 'optionFlatCurvePrice',
	STAIR_CURVE_PRICE_FIELD = 'optionStairCurvePrice',
	OPTION_DESCRIPTION_FIELD = 'chartOptionDescriptionField',

	OPTION_EXTRA_FIELDS = 'optionExtra',

	OPTION_TEMPLATE = 'optionTemplate',
	OPTION_EXTRA_TEMPLATE = 'chartOptionExtra';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
var _companyNameField = document.getElementById(COMPANY_NAME_TEXTFIELD),
	_addNewOptionLink = document.getElementById(ADD_NEW_PRODUCT_OPTION_LINK),

	_optionNames = document.getElementsByClassName(OPTION_NAME_FIELD),
	_regularPriceFields = document.getElementsByClassName(REGULAR_PRICE_FIELD),
	_flatCurvePriceFields = document.getElementsByClassName(FLAT_CURVE_PRICE_FIELD),
	_stairCurvePriceFields = document.getElementsByClassName(STAIR_CURVE_PRICE_FIELD),
	_optionDescriptions = document.getElementsByClassName(OPTION_DESCRIPTION_FIELD),

	_optionExtras = document.getElementsByClassName(OPTION_EXTRA_FIELDS);

// ----------------- PRIVATE FUNCTIONS ---------------------------

/**
 * Function responsible for setting IDs on the various price fields that are dynamically generated. We need this so that
 * we can properly set tooltips into place on those fields
 *
 * @author kinsho
 */
function _generateRandomFieldIDs()
{
	for (let i = 0; i < _regularPriceFields.length; i++)
	{
		// Ensure that every price field has an ID so that we can associate tooltips with these fields
		if (!(_regularPriceFields[i].id))
		{
			// A nonzero chance exists that an ID may be split across two elements. Still, I am willing to take that
			// chance as this will not fundamentally break the page
			_regularPriceFields[i].id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			_flatCurvePriceFields[i].id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			_stairCurvePriceFields[i].id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
	}
}

// ----------------- HANDLEBAR TEMPLATES ---------------------------

/**
 * The partial to render a new product offering into the price chart
 */
var productOptionTemplate = Handlebars.compile(document.getElementById(OPTION_TEMPLATE).innerHTML);

/**
 * The partial to render an additional extra feature for a product offering
 */
var optionExtraTemplate = Handlebars.compile(document.getElementById(OPTION_EXTRA_TEMPLATE).innerHTML);

// ----------------- HANDLEBAR HELPERS ---------------------------

/**
 * Handlebars helper function designed to return an empty string should the passed value be undefined
 *
 * @author kinsho
 */
Handlebars.registerHelper('transform_value_if_undefined', function(val)
{
	return ((val || val === 0) ? val : '');
});

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the company name into the view model
 *
 * @author kinsho
 */
function setCompanyName()
{
	vm.companyName = _companyNameField.value;	
}

/**
 * Listener responsible for adding/updating names for a particular product option
 *
 * @param {Event} event - the event object responsible for triggering the invocation of this function
 *
 * @author kinsho
 */
function setOptionName(event)
{
	var nameField = event.currentTarget;

	// Find which option needs to have its data updated inside the view model
	for (var i = 0; i < _optionNames.length; i++)
	{
		if (_optionNames[i].isSameNode(nameField))
		{
			break;
		}
	}

	vm.options[i].name = nameField.value;
}

/**
 * Listener responsible for adding/updating regular price rates for a particular product option
 *
 * @param {Event} event - the event object responsible for triggering the invocation of this function
 *
 * @author kinsho
 */
function setOptionRegularPrice(event)
{
	var priceField = event.currentTarget;

	// Find which option needs to have its data updated inside the view model
	for (var i = 0; i < _regularPriceFields.length; i++)
	{
		if (_regularPriceFields[i].isSameNode(priceField))
		{
			break;
		}
	}

	vm.options[i].regularPrice = priceField.value;
}

/**
 * Listener responsible for adding/updating flat curve price rates for a particular product option
 *
 * @param {Event} event - the event object responsible for triggering the invocation of this function
 *
 * @author kinsho
 */
function setOptionFlatCurvePrice(event)
{
	var priceField = event.currentTarget;

	// Find which option needs to have its data updated inside the view model
	for (var i = 0; i < _flatCurvePriceFields.length; i++)
	{
		if (_flatCurvePriceFields[i].isSameNode(priceField))
		{
			break;
		}
	}

	vm.options[i].flatCurvePrice = priceField.value;
}

/**
 * Listener responsible for adding/updating stair curve price rates for a particular product option
 *
 * @param {Event} event - the event object responsible for triggering the invocation of this function
 *
 * @author kinsho
 */
function setOptionStairCurvePrice(event)
{
	var priceField = event.currentTarget;

	// Find which option needs to have its data updated inside the view model
	for (var i = 0; i < _stairCurvePriceFields.length; i++)
	{
		if (_stairCurvePriceFields[i].isSameNode(priceField))
		{
			break;
		}
	}

	vm.options[i].stairCurvePrice = priceField.value;
}

/**
 * Listener responsible for adding/updating option descriptive text for a particular product option
 *
 * @param {Event} event - the event object responsible for triggering the invocation of this function
 *
 * @author kinsho
 */
function setOptionDescription(event)
{
	var descField = event.currentTarget;

	// Find which option needs to have its data updated inside the view model
	for (var i = 0; i < _optionDescriptions.length; i++)
	{
		if (_optionDescriptions[i].isSameNode(descField))
		{
			break;
		}
	}

	vm.options[i].description = descField.value;
}

/**
 * Listener responsible for generating new fields where we could set up extra features on a new product option
 *
 * @param {Event} event - the event object responsible for triggering the invocation of this method
 *
 * @author kinsho
 */
function addNewOption(event)
{
	var extrasContainer = event.currentTarget.previousElement,
		newDescriptionField,
		templateElement = document.createElement('template');

	// Update the HTML with a new item listing
	templateElement.innerHTML = optionExtraTemplate({});
	extrasContainer.appendChild(templateElement.content);

	// Attach a listener to this textfield to keep track of changes made to the new field
	extrasContainer.lastElementChild.addEventListener('change', setOptionExtra);
}


/**
 * Listener responsible for removing items from the invoice
 *
 * @param {Event} event - the event responsible for triggering the calling of this function
 *
 * @author kinsho
 */
function removeItem(event)
{
	var itemRow = rQueryClient.closestElementByClass(event.currentTarget, ITEM_ROW_CLASS);

	// Find the index of the item which we need to remove
	for (var i = 0; i < _itemRows.length; i++)
	{
		if (itemRow.isSameNode(_itemRows[i]))
		{
			break;
		}
	}

	// Remove any tooltips that may be visible inside the row to be removed
	tooltipManager.closeTooltip(itemRow.getElementsByClassName(ITEM_PRICE_CLASS)[0], true);

	// Now remove the item from display
	itemRow.parentNode.removeChild(itemRow);

	// Remove the item from our internal memory as well
	vm.items.splice(i, 1);

	// Update the dynamic pricing
	_updatePrices();
}

// ----------------- DATA INITIALIZATION -----------------------------

vm.items = [];

// ----------------- LISTENER INITIALIZATION -----------------------------

_addNewRowLink.addEventListener('click', addNewRow);
_waiveTaxCheckbox.addEventListener('change', updateTaxOption);

for (let i = 0; i < _itemPrices.length; i++)
{
	_itemDescriptions[i].addEventListener('blur', setItemDescription);
	_itemPrices[i].addEventListener('blur', setItemPrice);
	_itemDeleteIcons[i].addEventListener('click', removeItem);

	// Generate an item record in our view model to reflect what is on screen on load
	vm.items.push(new itemModel(_itemDescriptions[i], _itemPrices[i]));
}

updateTaxOption();
_generateRandomPriceFieldIDs();