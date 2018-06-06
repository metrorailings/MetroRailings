/**
 * @main systemPaths
 *
 * The list of paths to application-specific modules
 */

SystemJS.config({
	map:
	{
		home: '/client/scripts/home/main.js',
		createOrder: '/client/scripts/createOrder/main.js',
		designRailings: '/client/scripts/designRailings/main.js',
		lengthEstimation: '/client/scripts/lengthEstimation/main.js',

		orderInvoice: '/client/scripts/orderInvoice/main.js',
		orderConfirmation: '/client/scripts/orderConfirmation/main.js',

		estimateLocation: '/client/scripts/estimateLocation/main.js',
		estimateBooking: '/client/scripts/estimateBooking/main.js',
		estimateConfirmation: '/client/scripts/estimateConfirmation/main.js',

		checkOrder: '/client/scripts/checkOrder/main.js',
		contactUs: '/client/scripts/contactUs/main.js',
		faqs: '/client/scripts/faqs/main.js',
		gallery: '/client/scripts/gallery/main.js',
		lost: '/client/scripts/lost/main.js',

		adminLogIn: '/client/scripts/adminLogIn/main.js',
		orders: '/client/scripts/orders/main.js',
		orderDetails: '/client/scripts/orderDetails/main.js',
		prospectDetails: '/client/scripts/prospectDetails/main.js',
		createProspect: '/client/scripts/createProspect/main.js',
		createQuote: '/client/scripts/createQuote/main.js',
		paperOrder: '/client/scripts/paperOrder/main.js',

		conventionContact: '/client/scripts/conventionContact/main.js',
		conventionGallery: '/client/scripts/conventionGallery/main.js',
		contractorPricing: '/client/scripts/contractorPricing/main.js',
		contractorAgreement: '/client/scripts/contractorAgreement/main.js'
	},
	packages:
	{
		'':
		{
			defaultExtension: 'js'
		}
	},
	production: true
});