/**
 * A module listing all the different types of statuses that an order could be in
 *
 * @module orderStatus
 */

// ----------------- ENUMS/CONSTANTS --------------------------

const ALL_ORDER_STATUSES =
	{
		PROSPECT: 'prospect',
		PENDING: 'pending',
		MATERIAL: 'material',
		LAYOUT: 'layout',
		WELDING: 'welding',
		GRINDING: 'grinding',
		PAINTING: 'painting',
		INSTALL: 'install',
		CLOSING: 'closing',
		CLOSED: 'closed',
		CANCELLED: 'cancelled'
	},
	
	OPEN_STATUSES =
	{
		material : true,
		layout : true,
		welding : true,
		grinding : true,
		painting : true,
		install : true,
		closing : true,
	},

	PRODUCTION_STATUSES =
	{
		material : true,
		layout : true,
		welding : true,
		grinding : true,
		painting : true,
		install : true
	},

	MANUFACTURING_STATUSES =
	{
		layout : true,
		welding : true,
		grinding : true,
		painting : true
	},

	SPANISH_SHOP_STATUSES =
	{
		material : 'Material',
		layout : 'Trazar',
		welding : 'Soldar',
		grinding : 'Pulir',
		painting : 'Pintar',
		install : 'Instalar'
	},

	STATUS_DESCRIPTIONS =
	{
		pending: 'Your order is <b>pending</b> your approval! Please check your e-mail and see if you received an' +
			' e-mail from us that should inform you as to how to approve your order.',
		material: 'Your order is <b>queued</b> in our backlog. We should begin working on your order within a week' +
			' after we have received your initial down deposit.',
		production: 'Your order is now in <b>production</b>, meaning that we are hard at work cutting, shaping, and' +
			' welding metal in order to construct your railings.',
		finishing: 'Your order is now in the <b>finishing</b> stages, meaning we are applying powder coating to your' +
			' railings. Once the railings are treated with the powder coating, we cure the railings under intense' +
			' heat inside our custom-built oven so that the finish truly sticks for years to come.',
		install: 'Your order is ready to be <b>installed</b>. Expect a call from us soon to schedule a date and time for us to ' +
			'come over and install these railings. If we already spoke to you, we will be visiting you soon to install ' +
			'your new railings.',
		closing: 'Your order is in the final stages of <b>closing</b>. All that usually remains at this stage is to' +
			' collect th rest of the balance remaining on the order',
		closed: 'Your order is <b>complete</b>. Your new railings have been built, powder coated, and installed' +
			' successfully! We thank you for your business.',
		cancelled: 'Your order has been <b>cancelled</b>, either because you requested that we cancel the order or because ' +
			'we were unable to reach out to you at the contact information you gave us.'
	},

	LIVE_STATUS = 'open',
	GENERAL_SHOP_STATUS = 'production';

// ----------------- EXPORT MODULE --------------------------

module.exports =
{
	/**
	 * Function responsible for determining whether the status indicates that the order is currently live in our system
	 *
	 * @param {String} status - the status to test
	 *
	 * @returns {boolean} - a flag indicating whether the order is currently in the midst of fabrication
	 *
	 * @author kinsho
	 */
	isOpenStatus: function(status)
	{
		return !!(OPEN_STATUSES[status]);
	},

	/**
	 * Function responsible for returning a list of all statuses that denote that an order is currently live
	 *
	 * @returns {Array<String>} - an array of all live statuses
	 *
	 * @author kinsho
	 */
	listAllOpenStatuses: function()
	{
		return Object.keys(OPEN_STATUSES);
	},

	/**
	 * Function responsible for returning a list of all statuses that denote whether an order is in production
	 *
	 * @returns {Array<String>} - an array of all production statuses
	 *
	 * @author kinsho
	 */
	listAllShopStatuses: function()
	{
		return Object.keys(PRODUCTION_STATUSES);
	},

	/**
	 * Function responsible for determining whether the status indicates that the order is in a production state
	 *
	 * @param {String} status - the status to test
	 *
	 * @returns {boolean} - a flag indicating whether the order is currently in the midst of fabrication
	 *
	 * @author kinsho
	 */
	isShopStatus: function(status)
	{
		return !!(PRODUCTION_STATUSES[status]);
	},

	/**
	 * Function responsible for determining whether the status indicates that the order is being fabricated
	 *
	 * @param {String} status - the status to test
	 *
	 * @returns {boolean} - a flag indicating whether the order is currently in the midst of fabrication
	 *
	 * @author kinsho
	 */
	isManufacturingStatus: function(status)
	{
		return !!(MANUFACTURING_STATUSES[status]);
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
	 * Function responsible for returning the spanish translation for the passed status, if one exists
	 *
	 * @param {String} status - the status to translate
	 *
	 * @returns {String} - the spanish translation of that status
	 *
	 * @author kinsho
	 */
	getSpanishTranslation: function (status)
	{
		return SPANISH_SHOP_STATUSES[status] || '';
	},

	LIVE: LIVE_STATUS,
	SHOP: GENERAL_SHOP_STATUS,

	ALL: ALL_ORDER_STATUSES
};