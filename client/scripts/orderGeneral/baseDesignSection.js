// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderGeneral/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var TYPE_SELECT = 'orderType',
	POST_DESIGN_SELECT = 'orderPost',
	HANDRAILING_SELECT = 'orderHandrailing',
	POST_END_SELECT = 'orderPostEnd',
	POST_CAP_SELECT = 'orderPostCap',
	ADA_SELECT = 'orderAda',
	COLOR_SELECT = 'orderColor',

	OTHER_COLOR_TEXTFIELD = 'otherColor',

	OTHER_VALUE_FIELD_CLASS = 'otherTextfield',
	SHOW_CLASS = 'show',

	OTHER_SELECTION = 'OTHER';

// ----------------- PRIVATE VARIABLES ---------------------------

var _orderTypeField = document.getElementById(TYPE_SELECT),
	_orderPostDesignField = document.getElementById(POST_DESIGN_SELECT),
	_orderHandrailingField = document.getElementById(HANDRAILING_SELECT),
	_orderPostEndField = document.getElementById(POST_END_SELECT),
	_orderPostCapField = document.getElementById(POST_CAP_SELECT),
	_orderAdaField = document.getElementById(ADA_SELECT),
	_orderColorField = document.getElementById(COLOR_SELECT),

	_otherColorField = document.getElementById(OTHER_COLOR_TEXTFIELD);

// ----------------- PRIVATE METHODS ---------------------------

/**
 * Function meant to show the 'Other' field to allow the user to put in unlisted values for any design option
 *
 * @param {DOMElement} element - the element which to examine to determine if its companion 'Other' textfield should
 * 		be shown or hidden
 *
 * @author kinsho
 */
function _toggleOtherFieldVisibility(element)
{
	var otherField = element.nextSibling;

	// Only consider toggling the visibility of the companion 'Other' textfield if we are dealing with the select
	// dropdown here
	if ( !(element.classList.contains(OTHER_VALUE_FIELD_CLASS)) )
	{
		if (element.value === OTHER_SELECTION)
		{
			otherField.classList.add(SHOW_CLASS);
		}
		else
		{
			otherField.classList.remove(SHOW_CLASS);
		}
	}
}

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the order type into the view model
 *
 * @author kinsho
 */
function setType()
{
	vm.design.type = _orderTypeField.value;
}

/**
 * Listener responsible for setting the post design into the view model
 *
 * @author kinsho
 */
function setPostDesign()
{
	vm.design.post = _orderPostDesignField.value;
}

/**
 * Listener responsible for setting the handrailing type into the view model
 *
 * @author kinsho
 */
function setHandrailing()
{
	vm.design.handrailing = _orderHandrailingField.value;
}

/**
 * Listener responsible for setting the post end design into the view model
 *
 * @author kinsho
 */
function setPostEnd()
{
	vm.design.postEnd = _orderPostEndField.value;
}

/**
 * Listener responsible for setting the post cap design into the view model
 *
 * @author kinsho
 */
function setPostCap()
{
	vm.design.postCap = _orderPostCapField.value;
}

/**
 * Listener responsible for setting the type of ADA handrail into the view model
 *
 * @author kinsho
 */
function setADA()
{
	vm.design.ada = _orderAdaField.value;
}

/**
 * Listener responsible for setting the order color into the view model
 *
 * @author kinsho
 */
function setColor()
{
	vm.design.color = (_orderColorField.value === OTHER_SELECTION ? _otherColorField.value : _orderColorField.value);

	_toggleOtherFieldVisibility(_orderColorField);
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_orderTypeField.addEventListener('change', setType);
_orderPostDesignField.addEventListener('change', setPostDesign);
_orderHandrailingField.addEventListener('change', setHandrailing);
_orderPostEndField.addEventListener('change', setPostEnd);
_orderPostCapField.addEventListener('change', setPostCap);
_orderColorField.addEventListener('change', setColor);
_orderAdaField.addEventListener('change', setADA);

_otherColorField.addEventListener('change', setColor);

// ----------------- DATA INITIALIZATION -----------------------------

setType();
setPostDesign();
setHandrailing();
setPostEnd();
setPostCap();
setADA();

setColor();