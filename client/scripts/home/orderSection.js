// ----------------- ENUMS/CONSTANTS ---------------------------

var ORDER_CREATION_BUTTON = 'orderCreationButton',

	CREATE_ORDER_URL = '/createOrder';

// ----------------- PRIVATE VARIABLES ---------------------------

	// Elements
var _orderCreationButton = document.getElementById(ORDER_CREATION_BUTTON);

// ----------------- LISTENERS ---------------------------

/**
 * Listener to navigate to the create order page
 *
 * @author kinsho
 */
function navigateToCreateOrderPage()
{
	window.location.href = CREATE_ORDER_URL;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_orderCreationButton.addEventListener('click', navigateToCreateOrderPage);