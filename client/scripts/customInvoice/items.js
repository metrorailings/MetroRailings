// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/customInvoice/viewModel';
import itemModel from 'client/scripts/customInvoice/invoiceItem';

import rQueryClient from 'client/scripts/utility/rQueryClient';
import tooltipManager from 'client/scripts/utility/tooltip';

import formValidator from 'shared/formValidator';

// ----------------- ENUMS/CONSTANTS ----------------------

var ADD_NEW_ROW_LINK = 'addNewItemLink',
	ITEMS_LISTING_BODY = 'itemsListing',
	WAIVE_TAX_CHECKBOX = 'waiveTaxCheckbox',

	ITEM_ROW_CLASS = 'itemRow',
	ITEM_DESCRIPTION_CLASS = 'itemDescriptionField',
	ITEM_PRICE_CLASS = 'itemPriceField',
	ITEM_REMOVE_CLASS = 'itemRemoveIcon',

	ITEM_ROW_TEMPLATE = 'itemRowTemplate';

// ----------------- PRIVATE VARIABLES ---------------------------

	// Elements
var _addNewRowLink = document.getElementById(ADD_NEW_ROW_LINK),
	_itemsListingBody = document.getElementById(ITEMS_LISTING_BODY),
	_waiveTaxCheckbox = document.getElementById(WAIVE_TAX_CHECKBOX),

	_itemRows = document.getElementsByClassName(ITEM_ROW_CLASS),
	_itemDescriptions = document.getElementsByClassName(ITEM_DESCRIPTION_CLASS),
	_itemPrices = document.getElementsByClassName(ITEM_PRICE_CLASS),
	_itemDeleteIcons = document.getElementsByClassName(ITEM_REMOVE_CLASS);

// ----------------- PRIVATE FUNCTIONS ---------------------------

/**
 * Function responsible for updating the price totals on the invoice
 *
 * @author kinsho
 */
function _updatePrices()
{
	var subtotal = 0;

	for (let i = 0; i < vm.items.length; i++)
	{
		// Ensure that the item price is valid prior to putting it into the total
		if (formValidator.isNumeric(vm.items[i].price, '.'))
		{
			subtotal += vm.items[i].price;
		}
	}

	// Update the pricing in our internal memory
	vm.subtotal = subtotal;
	vm.tax = (vm.isTaxWaived ? 0 : vm.subtotal * (window.MetroRailings.taxRate / 100));
	vm.totalPrice = subtotal + vm.tax;
}

/**
 * Function responsible for setting IDs on the various price fields
 *
 * @author kinsho
 */
function _generateRandomPriceFieldIDs()
{
	for (let i = 0; i < _itemPrices.length; i++)
	{
		// Ensure that every price field inside the invoice has an ID so that we can track tooltips attached to
		// those fields
		if (!(_itemPrices[i].id))
		{
			// A nonzero chance exists that an ID may be split across two elements. Still, I am willing to take that
			// chance as this will not fundamentally break the page
			_itemPrices[i].id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
	}
}

// ----------------- HANDLEBAR TEMPLATES ---------------------------

/**
 * The partial to render a new item row in the item table
 */
var itemRowTemplate = Handlebars.compile(document.getElementById(ITEM_ROW_TEMPLATE).innerHTML);

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
 * Listener responsible for adding/updating description information for a particular item
 *
 * @param {Event} event - the event object responsible for triggering the invocation of this function
 *
 * @author kinsho
 */
function setItemDescription(event)
{
	var itemField = event.currentTarget;

	// Find which item needs to have its data updated inside the view model
	for (var i = 0; i < _itemDescriptions.length; i++)
	{
		if (_itemDescriptions[i].isSameNode(itemField))
		{
			break;
		}
	}

	vm.items[i].description = itemField.value;
}

/**
 * Listener responsible for adding/updating pricing information for a particular item
 *
 * @param {Event} event - the event object responsible for triggering the invocation of this function
 *
 * @author kinsho
 */
function setItemPrice(event)
{
	var itemField = event.currentTarget;

	// Find which item needs to have its data updated inside the view model
	for (var i = 0; i < _itemPrices.length; i++)
	{
		if (_itemPrices[i].isSameNode(itemField))
		{
			break;
		}
	}

	vm.items[i].price = itemField.value;

	// Update the subtotal and total pricing
	_updatePrices();
}

/**
 * Listener responsible for generating a new row where we can add details for a new item
 *
 * @author kinsho
 */
function addNewRow()
{
	var newDescriptionField,
		newPriceField,
		templateElement = document.createElement('template');

	// Update the HTML with a new item listing
	templateElement.innerHTML = itemRowTemplate({});
	_itemsListingBody.appendChild(templateElement.content);

	// Generate an internal record to track the information associated with the new item listing
	newDescriptionField = _itemDescriptions[_itemDescriptions.length - 1];
	newPriceField = _itemPrices[_itemPrices.length - 1];
	vm.items.push(new itemModel(newDescriptionField, newPriceField));

	// Attach listeners to these rows to keep track of changes made to this new item
	_itemDescriptions[_itemDescriptions.length - 1].addEventListener('change', setItemDescription);
	_itemPrices[_itemPrices.length - 1].addEventListener('change', setItemPrice);
	_itemDeleteIcons[_itemDeleteIcons.length - 1].addEventListener('click', removeItem);

	// Attach an ID for the price field in the new row
	_generateRandomPriceFieldIDs();
}

/**
 * Listener responsible for noting whether tax is to be waived
 *
 * @author kinsho
 */
function updateTaxOption()
{
	vm.isTaxWaived = _waiveTaxCheckbox.checked;

	// Update pricing now that taxes were either toggled on/off
	_updatePrices();
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