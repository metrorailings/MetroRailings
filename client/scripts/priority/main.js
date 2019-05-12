// ----------------- EXTERNAL MODULES --------------------------

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';
import rQuery from 'client/scripts/utility/rQueryClient';

import dateUtility from 'shared/dateUtility';

// ----------------- ENUMS/CONSTANTS ---------------------------

const DUE_DATE_FIELDS = 'dueDates',
	OPEN_ORDER_LISTING = 'openOrder',
	OPEN_ORDER_LIST = 'openOrderList',

	DATE_CHANGE_SUCCESSFUL = 'The date was successfully changed.',
	DATE_CHANGE_FAILED = 'Something went wrong when changing the date. Try it again...',
	CHANGE_DUE_DATE_URL = 'priority/changeDueDate';

// ----------------- PRIVATE VARIABLES ---------------------------

let _orderList = document.getElementById(OPEN_ORDER_LIST),
	_orderRecords = _orderList.children,
	_dueDates = document.getElementsByClassName(DUE_DATE_FIELDS);

// ----------------- PRIVATE FUNCTIONS ---------------------------

/**
 * A function that formats the date to a shortened user-friendly string
 *
 * @param {HTMLElement} input - the element with the selected date
 * @param {Date} date - the date to format
 *
 * @author kinsho
 */
function _formatDate(input, date)
{
	input.value = dateUtility.formatShortDate(date);
}

// ----------------- LISTENERS ---------------------------

/**
 * Listener function that sets a new due date for any open order inside our database
 *
 * @param {Event} event - the event responsible for triggering the invocation of this function
 *
 * @author kinsho
 */
function changeDueDate(event)
{
	let element = event.currentTarget,
		orderId = element.dataset.orderId,
		date = element.value,
		data =
		{
			id: orderId,
			dueDate: date || ''
		};

	axios.post(CHANGE_DUE_DATE_URL, data, true).then(() =>
	{
		let orderListing = rQuery.closestElementByClass(element, OPEN_ORDER_LISTING),
			mockOrderObj1 = { dates : { created : new Date(element.dataset.createDate), due : date ? new Date(date) : '' } },
			mockOrderObj2 = {},
			inputField, dueDate, createDate;

		// Reorganize the records depending on the newly-selected due date
		for (let i = 0; i < _orderRecords.length; i += 1)
		{
			inputField = _orderRecords[i].getElementsByClassName(DUE_DATE_FIELDS)[0],
			dueDate = inputField.value ? new Date(inputField.value) : '';
			createDate = new Date(inputField.dataset.createDate);

			// Encapsulate the date information into an object that will be fed into the function that will
			// compare the sets of dates against one another
			mockOrderObj2 =
			{
				dates : { created : createDate, due : dueDate }
			};

			// Ensure that the modified record is ignored when we're comparing dates with other records
			if ( (orderListing !== _orderRecords[i]) && (dateUtility.sortByDueDates(mockOrderObj1, mockOrderObj2) < 0) )
			{
				_orderList.insertBefore(orderListing, _orderRecords[i]);
				break;
			}

			// If we have reached the last listing, move the modified record down to the bottom
			if (i + 1 === _orderRecords.length)
			{
				_orderList.appendChild(orderListing);
			}
		}

		// Show a notification indicating the due date was successfully changed
		notifier.showSuccessMessage(DATE_CHANGE_SUCCESSFUL);
		window.setTimeout(notifier.hideSuccessBar, 1500);
	}, () =>
	{
		notifier.showSpecializedServerError(DATE_CHANGE_FAILED);
	});
}

// ----------------- LISTENER INITIALIZATION -----------------------------

for (let i = _dueDates.length - 1; i >= 0; i -= 1)
{
	_dueDates[i].addEventListener('change', changeDueDate);
}
