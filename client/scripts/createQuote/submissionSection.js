// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/createQuote/viewModel';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';
import rQuery from 'client/scripts/utility/rQueryClient';

import designValidation from 'shared/designs/designValidation';

// ----------------- ENUMS/CONSTANTS ---------------------------

var SAVE_BUTTON = 'saveButton',
	DESIGN_ERRORS_CONTAINER = 'designErrorsContainer',
	DESIGN_ERRORS_TEMPLATE = 'designErrorsTemplate',

	SUCCESS_MESSAGE = 'Success! A new order has been created and the client has been e-mailed the link to approve' +
		' the order. The system will automatically take you back to the orders listings in a few moments.',

	ORDERS_PAGE_URL = '/orders',
	ORDER_INVOICE_URL = '/orderInvoice?id=::orderId',
	SAVE_ORDER_URL = 'createQuote/saveNewOrder',

	ORDER_ID_PLACEHOLDER = '::orderId';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
var _saveButton = document.getElementById(SAVE_BUTTON),
	_designErrorsContainer = document.getElementById(DESIGN_ERRORS_CONTAINER);

// ----------------- HANDLEBAR TEMPLATES ---------------------------

/**
 * The partial to render design-validation errors on page 
 */
var designErrorsTemplate = Handlebars.compile(document.getElementById(DESIGN_ERRORS_TEMPLATE).innerHTML);

// ----------------- LISTENERS ---------------------------

/**
 * Function responsible for submitting the form
 *
 * @author kinsho
 */
function submit()
{
	var data = {},
		designErrorMessages = [],
		designObject = rQuery.copyObject(vm.design, true);

	// First check to see if the design selections made are valid
	designErrorMessages = designErrorMessages.concat(designValidation.testRequirements(designObject));
	designErrorMessages = designErrorMessages.concat(designValidation.testPrerequisites(designObject));

	// If the design selections are not valid, display all the reasons why the design choices is considered invalid
	_designErrorsContainer.innerHTML = designErrorsTemplate({ errors: designErrorMessages });
	if (designErrorMessages.length)
	{
		_designErrorsContainer.scrollIntoView({ behavior: 'smooth' });
	}

	// Organize the data that will be sent over the wire as long as the entire form is valid
	if (vm.isFormValid && designErrorMessages.length === 0)
	{
		data =
		{
			_id: window.MetroRailings.prospectId || '', // Set an ID here in case we are transforming a prospect into an order
			length: window.parseInt(vm.length, 10),
			finishedHeight: window.parseInt(vm.finishedHeight, 10),
			additionalFeatures: vm.additionalFeatures.split('\n\n').join('<br /><br />'),
			agreement: vm.agreement,

			timeLimit:
			{
				original: window.parseInt(vm.timeLimit, 10) || ''
			},

			notes:
			{
				order: vm.notes.order.split('\n').join('<br />'),
				internal: '',
			},

			installation:
			{
				platformType: vm.platformType,
				coverPlates: vm.coverPlates
			},

			pricing:
			{
				pricePerFoot: window.parseFloat(vm.pricePerFoot),
				additionalPrice: window.parseFloat(vm.additionalPrice) || 0,
				deductions: window.parseFloat(vm.deductions) || 0,
				isTaxApplied: vm.applyTaxes,
				isTariffApplied: vm.applyTariffs
			},

			customer:
			{
				name: vm.name,
				company: vm.company || '',
				email: vm.email || '',
				areaCode: vm.areaCode,
				phoneOne: vm.phoneOne,
				phoneTwo: vm.phoneTwo,
				address: vm.address,
				aptSuiteNo: vm.aptSuiteNo,
				city: vm.city,
				state: vm.state,
				zipCode: vm.zipCode || ''
			},

			design: designObject,
		};

		// Disable the button to ensure the order is not accidentally sent multiple times
		_saveButton.disabled = true;

		axios.post(SAVE_ORDER_URL, data, true).then(() =>
		{
			// In the main tab, show a message indicating success and navigate the user back to the main admin page
			notifier.showSuccessMessage(SUCCESS_MESSAGE);

			window.setTimeout(function()
			{
				window.location.href = ORDERS_PAGE_URL;
			}, 2000);

			// Open the newly-generated invoice in a new tab
			window.open(ORDER_INVOICE_URL.replace(ORDER_ID_PLACEHOLDER), '_blank');
		}, () =>
		{
			notifier.showGenericServerError();

			_saveButton.disabled = false;
		});
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_saveButton.addEventListener('click', submit);