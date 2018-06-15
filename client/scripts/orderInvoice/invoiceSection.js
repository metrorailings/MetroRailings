// ----------------- EXTERNAL MODULES --------------------------

import tooltipManager from 'client/scripts/utility/tooltip';

// ----------------- ENUMS/CONSTANTS ---------------------------

var PRINT_ICON = 'pagePrintIcon',
	TARIFF_LINK = 'tariffWhatIsThis',
	PRINT_MESSAGE = 'Print this invoice',

	TARIFF_URL = '/tariffInfo';

// ----------------- PRIVATE VARIABLES ---------------------------

var _printIcon = document.getElementById(PRINT_ICON),
	_tariffLink = document.getElementById(TARIFF_LINK);

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

/**
 * A listener to help us navigate to the tariff page
 *
 * @author kinsho
 */
function navigateToTariffPage()
{
	window.open(TARIFF_URL);
}

// ----------------- LISTENER INITIALIZATION -----------------------------

// Bind all invoice listeners to their respective JavaScript functions
_printIcon.addEventListener('click', printPage);
_tariffLink.addEventListener('click', navigateToTariffPage);

// ----------------- PAGE INITIALIZATION -----------------------------

// Set up a tooltip indicate the purpose of the print icon
tooltipManager.setTooltip(_printIcon, PRINT_MESSAGE, false, tooltipManager.TOOLTIP_OPEN_ON.HOVER);