// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createQuote/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var PICKET_STYLE_SELECT = 'orderPicketStyle',
	CENTER_DESIGN_SELECT = 'orderCenterDesign',
	COLLARS_SELECT = 'orderCollars',
	BASKETS_SELECT = 'orderBaskets',
	VALENCES_SELECT = 'orderValence',

	PICKET_STYLE_NOTES = 'picketStyleNotes',

	SHOW_CLASS = 'show',
	PLAIN_PICKET_STYLING_SELECTION = 'PCKT-STY-PLAIN';

// ----------------- PRIVATE VARIABLES ---------------------------

var _orderPicketStyleField = document.getElementById(PICKET_STYLE_SELECT),
	_orderCenterDesignField = document.getElementById(CENTER_DESIGN_SELECT),
	_orderCollarsField = document.getElementById(COLLARS_SELECT),
	_orderBasketsField = document.getElementById(BASKETS_SELECT),
	_orderValenceField = document.getElementById(VALENCES_SELECT),

	_orderPicketStyleNotes = document.getElementById(PICKET_STYLE_NOTES);

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the picket style into the view model
 *
 * @author kinsho
 */
function setPicketStyle()
{
	vm.design.picketStyle = _orderPicketStyleField.value;

	if (_orderPicketStyleField.value === PLAIN_PICKET_STYLING_SELECTION)
	{
		_orderPicketStyleNotes.classList.remove(SHOW_CLASS);
	}
	else
	{
		_orderPicketStyleNotes.classList.add(SHOW_CLASS);
	}
}

/**
 * Listener responsible for setting notes about the picket styling into the view model
 *
 * @author kinsho
 */
function setPicketStyleNotes()
{
	vm.design.notes.picketStyle = _orderPicketStyleNotes.value;
}

/**
 * Listener responsible for setting the center design into the view model
 *
 * @author kinsho
 */
function setCenterDesign()
{
	vm.design.center = _orderCenterDesignField.value;
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

_orderPicketStyleField.addEventListener('change', setPicketStyle);
_orderPicketStyleNotes.addEventListener('change', setPicketStyleNotes);
_orderCenterDesignField.addEventListener('change', setCenterDesign);
_orderCollarsField.addEventListener('change', setCollars);
_orderBasketsField.addEventListener('change', setBaskets);

// ----------------- DATA INITIALIZATION -----------------------------

setPicketStyle({ currentTarget: _orderPicketStyleField });
setCenterDesign({ currentTarget: _orderCenterDesignField });
setCollars({ currentTarget: _orderCollarsField });
setBaskets({ currentTarget: _orderBasketsField });
setValence({ currentTarget: _orderValenceField });