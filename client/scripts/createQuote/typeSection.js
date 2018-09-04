// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createQuote/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var TYPE_SELECT = 'orderType',
	BASE_DESIGN_SECTION = 'baseDesignSection',
	ADVANCED_DESIGN_SECTION = 'advancedDesignSection',
	PICKET_SECTION = 'picketSection',
	CABLE_DESIGN_SECTION = 'cableDesignSection',
	GLASS_DESIGN_SECTION = 'glassDesignSection',

	HIDE_CLASS = 'hide',

	CABLE_TYPE = 'T-CABLE',
	GLASS_TYPE = 'T-GLASS',

	RAIL_TYPES =
	{
		'T-TRA' : true,
		'T-MOD' : true,
		'T-IRON' : true,
		'T-FENCE' : true,
		'T-GATE' : true
	};

// ----------------- PRIVATE VARIABLES ---------------------------

var _orderTypeField = document.getElementById(TYPE_SELECT),

	_baseDesignSection = document.getElementById(BASE_DESIGN_SECTION),
	_advancedDesignSection = document.getElementById(ADVANCED_DESIGN_SECTION),
	_picketSection = document.getElementById(PICKET_SECTION),
	_cableDesignSection = document.getElementById(CABLE_DESIGN_SECTION),
	_glassDesignSection = document.getElementById(GLASS_DESIGN_SECTION);

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
	}
	else if (_orderTypeField.value === CABLE_TYPE)
	{
		_baseDesignSection.classList.remove(HIDE_CLASS);
		_cableDesignSection.classList.remove(HIDE_CLASS);
	}
	else if (_orderTypeField.value === GLASS_TYPE)
	{
		_baseDesignSection.classList.remove(HIDE_CLASS);
		_glassDesignSection.classList.remove(HIDE_CLASS);
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_orderTypeField.addEventListener('change', setType);

// ----------------- DATA INITIALIZATION -----------------------------

setType({ currentTarget: _orderTypeField });