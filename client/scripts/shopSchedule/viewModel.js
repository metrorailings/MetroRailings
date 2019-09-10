/**
 * The view model for the shop schedule page
 */

// ----------------- EXTERNAL MODULES --------------------------

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

// ----------------- ENUMS/CONSTANTS ---------------------------

const STATUS_FIELDS = 'statusIcon',
	STALE_DATA_FOUND = 'staleDataNotifier',

	LOCAL_STORAGE_OPEN_ORDERS_LAST_MODIFIED_KEY = 'mrAdminOpenOrdersLastModified',
	DEFAULT_MODIFICATION_DATE = new Date(),

	SEARCH_OPEN_ORDERS_URL = 'shopSchedule/searchOpenOrders',

	REVEAL_CLASS = 'reveal',
	SELECTED_CLASS = 'selected';

// ----------------- PRIVATE VARIABLES ---------------------------

let _statusFields = document.getElementsByClassName(STATUS_FIELDS),
	_staleDataNotifier = document.getElementById(STALE_DATA_FOUND);

// ----------------- CONSTRUCTOR --------------------------

let viewModel = {};

// New status to log into the system
Object.defineProperty(viewModel, 'newStatus',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__status;
	},

	set: (value) =>
	{
		viewModel.__status = value;

		// Highlight the option that was selected
		for (let i = 0; i < _statusFields.length; i += 1)
		{
			if (_statusFields[i].dataset.status === value)
			{
				_statusFields[i].getElementsByTagName('img')[0].classList.add(SELECTED_CLASS);
			}
			else
			{
				_statusFields[i].getElementsByTagName('img')[0].classList.remove(SELECTED_CLASS);
			}
		}
	}
});

// Status currently in effect when the status modal is opened
Object.defineProperty(viewModel, 'oldStatus',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return viewModel.__oldStatus;
	},

	set: (value) =>
	{
		viewModel.__oldStatus = value;
	}
});

Object.defineProperty(viewModel, 'pingTheServer',
{
	configurable: false,
	enumerable: true,

	get: () =>
	{
		return null;
	},

	set: () =>
	{
		let dateToSearch = (window.localStorage.getItem(LOCAL_STORAGE_OPEN_ORDERS_LAST_MODIFIED_KEY) ? JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_OPEN_ORDERS_LAST_MODIFIED_KEY)) : DEFAULT_MODIFICATION_DATE),
			formalDate = new Date(dateToSearch);

		axios.post(SEARCH_OPEN_ORDERS_URL, { date: formalDate.toString() }).then((results) =>
		{
			window.localStorage.setItem(LOCAL_STORAGE_OPEN_ORDERS_LAST_MODIFIED_KEY, JSON.stringify(new Date()));

			if (results.data && results.data.length)
			{
				_staleDataNotifier.classList.add(REVEAL_CLASS);
			}			
		}, () =>
		{
			notifier.showGenericServerError();
		});
	}
});
// ----------------- INITIALIZATION -----------------------------

// Remove any values that were previously stowed into local storage frmo this page
window.localStorage.removeItem(LOCAL_STORAGE_OPEN_ORDERS_LAST_MODIFIED_KEY);

// ----------------- EXPORT -----------------------------

export default viewModel;