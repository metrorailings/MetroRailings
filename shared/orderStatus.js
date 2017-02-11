/**
 * A module listing all the different types of statuses that an order could be in
 *
 * @module orderStatus
 */

// ----------------- ENUMS/CONSTANTS --------------------------

var ACTIVE_STATUSES =
	[
		'open',
		'consult',
		'production',
		'install',
		'closed'
	],

	STATUS_DESCRIPTIONS =
	{
		open: 'Your order is now <b>open</b> and awaiting review from one of our salespeople.',
		consult: 'Your order is now in <b>consultation</b> status, meaning one of our associates will be visiting your ' +
			'house soon to confirm the measurements you provided us and discuss finer details about the order with you.',
		production: 'Your order is now in <b>production</b> meaning that we are hard at work building out your railings.',
		install: 'Your order is ready to be <b>installed</b>. Expect a call from us soon to schedule a date and time for us to ' +
			'come over and install these railings. If we already spoke to you, we will be visiting you soon to install ' +
			'your new railings.',
		closed: 'Your order is <b>complete</b>. Your new railings have been built and installed at the address you provided ' +
			'us. We thank you for your business.',
		cancelled: 'Your order has been <b>cancelled</b>, either because you requested that we cancel the order or because ' +
			'we were unable to reach out at the contact information you gave us.'
	},

	CANCELLED_STATUS = 'cancelled';

// ----------------- MODULE DEFINITION --------------------------

// ----------------- EXPORT MODULE --------------------------

module.exports =
{
	/**
	 * Function responsible for deducing which status to upgrade an order to given its previous status
	 *
	 * @param {String} status - the current status of the order
	 *
	 * @returns {String} - either the next status that comes after the current state or an empty string
	 * 		denoting that no status comes after the current status
	 *
	 * @author kinsho
	 */
	moveStatusToNextLevel: function(status)
	{
		for (var i = 0; i < ACTIVE_STATUSES.length; i++)
		{
			if (ACTIVE_STATUSES[i] === status)
			{
				return (ACTIVE_STATUSES[i + 1] || '');
			}
		}

		return '';
	},

	/**
	 * Function responsible for returning a verbose description that accurately explains what the passed status means
	 *
	 * @param {String} status - the status to look up
	 *
	 * @returns {String} - the full description pertaining to the passed status
	 *
	 * @author kinsho
	 */
	getVerboseStatusDescription: function(status)
	{
		return STATUS_DESCRIPTIONS[status];
	},

	/**
	 * Function responsible for returning the status label indicating that an order has been cancelled
	 *
	 * @returns {String} - the cancelled status label
	 *
	 * @author kinsho
	 */
	cancelStatus: function()
	{
		return CANCELLED_STATUS;
	}
};