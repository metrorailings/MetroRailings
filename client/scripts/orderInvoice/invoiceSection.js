// ----------------- EXTERNAL MODULES --------------------------

import tooltipManager from 'client/scripts/utility/tooltip';

// ----------------- ENUMS/CONSTANTS ---------------------------

var PRINT_ICON = 'pagePrintIcon',
	PRINT_MESSAGE = 'Print this invoice';

// ----------------- PRIVATE VARIABLES ---------------------------

var _printIcon = document.getElementById(PRINT_ICON);

// ----------------- LISTENERS ---------------------------

/**
 * A listener to trigger the browser to print the page
 *
 * @author kinsho
 */
function printPage()
{
	window.print();
}

// ----------------- LISTENER INITIALIZATION -----------------------------

// Bind all invoice listeners to their respective JavaScript functions
_printIcon.addEventListener('click', printPage);

// ----------------- PAGE INITIALIZATION -----------------------------

// Set up a tooltip indicate the purpose of the print icon
tooltipManager.setTooltip(_printIcon, PRINT_MESSAGE, false, tooltipManager.TOOLTIP_OPEN_ON.HOVER);