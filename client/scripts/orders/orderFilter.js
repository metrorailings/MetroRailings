// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orders/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

var OPEN_STATUS = 'open',

	STATUS_FILTER_CLASS = 'statusFilter',
	REVEAL_CLASS = 'reveal',

	SEARCH_FILTER = 'searchFilterTextfield',
	RESET_SEARCH_ICON = 'resetSearch';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
var _searchFilter = document.getElementById(SEARCH_FILTER),
	_resetSearch = document.getElementById(RESET_SEARCH_ICON);

// ----------------- PRIVATE FUNCTIONS ---------------------------

// ----------------- LISTENERS ---------------------------

/**
 * Function meant to empty out whatever has been typed into the search filter
 *
 * @author kinsho
 */
function emptySearchFilter()
{
	// Only execute the logic inside this function if the search icon is currently visible
	if (_resetSearch.classList.contains(REVEAL_CLASS))
	{
		vm.searchFilter = '';
	}
}

/**
 * Function meant to set the search filter into the view model
 *
 * @author kinsho
 */
function setSearchFilter()
{
	vm.searchFilter = _searchFilter.value;
}

/**
 * Function meant to set the status filter into the view model
 *
 * @param {Event} event - the event associated with the firing of this listener
 *
 * @author kinsho
 */
function setStateFilter(event)
{
	vm.statusFilter = event.currentTarget.dataset.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

var statusFilters = document.getElementsByClassName(STATUS_FILTER_CLASS),
	i;

for (i = 0; i < statusFilters.length; i++)
{
	statusFilters[i].addEventListener('click', setStateFilter);
}

// Set up all search filter related listeners
document.getElementById(SEARCH_FILTER).addEventListener('input', setSearchFilter);
_resetSearch.addEventListener('click', emptySearchFilter);

// ----------------- DATA INITIALIZATION -----------------------------

// Set the filters with default values
vm.statusFilter = OPEN_STATUS;
vm.searchFilter = '';