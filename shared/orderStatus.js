/**
 * A module listing all the different types of statuses that an order could be in
 *
 * @module orderStatus
 */

// ----------------- ENUMS/CONSTANTS --------------------------

var ACTIVE_STATUSES =
	[
		'pending',
		'queue',
		'production',
		'finishing',
		'install',
		'closed'
	],

	STATUS_DESCRIPTIONS =
	{
		pending: 'Your order is <b>pending</b> your approval! Please check your e-mail and see if you received an' +
			' e-mail from us that should inform you as to how to approve your order.',
		queue: 'Your order is <b>queued</b> in our backlog. We should begin working on your order within a week' +
			' after we have received your initial down deposit.',
		production: 'Your order is now in <b>production</b>, meaning that we are hard at work cutting, shaping, and' +
			' molding metal in order to construct your railings.',
		finishing: 'Your order is now in the <b>finishing</b> stages, meaning we are applying powder coating to your' +
			' railings. Once the railings are treated with the powder coating, we cure the railings under intense' +
			' heat inside our custom-built oven so that the finish truly sticks for years to come.',
		install: 'Your order is ready to be <b>installed</b>. Expect a call from us soon to schedule a date and time for us to ' +
			'come over and install these railings. If we already spoke to you, we will be visiting you soon to install ' +
			'your new railings.',
		closed: 'Your order is <b>complete</b>. Your new railings have been built, powder coated, and installed' +
		' successfully! We thank you for your business.',
		cancelled: 'Your order has been <b>cancelled</b>, either because you requested that we cancel the order or because ' +
			'we were unable to reach out to you at the contact information you gave us.'
	},

	ESTIMATE_STATUS = 'estimate',
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
	},

	/**
	 * Function responsible for returning the status label indicating that an estimate request has been placed
	 *
	 * @returns {String} - the estimate status label
	 *
	 * @author kinsho
	 */
	estimateStatus: function()
	{
		return ESTIMATE_STATUS;
	}
};