// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderDetails/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var POST_DESIGN_SELECT = 'orderPost',
	OTHER_POST_DESIGN_TEXTFIELD = 'otherPost',
	POST_END_SELECT = 'orderPostEnd',
	OTHER_POST_END_TEXTFIELD = 'otherPostEnd',
	POST_CAP_SELECT = 'orderPostCap',
	OTHER_POST_CAP_TEXTFIELD = 'otherPostCap',
	CENTER_DESIGN_SELECT = 'orderCenterDesign',
	OTHER_CENTER_DESIGN_TEXTFIELD = 'otherCenterDesign',
	ORDER_COLOR_SELECT = 'orderColor',
	OTHER_COLOR_TEXTFIELD = 'otherColor',

	OTHER_SELECTION = 'OTHER';

// ----------------- PRIVATE VARIABLES ---------------------------

var _orderPostDesignField = document.getElementById(POST_DESIGN_SELECT),
	_otherPostDesignField = document.getElementById(OTHER_POST_DESIGN_TEXTFIELD),
	_orderPostEndField = document.getElementById(POST_END_SELECT),
	_otherPostEndField = document.getElementById(OTHER_POST_END_TEXTFIELD),
	_orderPostCapField = document.getElementById(POST_CAP_SELECT),
	_otherPostCapField = document.getElementById(OTHER_POST_CAP_TEXTFIELD),
	_orderCenterDesignField = document.getElementById(CENTER_DESIGN_SELECT),
	_otherCenterDesignField = document.getElementById(OTHER_CENTER_DESIGN_TEXTFIELD),
	_orderColorField = document.getElementById(ORDER_COLOR_SELECT),
	_otherColorField = document.getElementById(OTHER_COLOR_TEXTFIELD);

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the post design into the view model
 *
 * @author kinsho
 */
function setPostDesign()
{
	// If the 'other' selection is specified, look towards the textfield that allows to write custom values
	if (_orderPostDesignField.value !== OTHER_SELECTION)
	{
		vm.postDesign = _orderPostDesignField.value;
	}
	else
	{
		vm.postDesign = _otherPostDesignField.value;
	}
}

/**
 * Listener responsible for setting the post end design into the view model
 *
 * @author kinsho
 */
function setPostEnd()
{
	// If the 'other' selection is specified, look towards the textfield that allows to write custom values
	if (_orderPostEndField.value !== OTHER_SELECTION)
	{
		vm.postEnd = _orderPostEndField.value;
	}
	else
	{
		vm.postEnd = _otherPostEndField.value;
	}
}

/**
 * Listener responsible for setting the post cap design into the view model
 *
 * @author kinsho
 */
function setPostCap()
{
	// If the 'other' selection is specified, look towards the textfield that allows to write custom values
	if (_orderPostCapField.value !== OTHER_SELECTION)
	{
		vm.postCap = _orderPostCapField.value;
	}
	else
	{
		vm.postCap = _otherPostCapField.value;
	}
}

/**
 * Listener responsible for setting the center design into the view model
 *
 * @author kinsho
 */
function setCenterDesign()
{
	// If the 'other' selection is specified, look towards the textfield that allows to write custom values
	if (_otherCenterDesignField.value !== OTHER_SELECTION)
	{
		vm.centerDesign = _orderCenterDesignField.value;
	}
	else
	{
		vm.centerDesign = _otherCenterDesignField.value;
	}
}

/**
 * Listener responsible for setting the order color into the view model
 *
 * @author kinsho
 */
function setColor()
{
	// If the 'other' selection is specified, look towards the textfield that allows to write custom values
	if (_otherColorField.value !== OTHER_SELECTION)
	{
		vm.color = _orderColorField.value;
	}
	else
	{
		vm.color = _otherColorField.value;
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_orderPostDesignField.addEventListener('change', setPostDesign);
_orderPostEndField.addEventListener('change', setPostEnd);
_orderPostCapField.addEventListener('change', setPostCap);
_orderCenterDesignField.addEventListener('change', setCenterDesign);
_orderColorField.addEventListener('change', setColor);

_otherPostDesignField.addEventListener('change', setPostDesign);
_otherPostEndField.addEventListener('change', setPostEnd);
_otherPostCapField.addEventListener('change', setPostCap);
_otherCenterDesignField.addEventListener('change', setCenterDesign);
_otherColorField.addEventListener('change', setColor);