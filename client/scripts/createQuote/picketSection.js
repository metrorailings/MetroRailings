// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createQuote/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var PICKET_SIZE_SELECT = 'orderPicketSize',
	PICKET_STYLE_SELECT = 'orderPicketStyle',
	PICKET_STYLE_DESCRIPTION_FIELD = 'descriptiveText',

	PLAIN_PICKET_STYLING_SELECTION = 'PCKT-STY-PLAIN';

// ----------------- PRIVATE VARIABLES ---------------------------

var _orderPicketField = document.getElementById(PICKET_SIZE_SELECT),
	_orderPicketStyleField = document.getElementById(PICKET_STYLE_SELECT),

	// Also tab a reference to the description field that will be sidling the picket style dropdown
	_orderPicketStyleDescription = _orderPicketStyleField.parentElement.getElementsByClassName(PICKET_STYLE_DESCRIPTION_FIELD)[0];

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the picket size into the view model
 *
 * @author kinsho
 */
function setPicketSize()
{
	vm.design.picketSize = _orderPicketField.value;

	// Disable the picket styling fields should this order not need any pickets
	if (_orderPicketField.value === '')
	{
		_orderPicketStyleField.disabled = true;
		_orderPicketStyleDescription.disabled = true;

		_orderPicketStyleField.value = '';
		_orderPicketStyleDescription.value = '';

		// Trigger the event on the picket style field here, as we need to invoke multiple functions attached to
		// that field
		_orderPicketStyleField.dispatchEvent(new Event('change'));
	}
	else if (_orderPicketStyleField.disabled)
	{
		_orderPicketStyleField.disabled = false;
		_orderPicketStyleDescription.disabled = false;

		_orderPicketStyleField.value = PLAIN_PICKET_STYLING_SELECTION;

		// Trigger the event on the picket style field here, as we need to invoke multiple functions attached to
		// that field
		_orderPicketStyleField.dispatchEvent(new Event('change'));
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
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_orderPicketField.addEventListener('change', setPicketSize);
_orderPicketStyleField.addEventListener('change', setPicketStyle);

// ----------------- DATA INITIALIZATION -----------------------------

setPicketSize({ currentTarget: _orderPicketField });
setPicketStyle({ currentTarget: _orderPicketStyleField });