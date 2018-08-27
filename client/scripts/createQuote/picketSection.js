// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createQuote/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var PICKET_SIZE_SELECT = 'orderPicketSize',
	PICKET_STYLE_SELECT = 'orderPicketStyle',
	PICKET_STYLE_NOTES = 'picketStyleNotes',

	SHOW_CLASS = 'show',

	PLAIN_PICKET_STYLING_SELECTION = 'PCKT-STY-PLAIN',
	NO_PICKETS_SELECTION = 'PCKT-NONE';

// ----------------- PRIVATE VARIABLES ---------------------------

var _orderPicketField = document.getElementById(PICKET_SIZE_SELECT),
	_orderPicketStyleField = document.getElementById(PICKET_STYLE_SELECT),

	_orderPicketStyleNotes = document.getElementById(PICKET_STYLE_NOTES);

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the picket size into the view model
 *
 * @author kinsho
 */
function setPicketSize()
{
	vm.design.picket = _orderPicketField.value;

	// Disable the picket styling fields should this order not need any pickets
	if (_orderPicketField.value === NO_PICKETS_SELECTION)
	{
		_orderPicketStyleField.disabled = true;
		_orderPicketStyleNotes.disabled = true;
	}
	else
	{
		_orderPicketStyleField.disabled = false;
		_orderPicketStyleNotes.disabled = false;
	}
}

/**
 * Listener responsible for setting the picket style into the view model
 *
 * @author kinsho
 */
function setPicketStyle()
{
	vm.design.picketStyle = _orderPicketStyleField.value;

	// Determine whether to show a description field that would provide further light into the way the pickets need
	// to be styled
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
 * Listener responsible for setting notes regarding the picket styling into the view model
 *
 * @author kinsho
 */
function setPicketStyleNotes()
{
	vm.design.notes.picketStyle = _orderPicketStyleNotes.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_orderPicketField.addEventListener('change', setPicketSize);
_orderPicketStyleField.addEventListener('change', setPicketStyle);
_orderPicketStyleNotes.addEventListener('change', setPicketStyleNotes);

// ----------------- DATA INITIALIZATION -----------------------------

setPicketSize({ currentTarget: _orderPicketField });
setPicketStyle({ currentTarget: _orderPicketStyleField });
setPicketStyleNotes({ currentTarget: _orderPicketStyleNotes });