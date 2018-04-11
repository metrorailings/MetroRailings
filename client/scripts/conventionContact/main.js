// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/conventionContact/viewModel';

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

// ----------------- ENUMS/CONSTANTS ----------------------

var CUSTOMER_NAME_FIELD = 'customerName',
	AREA_CODE_FIELD = 'customerPhoneAreaCode',
	PHONE_ONE_FIELD = 'customerPhoneNumber1',
	PHONE_TWO_FIELD = 'customerPhoneNumber2',
	EMAIL_FIELD = 'customerEmail',
	COMPANY_FIELD = 'customerCompany',
	COMPANY_ROLE_FIELD = 'customerRole',
	OPINION_FIELD = 'opinion',
	SUBMISSION_BUTTON = 'conventionSubmissionButton',

	DISABLED_CLASS = 'disabled',
	CUSTOMER_GOALS_NAME = 'customerGoals',

	SEND_REQUEST_URL = 'conventionContact/saveNewContact',

	SUCCESS_MESSAGE = 'We\'ve saved your contact information! Thank you. We\'ll be reaching out shortly after the' +
		' convention.';

// ----------------- PRIVATE VARIABLES ---------------------------

var _nameField = document.getElementById(CUSTOMER_NAME_FIELD),
	_areaCodeField = document.getElementById(AREA_CODE_FIELD),
	_phoneOneField = document.getElementById(PHONE_ONE_FIELD),
	_phoneTwoField = document.getElementById(PHONE_TWO_FIELD),
	_emailField = document.getElementById(EMAIL_FIELD),
	_companyField = document.getElementById(COMPANY_FIELD),
	_roleField = document.getElementById(COMPANY_ROLE_FIELD),
	_interestsOptions = document.getElementsByName(CUSTOMER_GOALS_NAME),
	_opinionField = document.getElementById(OPINION_FIELD),

	_submitButton = document.getElementById(SUBMISSION_BUTTON);

// ----------------- LISTENERS ---------------------------

/**
 * A listener to set the customer's name into the view model
 *
 * @author kinsho
 */
function setName()
{
	vm.name = _nameField.value;
}

/**
 * A listener to set the customer's area code into the view model
 *
 * @author kinsho
 */
function setAreaCode()
{
	vm.areaCode = _areaCodeField.value;

	// If the area code has been fully typed out, move on to the next phone field
	if (_areaCodeField.value.length === 3)
	{
		_phoneOneField.focus();
	}
}

/**
 * A listener to set the first part of the customer's phone number into the view model
 *
 * @author kinsho
 */
function setPhoneOne()
{
	vm.phoneOne = _phoneOneField.value;

	// If the first three digits of the phone number have been typed, move on to the last phone field
	if (_phoneOneField.value.length === 3)
	{
		_phoneTwoField.focus();
	}
}

/**
 * A listener to set the second part of the customer's phone number into the view model
 *
 * @author kinsho
 */
function setPhoneTwo()
{
	vm.phoneTwo = _phoneTwoField.value;
}

/**
 * A listener to set the customer's email address into the view model
 *
 * @author kinsho
 */
function setEmail()
{
	vm.email = _emailField.value;
}

/**
 * A listener to set the customer's company into the view model
 *
 * @author kinsho
 */
function setCompany()
{
	vm.company = _companyField.value;
}

/**
 * A listener to set the customer's role in his company into the view model
 *
 * @author kinsho
 */
function setCompanyRole()
{
	vm.companyRole = _roleField.value;
}

/**
 * A listener to set the customer's opinion of the company into the view model
 *
 * @author kinsho
 */
function setOpinion()
{
	vm.opinion = _opinionField.value;
}

/**
 * A listener designed to set a new interest
 *
 * @param {Event} event - the event object associated with the firing of this listener
 *
 * @author kinsho
 */
function toggleNewInterest(event)
{
	vm.interests = event.currentTarget.value;
}

/**
 * A listener that will send form data over to the server so that we can save contact information in our database
 *
 * @author kinsho
 */
function saveData()
{
	var selectedInterests = [],
		data;

	// Gather all the interests the customer has marked off
	vm.interests.forEach((value) =>
	{
		selectedInterests.push(value);
	});

	// Only save the data as long as a name was given
	if ( (vm.name) && !(_submitButton.classList.contains(DISABLED_CLASS)) )
	{
		// Organize the data that will need to be sent over the wire
		data =
		{
			name: vm.name,
			email: vm.email,
			areaCode: vm.areaCode,
			phoneOne: vm.phoneOne,
			phoneTwo: vm.phoneTwo,
			company: vm.company,
			companyRole: vm.companyRole,
			opinion: vm.opinion,
			interests: selectedInterests
		};

		// Prevent the button from being clicked again
		_submitButton.disabled = true;

		// Save the data
		axios.post(SEND_REQUEST_URL, data, true).then(() =>
		{

			// Show a message indicating that a request has been sent to us
			notifier.showSuccessMessage(SUCCESS_MESSAGE);

			// If successful, put up a success banner and let's take the user back to the home page after
			// about 5 seconds
			window.setTimeout(() =>
			{
				window.location.reload(true);
			}, 4000);

		}, () =>
		{
			notifier.showGenericServerError();
		});
	}
}

// ----------------- LISTENER INITIALIZATION -----------------------------

// Attach event listeners to set data into the view model
_nameField.addEventListener('blur', setName);
_areaCodeField.addEventListener('keyup', setAreaCode);
_phoneOneField.addEventListener('keyup', setPhoneOne);
_phoneTwoField.addEventListener('blur', setPhoneTwo);
_emailField.addEventListener('blur', setEmail);
_companyField.addEventListener('blur', setCompany);
_roleField.addEventListener('blur', setCompanyRole);
_opinionField.addEventListener('change', setOpinion);

for (let i = 0; i < _interestsOptions.length; i++)
{
	_interestsOptions[i].addEventListener('change', toggleNewInterest);
}

// Attach an event listener that will record data into our database
_submitButton.addEventListener('click', saveData);