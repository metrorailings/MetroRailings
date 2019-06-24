// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderGeneral/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

const TYPE_SELECT = 'orderType',
	BASE_DESIGN_SECTION = 'baseDesignSection',
	ADVANCED_DESIGN_SECTION = 'advancedDesignSection',
	PICKET_SECTION = 'picketSection',
	CABLE_DESIGN_SECTION = 'cableDesignSection',
	GLASS_DESIGN_SECTION = 'glassDesignSection',

	DATA_GROUPING_CLASS = 'dataGrouping',
	DATA_DESCRIPTION_GROUPING_CLASS = 'dataDescriptionGrouping',

	HIDE_CLASS = 'hide',

	MODERN_TYPE = 'T-MOD',
	HANDRAILING_TYPE = 'T-HR',
	CABLE_TYPE = 'T-CABLE',
	GLASS_TYPE = 'T-GLASS',

	RAIL_TYPES =
	{
		'T-TRA' : true,
		'T-IRON' : true,
		'T-FENCE' : true,
		'T-GATE' : true
	};

// ----------------- PRIVATE VARIABLES ---------------------------

let _orderTypeField = document.getElementById(TYPE_SELECT),

	_baseDesignSection = document.getElementById(BASE_DESIGN_SECTION),
	_advancedDesignSection = document.getElementById(ADVANCED_DESIGN_SECTION),
	_picketSection = document.getElementById(PICKET_SECTION),
	_cableDesignSection = document.getElementById(CABLE_DESIGN_SECTION),
	_glassDesignSection = document.getElementById(GLASS_DESIGN_SECTION);

// ----------------- PRIVATE FUNCTIONS ---------------------------

/**
 * Function responsible for nullifying all selections for a design section that will need to be hidden
 *
 * @param {HTMLElement} section - the section from which we need to negate any selections that may have been made
 *
 * @author kinsho
 */
function _nullifySection(section)
{
	let dataGroups = [...section.getElementsByClassName(DATA_DESCRIPTION_GROUPING_CLASS), ...section.getElementsByClassName(DATA_GROUPING_CLASS)],
		inputs;

	for (let i = 0; i < dataGroups.length; i += 1)
	{
		inputs = [...dataGroups[i].getElementsByTagName('select'),
			...dataGroups[i].getElementsByTagName('input'),
			...dataGroups[i].getElementsByTagName('textarea')];

		for (let j = 0; j < inputs.length; j += 1)
		{
			// For all inputs, nullify the values as well as any descriptive text
			// Ensure that the view model is updated as well
			if ( !(inputs[j].disabled) )
			{
				inputs[j].value = '';
				inputs[j].dispatchEvent(new Event('change'));
			}
		}
	}
}

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the order type into the view model and controlling what other design fields need
 * to be displayed on the page
 *
 * @author kinsho
 */
function setType()
{
	vm.design.type = _orderTypeField.value;

	// Hide all the more specific design sections temporarily
	_baseDesignSection.classList.add(HIDE_CLASS);
	_advancedDesignSection.classList.add(HIDE_CLASS);
	_cableDesignSection.classList.add(HIDE_CLASS);
	_glassDesignSection.classList.add(HIDE_CLASS);
	_picketSection.classList.add(HIDE_CLASS);

	// Show the right design sections that pertain to the type of product being purchased
	if (RAIL_TYPES[_orderTypeField.value])
	{
		_baseDesignSection.classList.remove(HIDE_CLASS);
		_picketSection.classList.remove(HIDE_CLASS);
		_advancedDesignSection.classList.remove(HIDE_CLASS);

		_nullifySection(_cableDesignSection);
		_nullifySection(_glassDesignSection);
	}
	else if (_orderTypeField.value === MODERN_TYPE)
	{
		_baseDesignSection.classList.remove(HIDE_CLASS);
		_picketSection.classList.remove(HIDE_CLASS);

		_nullifySection(_advancedDesignSection);
		_nullifySection(_cableDesignSection);
		_nullifySection(_glassDesignSection);
	}
	else if (_orderTypeField.value === HANDRAILING_TYPE)
	{
		_baseDesignSection.classList.remove(HIDE_CLASS);

		_nullifySection(_advancedDesignSection);
		_nullifySection(_picketSection);
		_nullifySection(_cableDesignSection);
		_nullifySection(_glassDesignSection);
	}
	else if (_orderTypeField.value === CABLE_TYPE)
	{
		_baseDesignSection.classList.remove(HIDE_CLASS);
		_cableDesignSection.classList.remove(HIDE_CLASS);

		_nullifySection(_advancedDesignSection);
		_nullifySection(_picketSection);
		_nullifySection(_glassDesignSection);
	}
	else if (_orderTypeField.value === GLASS_TYPE)
	{
		_baseDesignSection.classList.remove(HIDE_CLASS);
		_glassDesignSection.classList.remove(HIDE_CLASS);

		_nullifySection(_advancedDesignSection);
		_nullifySection(_cableDesignSection);
		_nullifySection(_picketSection);
	}
	// Else assume the product will be something that falls outside the norm here and clear out all design selections
	else
	{
		_nullifySection(_baseDesignSection);
		_nullifySection(_advancedDesignSection);
		_nullifySection(_picketSection);
		_nullifySection(_cableDesignSection);
		_nullifySection(_glassDesignSection);
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_orderTypeField.addEventListener('change', setType);

// ----------------- DATA INITIALIZATION -----------------------------

setType();