// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createPriceChart/viewModel';
import optionVM from 'client/scripts/createPriceChart/optionViewModel';

import rQueryClient from 'client/scripts/utility/rQueryClient';
import tooltipManager from 'client/scripts/utility/tooltip';
import confirmationModal from 'client/scripts/utility/confirmationModal';

import formValidator from 'shared/formValidator';

// ----------------- ENUMS/CONSTANTS ----------------------

var COMPANY_NAME_TEXTFIELD = 'companyName',
	ADD_NEW_PRODUCT_OPTION_LINK = 'addNewProductOptionLink',

	OPTION_GROUP = 'chartOptionGroup',

	OPTION_NAME_FIELD = 'optionName',
	REGULAR_PRICE_FIELD = 'optionRegularPrice',
	FLAT_CURVE_PRICE_FIELD = 'optionFlatCurvePrice',
	STAIR_CURVE_PRICE_FIELD = 'optionStairCurvePrice',
	OPTION_DESCRIPTION_FIELD = 'chartOptionDescriptionField',

	OPTION_EXTRA_FIELDS = 'optionExtra',

	OPTION_TEMPLATE = 'optionTemplate',
	OPTION_EXTRA_TEMPLATE = 'chartOptionExtra',

	OPTION_EXIT_BUTTON = 'chartOptionExitButton',

	FADE_OUT_CLASS = 'fadeOut',
	HEIGHT_ZERO_CLASS = 'heightZero',
	REMOVE_OPTION_CONFIRMATION = 'Are you sure you want to remove ::name as a product offering on this price chart?';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
var _companyNameField = document.getElementById(COMPANY_NAME_TEXTFIELD),
	_addNewOptionLink = document.getElementById(ADD_NEW_PRODUCT_OPTION_LINK),

	_options = document.getElementsByClassName(OPTION_GROUP),
	_optionNames = document.getElementsByClassName(OPTION_NAME_FIELD),
	_regularPriceFields = document.getElementsByClassName(REGULAR_PRICE_FIELD),
	_flatCurvePriceFields = document.getElementsByClassName(FLAT_CURVE_PRICE_FIELD),
	_stairCurvePriceFields = document.getElementsByClassName(STAIR_CURVE_PRICE_FIELD),
	_optionDescriptions = document.getElementsByClassName(OPTION_DESCRIPTION_FIELD),

	_optionExitButtons = document.getElementsByClassName(OPTION_EXIT_BUTTON),
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
	var nameField = event.currentTarget,
		// Find which option needs to have its data updated inside the view model
		index = rQueryClient.findNodeIndexInCollection(nameField, _optionNames);


	vm.options[index].name = nameField.value;
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
	var priceField = event.currentTarget,
		// Find which option needs to have its data updated inside the view model
		index = rQueryClient.findNodeIndexInCollection(priceField, _regularPriceFields);

	vm.options[index].regularPrice = priceField.value;
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
	var priceField = event.currentTarget,
		// Find which option needs to have its data updated inside the view model
		index = rQueryClient.findNodeIndexInCollection(priceField, _flatCurvePriceFields);

	vm.options[index].flatCurvePrice = priceField.value;
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
	var priceField = event.currentTarget,
		// Find which option needs to have its data updated inside the view model
		index = rQueryClient.findNodeIndexInCollection(priceField, _stairCurvePriceFields);

	vm.options[index].stairCurvePrice = priceField.value;
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
	var descField = event.currentTarget,
		// Find which option needs to have its data updated inside the view model
		index = rQueryClient.findNodeIndexInCollection(descField, _optionDescriptions);

	vm.options[index].description = descField.value;
}

/**
 * Listener responsible for generating new fields where we could set up extra features on a new product option
 *
 * @param {Event} event - the event object responsible for triggering the invocation of this method
 *
 * @author kinsho
 */
function addNewOptionExtraHTML(event)
{
	var extrasContainer = event.currentTarget.previousElement,
		templateElement = document.createElement('template');

	// Update the HTML with a new item listing
	templateElement.innerHTML = optionExtraTemplate({});
	extrasContainer.appendChild(templateElement.content);

	// Attach a listener to this textfield to keep track of changes made to the new field
	extrasContainer.lastElementChild.addEventListener('change', addOptionExtra);
}

/**
 * Listener responsible for setting the extra features associated with a new option into the view model
 *
 * @param {Event} event - the event responsible for triggering the calling of this function
 *
 * @author kinsho
 */
function addOptionExtra(event)
{
	var extrasField = event.currentTarget,
		allOptionExtras = extrasField.parentNode.childNodes,
		optionGrouping = rQueryClient.closestElementByClass(OPTION_GROUP),
		// Find which extra is being changed here
		extrasIndex = rQueryClient.findNodeIndexInCollection(extrasField, allOptionExtras),
		// Find which option needs to have its data updated inside the view model
		optionIndex = rQueryClient.findNodeIndexInCollection(optionGrouping, _options);

	vm.options[optionIndex].extras[extrasIndex] = extrasField.value;
}

/**
 * Listener responsible for removing options from the custom price chart
 *
 * @param {Event} event - the event responsible for triggering the calling of this function
 *
 * @author kinsho
 */
function removeOption(event)
{
	var optionListing = event.currentTarget.parentNode,
		index = rQueryClient.findNodeIndexInCollection(optionListing, _options),
		callbackFunction = function()
		{
			// Remove the option from the view model
			vm.options.splice(index, 1);

			// Even trickier, remove the option from view by fading out the option first
			optionListing.addEventListener('transitionend', () =>
			{
				optionListing.addEventListener('transitionend', () =>
				{
					optionListing.parentNode.removeChild(optionListing);
				});

				optionListing.classList.add(HEIGHT_ZERO_CLASS);
			});

			optionListing.classList.add(FADE_OUT_CLASS);
		}

	// If data has been set inside the option, generate a confirmation modal to ensure that we want to do this
	if (vm.options[i].name)
	{
		confirmationModal.open(REMOVE_OPTION_CONFIRMATION, callbackFunction);
	}
	else
	{
		callbackFunction();
	}
}

/**
 * Listener responsible for adding an empty option to the custom price chart
 *
 * @param {Event} event - the event responsible for triggering the calling of this function
 *
 * @author kinsho
 */
function addOptionHTML()
{
	var templateElement = document.createElement('template');

	// Update the HTML with a new item listing
	templateElement.innerHTML = productOptionTemplate({});
	extrasContainer.appendChild(templateElement.content);
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