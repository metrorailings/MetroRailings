// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createQuote/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var GLASS_TYPE_SELECT = 'orderGlassType',
	GLASS_BUILD_SELECT = 'orderGlassBuild';

// ----------------- PRIVATE VARIABLES ---------------------------

var _orderGlassTypeField = document.getElementById(GLASS_TYPE_SELECT),
	_orderGlassBuildField = document.getElementById(GLASS_BUILD_SELECT);

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the glass type into the view model
 *
 * @author kinsho
 */
function setGlassType()
{
	vm.design.glassType = _orderGlassTypeField.value;
}

/**
 * Listener responsible for setting the glass characteristics into the view model
 *
 * @author kinsho
 */
function setGlassBuild()
{
	vm.design.glassBuild = _orderGlassBuildField.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_orderGlassTypeField.addEventListener('change', setGlassType);
_orderGlassBuildField.addEventListener('change', setGlassBuild);

// ----------------- DATA INITIALIZATION -----------------------------

setGlassType({ currentTarget: _orderGlassTypeField });
setGlassBuild({ currentTarget: _orderGlassBuildField });