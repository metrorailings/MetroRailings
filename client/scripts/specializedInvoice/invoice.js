// ----------------- EXTERNAL MODULES --------------------------

// ----------------- ENUMS/CONSTANTS ----------------------

var PRINT_MESSAGE = 'printMessage',
	INVOICE_PRINT_SHORTCUT = 'invoicePrintIcon',
	ORDER_INVOICE_LINK = 'orderInvoiceText',

	ORDER_INVOICE_URL = '/orderInvoice?id=::orderID',
	ORDER_ID_PLACEHOLDER = '::orderID';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
var _printField = document.getElementById(PRINT_MESSAGE),
	_printIcon = document.getElementById(INVOICE_PRINT_SHORTCUT),
	_orderInvoiceLink = document.getElementById(ORDER_INVOICE_LINK);

// ----------------- LISTENERS ---------------------------

/**
 * A listener to trigger the browser to print the page
 *
 * @author kinsho
 */
function printInvoice()
{
	window.print();
}

/**
 * A listener to help us navigate to the order invoice page for which this invoice may reference
 *
 * @param {Event} event - the event responsible for triggering the invocation of this function
 *
 * @author kinsho
 */
function navigateToInvoicePage(event)
{
	var orderLink = ORDER_INVOICE_URL.replace(ORDER_ID_PLACEHOLDER, event.currentTarget.dataset.orderId);

	window.open(orderLink, '_blank');
}

// ----------------- LISTENER INITIALIZATION -----------------------------

// Set up the view model listeners
_printField.addEventListener('click', printInvoice);
_printIcon.addEventListener('click', printInvoice);
_orderInvoiceLink.addEventListener('click', navigateToInvoicePage);