// ----------------- EXTERNAL MODULES --------------------------

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

import vm from 'client/scripts/contractorPricing/viewModel';

// ----------------- ENUMS/CONSTANTS ----------------------

var ZIP_CODE_TEXTFIELD = 'zipCode',
	PRICING_TABLE = 'pricingTable',
	SUBMISSION_BUTTON = 'submissionButton',

	FADE_OUT_EVENT = 'fadeOut',
	POP_IN_CHART_EVENT = 'popInChart',

	FETCH_PRICING_URL = 'contractorPricing/fetchPricing',

	ZIP_CODE_ERRONEOUS = 'We had a problem finding that zip code. Please double-check to make sure the zip code is' +
		' accurate. If you continue having issues, call us as soon as possible at 877-504-8300.';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
var _zipCodeField = document.getElementById(ZIP_CODE_TEXTFIELD),
	_pricingChart = document.getElementById(PRICING_TABLE),
	_submitButton = document.getElementById(SUBMISSION_BUTTON);

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting the zip code into the view model
 *
 * @author kinsho
 */
function setZipCode()
{
	vm.zipCode = _zipCodeField.value;
}

/**
 * Listener responsible for retrieving altered pricing data depending on the distance to a given region
 *
 * @author kinsho
 */
function retrievePricing()
{
	var data = {};

	// Set whatever zip code value has been entered into the view model just to ensure the latest value has been
	// captured
	vm.zipCode = _zipCodeField.value;

	// Only proceed should the form be readily submissible
	if (vm.isFormSubmissible)
	{
		// Fade out the pricing chart
		_pricingChart.dispatchEvent(new CustomEvent(FADE_OUT_EVENT));

		// Organize the data to send over the wire
		data =
		{
			zipCode: vm.zipCode
		};

		axios.post(FETCH_PRICING_URL, data, true).then((results) =>
		{
			// Fade in the new chart with information
			_pricingChart.dispatchEvent(new CustomEvent(POP_IN_CHART_EVENT,
			{
				detail: results.data
			}));
		}, () =>
		{
			notifier.showSpecializedServerError(ZIP_CODE_ERRONEOUS);

			// Reset whatever is currently there in the pricing section
			_pricingChart.innerHTML = '';
		});
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

// Set up the view model listeners
_zipCodeField.addEventListener('change', setZipCode);
_submitButton.addEventListener('click', retrievePricing);

// ----------------- DATA INITIALIZATION -----------------------------

vm.zipCode = '';