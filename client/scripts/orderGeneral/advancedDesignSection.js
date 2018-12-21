// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderGeneral/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var CENTER_DESIGN_SELECT = 'orderCenterDesign',
	COLLARS_SELECT = 'orderCollars',
	BASKETS_SELECT = 'orderBaskets',
	VALENCES_SELECT = 'orderValence';

// ----------------- PRIVATE VARIABLES ---------------------------

var _orderCenterDesignField = document.getElementById(CENTER_DESIGN_SELECT),
	_orderCollarsField = document.getElementById(COLLARS_SELECT),
	_orderBasketsField = document.getElementById(BASKETS_SELECT),
	_orderValenceField = document.getElementById(VALENCES_SELECT);

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the center design into the view model
 *
 * @author kinsho
 */
function setCenterDesign()
{
	vm.design.centerDesign = _orderCenterDesignField.value;
}

/**
 * Listener responsible for setting any collar selections into the view model
 *
 * @author kinsho
 */
function setCollars()
{
	vm.design.collars = _orderCollarsField.value;
}

/**
 * Listener responsible for setting any basket selections into the view model
 *
 * @author kinsho
 */
function setBaskets()
{
	vm.design.baskets = _orderBasketsField.value;
}

/**
 * Listener responsible for setting any valence selections into the view model
 *
 * @author kinsho
 */
function setValence()
{
	vm.design.valence = _orderValenceField.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_orderCenterDesignField.addEventListener('change', setCenterDesign);
_orderCollarsField.addEventListener('change', setCollars);
_orderBasketsField.addEventListener('change', setBaskets);

// ----------------- DATA INITIALIZATION -----------------------------

setCenterDesign({ currentTarget: _orderCenterDesignField });
setCollars({ currentTarget: _orderCollarsField });
setBaskets({ currentTarget: _orderBasketsField });
setValence({ currentTarget: _orderValenceField });