// ----------------- EXTERNAL MODULES --------------------------

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

import dateUtility from 'shared/dateUtility';

// ----------------- ENUMS/CONSTANTS ---------------------------

const DUE_DATE_FIELDS = 'dueDates',

	CHANGE_DUE_DATE_URL = 'orderDetails/changeDueDate';

// ----------------- PRIVATE VARIABLES ---------------------------

let _dueDates = document.getElementsByClassName(DUE_DATE_FIELDS);

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
 * @param {Datepicker} instance - the datepicker instance itself
 * @param {Date} date - the date to record
 *
 * @author kinsho
 */
function changeDueDate(instance, date)
{
	let element = event.currentTarget,
		orderId = element.dataset.orderId,
		data =
		{
			orderId: orderId,
			dueDate: date
		};

	axios.post(CHANGE_DUE_DATE_URL, data, true).then(() =>
	{
		// Reorganize the records depending on the due dates
		notifier.showSuccessMessage();
	}, () =>
	{
		notifier.showGenericServerError();
	});
}

// ----------------- LISTENER INITIALIZATION -----------------------------

for (let i = _dueDates.length - 1; i >= 0; i -= 1)
{
	datepicker(_dueDates[i],
	{
		onSelect : changeDueDate,
		formatter : _formatDate,
		position : 'tl'
	});
}
