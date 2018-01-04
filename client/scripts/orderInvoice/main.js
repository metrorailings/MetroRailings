// ----------------- EXTERNAL MODULES --------------------------

import invoiceSection from 'client/scripts/orderInvoice/invoiceSection';
import personalInfoSection from 'client/scripts/orderInvoice/personalInfoSection';
import addressSection from 'client/scripts/orderInvoice/addressSection';
import paymentSection from 'client/scripts/orderInvoice/paymentSection';
import submissionSection from 'client/scripts/orderInvoice/submissionSection';

// ----------------- ENUMS/CONSTANTS ---------------------------

var ADMIN_ORDERS_BUTTON = 'adminOrdersButton',

	SHOW_CLASS = 'show',

	IS_ADMIN = 'isAdmin';

// ----------------- INITIALIZATION LOGIC ---------------------------

// If the admin flag is set, show the button that we can use to navigate back to the orders page
if (window.localStorage.getItem(IS_ADMIN))
{
	document.getElementById(ADMIN_ORDERS_BUTTON).classList.add(SHOW_CLASS);
}