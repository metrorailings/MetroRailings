// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderGeneral/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

const COVER_PLATES_RADIO_BUTTONS = 'coverPlates',
	PLATFORM_TYPE_SELECT = 'orderPlatformType',
	FINISHED_HEIGHT_TEXTFIELD = 'finishedHeight',
	ORDER_LENGTH_TEXTFIELD = 'orderLength',
	ADDITIONAL_FEATURES_TEXTAREA = 'additionalFeatures';

// ----------------- PRIVATE VARIABLES ---------------------------

let _coverPlateButtons = document.getElementsByName(COVER_PLATES_RADIO_BUTTONS),
	_orderPlatformTypeField = document.getElementById(PLATFORM_TYPE_SELECT),

	_orderLengthField = document.getElementById(ORDER_LENGTH_TEXTFIELD),
	_finishedHeightField = document.getElementById(FINISHED_HEIGHT_TEXTFIELD),
	_additionalFeaturesField = document.getElementById(ADDITIONAL_FEATURES_TEXTAREA);

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting a flag into the view model indicating whether cover plates are necessary
 *
 * @param {Event} event - the event object associated with the firing of this listener
 *
 * @author kinsho
 */
function setCoverPlates(event)
{
	vm.coverPlates = event.currentTarget.value;
}

/**
 * Listener responsible for setting the platform type into the view model
 *
 * @author kinsho
 */
function setPlatformType()
{
	vm.platformType = _orderPlatformTypeField.value;
}

/**
 * Listener responsible for setting the order length into the view model
 *
 * @author kinsho
 */
function setLength()
{
	vm.length = _orderLengthField.value;
}

/**
 * Listener responsible for setting the finish height into the view model
 *
 * @author kinsho
 */
function setFinishedHeight()
{
	vm.finishedHeight = _finishedHeightField.value;
}

/**
 * Listener responsible for setting the text for custom features into the view model
 *
 * @author kinsho
 */
function setAdditionalDescription()
{
	vm.additionalDescription = _additionalFeaturesField.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_coverPlateButtons[0].addEventListener('change', setCoverPlates);
_coverPlateButtons[1].addEventListener('change', setCoverPlates);
_orderPlatformTypeField.addEventListener('change', setPlatformType);

_orderLengthField.addEventListener('change', setLength);
_finishedHeightField.addEventListener('change', setFinishedHeight);
_additionalFeaturesField.addEventListener('change', setAdditionalDescription);

// ----------------- DATA INITIALIZATION -----------------------------

// For the cover plates, see if a value has been set when the page was rendered
if (_coverPlateButtons[1].checked)
{
	setCoverPlates({ currentTarget: _coverPlateButtons[1] });
}
else
{
	// The 'Yes' option is checked by default
	setCoverPlates({ currentTarget: _coverPlateButtons[0] });
}

setPlatformType();
setLength();
setFinishedHeight();
setAdditionalDescription();