// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderGeneral/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var CABLE_SIZE_SELECT = 'orderCableSize',
	CABLE_CAP_SELECT = 'orderCableCap';

// ----------------- PRIVATE VARIABLES ---------------------------

var _orderCableSizeField = document.getElementById(CABLE_SIZE_SELECT),
	_orderCableCapField = document.getElementById(CABLE_CAP_SELECT);

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the cable size into the view model
 *
 * @author kinsho
 */
function setCableSize()
{
	vm.design.cableSize = _orderCableSizeField.value;
}

/**
 * Listener responsible for setting the color of the cable caps into the view model
 *
 * @author kinsho
 */
function setCableCap()
{
	vm.design.cableCap = _orderCableCapField.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_orderCableSizeField.addEventListener('change', setCableSize);
_orderCableCapField.addEventListener('change', setCableCap);

// ----------------- DATA INITIALIZATION -----------------------------

setCableSize();
setCableCap();