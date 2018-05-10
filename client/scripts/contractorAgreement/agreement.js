// ----------------- ENUMS/CONSTANTS ----------------------

var DESCRIPTION_FIELD = 'descriptionText',
	DESCRIPTION_FIELD_CLONE_AREA = 'descriptionTextCloneSpace';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
var _descriptionField = document.getElementById(DESCRIPTION_FIELD),
	_cloneField = document.getElementById(DESCRIPTION_FIELD_CLONE_AREA);

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for expanding or shortening the height of the description field should there be an overflow
 * or reduction of text
 *
 * @author kinsho
 */
function adjustDescriptionField()
{
	_cloneField.innerHTML = _descriptionField.value;
	_descriptionField.style.height = _cloneField.scrollHeight + 'px';
}

// ----------------- LISTENER INITIALIZATION -----------------------------

// Set up the view model listeners
_descriptionField.addEventListener('keyup', adjustDescriptionField);

// ----------------- PAGE INITIALIZATION -----------------------------

adjustDescriptionField();