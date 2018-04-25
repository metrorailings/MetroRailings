// ----------------- ENUMS/CONSTANTS ----------------------

var PRICING_TABLE = 'pricingTable',
	PRICING_TEMPLATE = 'pricingTemplate',

	FADE_IN_CLASS = 'fadeIn',

	FADE_OUT_EVENT = 'fadeOut',
	POP_IN_CHART_EVENT = 'popInChart';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
var _pricingChart = document.getElementById(PRICING_TABLE);

// ----------------- HANDLEBAR TEMPLATES ---------------------------

/**
 * The partial to render individual orders on the orders page
 */
var pricingTemplate = Handlebars.compile(document.getElementById(PRICING_TEMPLATE).innerHTML);

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for fading out the current chart
 *
 * @author kinsho
 */
function fadeOut()
{
	_pricingChart.classList.remove(FADE_IN_CLASS);
}

/**
 * Listener responsible for populating data into the chart and pushing it into view
 *
 * @param {Event} event - the event object that contains the data that will be used to populate the pricing guide
 *
 * @author kinsho
 */
function generateChart(event)
{
	// Populate the chart
	_pricingChart.innerHTML = pricingTemplate({ options : event.detail });

	// Show the chart
	_pricingChart.classList.add(FADE_IN_CLASS);
}

// ----------------- LISTENER INITIALIZATION -----------------------------

// Set up the listeners needed to update the pricing chart
_pricingChart.addEventListener(FADE_OUT_EVENT, fadeOut);
_pricingChart.addEventListener(POP_IN_CHART_EVENT, generateChart);