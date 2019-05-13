// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orders/viewModel';

// ----------------- ENUMS/CONSTANTS ---------------------------

const STATUS_FILTER_CLASS = 'statusFilter',
	GENERAL_FILTER_CLASS = 'generalFilter',
	REVEAL_CLASS = 'reveal',

	COMPANY_FILTER = 'companySelector',
	RESET_COMPANY_ICON = 'resetCompany',
	SEARCH_FILTER = 'searchFilterTextfield',
	RESET_SEARCH_ICON = 'resetSearch',

	OPEN_GENERAL_FILTER = 'open',

	HASH_LABELS =
	{
		GENERAL : 'general',
		STATUS : 'status',
		COMPANY : 'company',
		SEARCH : 'search'
	};

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
let _generalFilters = document.getElementsByClassName(GENERAL_FILTER_CLASS),
	_statusFilters = document.getElementsByClassName(STATUS_FILTER_CLASS),

	_companyFilter = document.getElementById(COMPANY_FILTER),
	_resetCompany = document.getElementById(RESET_COMPANY_ICON),
	_searchFilter = document.getElementById(SEARCH_FILTER),
	_resetSearch = document.getElementById(RESET_SEARCH_ICON);

// ----------------- PRIVATE LISTENERS ---------------------------

/**
 * Function that reads whatever filters were preset in the URL
 *
 * @author kinsho
 */
function _readFiltersFromHash()
{
	let URL = window.location.href,
		hashValues = URL.split('#')[1],
		hashPair;

	// Parse out the hash values into an array
	hashValues = (hashValues ? hashValues.split('&') : []);

	for (let i = 0; i < hashValues.length; i += 1)
	{
		hashPair = hashValues[i].split('=');

		if (HASH_LABELS.GENERAL === hashPair[0])
		{
			vm.generalFilter = hashPair[1];
		}
		else if (HASH_LABELS.STATUS === hashPair[0])
		{
			vm.statusFilter = hashPair[1];
		}
		else if (HASH_LABELS.COMPANY === hashPair[0])
		{
			vm.companyFilter = hashPair[1];
		}
		else if (HASH_LABELS.SEARCH === hashPair[0])
		{
			vm.searchFilter = hashPair[1];
		}
	}
}

// ----------------- LISTENERS ---------------------------

/**
 * Function meant to set the general filter into the view model
 *
 * @param {Event} event - the event associated with the firing of this listener
 *
 * @author kinsho
 */
function setGeneralFilter(event)
{
	vm.generalFilter = event.currentTarget.dataset.value;
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

/**
 * Function meant to set the company filter into the view model
 *
 * @author kinsho
 */
function setCompanyFilter()
{
	vm.companyFilter = _companyFilter.value;
}

/**
 * Function meant to empty out whatever has been selected into the company filter
 *
 * @author kinsho
 */
function emptyCompanyFilter()
{
	// Only execute the logic inside this function if the search icon is currently visible
	if (_resetCompany.classList.contains(REVEAL_CLASS))
	{
		vm.companyFilter = '';
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

// ----------------- LISTENER INITIALIZATION -----------------------------

for (let j = 0; j < _generalFilters.length; j += 1)
{
	_generalFilters[j].addEventListener('click', setGeneralFilter);
}

for (let i = 0; i < _statusFilters.length; i += 1)
{
	_statusFilters[i].addEventListener('click', setStateFilter);
}

// Set up all search/company filter related listeners
_companyFilter.addEventListener('change', setCompanyFilter);
_resetCompany.addEventListener('click', emptyCompanyFilter);
_searchFilter.addEventListener('input', setSearchFilter);
_resetSearch.addEventListener('click', emptySearchFilter);

// ----------------- DATA INITIALIZATION -----------------------------

// Set the filters with whatever values they were set with last time. If values were not set, use default values instead
_readFiltersFromHash();

vm.generalFilter = vm.generalFilter || OPEN_GENERAL_FILTER;
vm.statusFilter = vm.statusFilter || '';
vm.companyFilter = vm.companyFilter || '';
vm.searchFilter = vm.searchFilter || '';