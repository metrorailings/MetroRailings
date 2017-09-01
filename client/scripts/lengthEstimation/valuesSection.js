// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/lengthEstimation/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var FROM_FOOTAGE_TEXT_AREA = 'fromFootage',
	TO_FOOTAGE_TEXT_AREA = 'toFootage';

// ----------------- PRIVATE VARIABLES ---------------------------

var _fromFootageField = document.getElementById(FROM_FOOTAGE_TEXT_AREA),
	_toFootageField = document.getElementById(TO_FOOTAGE_TEXT_AREA);

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the beginning of the estimated range of length of railing needed
 *
 * @author kinsho
 */
function setFromFootage()
{
	vm.fromFeet = _fromFootageField.value;
}

/**
 * Listener responsible for setting the end of the estimated range of length of railing needed
 *
 * @author kinsho
 */
function setToFootage()
{
	vm.toFeet = _toFootageField.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_fromFootageField.addEventListener('change', setFromFootage);
_toFootageField.addEventListener('change', setToFootage);