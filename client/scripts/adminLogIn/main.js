// ----------------- EXTERNAL MODULES --------------------------

import axios from 'client/scripts/utility/axios';
import notifier from 'client/scripts/utility/notifications';

// ----------------- ENUMS/CONSTANTS ----------------------

var USERNAME_TEXTFIELD = 'userName',
	PASSWORD_TEXTFIELD = 'password',
	REMEMBER_ME_CHECKBOX = 'rememberMe',
	SUBMISSION_BUTTON = 'adminSubmissionButton',

	LOG_IN_URL = 'admin/logIn',
	ORDERS_URL = '/orders',

	LOG_IN_INVALID_MESSAGE = 'Your username and password was not recognized as a legitimate combination.';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements

var _usernameField = document.getElementById(USERNAME_TEXTFIELD),
	_passwordField = document.getElementById(PASSWORD_TEXTFIELD),
	_rememberMe = document.getElementById(REMEMBER_ME_CHECKBOX);

// ----------------- PRIVATE FUNCTIONS ---------------------------

// ----------------- LISTENERS ---------------------------

/**
 * Function is responsible for sending the credential data over the wire for authentication
 */
function logIn()
{
	var data =
	{
		username: _usernameField.value,
		password: _passwordField.value,
		rememberMe: !!(_rememberMe.checked)
	};

	// Hide any server error that might have popped up before
	notifier.hideErrorBar();

	axios.post(LOG_IN_URL, data, true).then(() =>
	{
		// If successful, let's take the user to the orders page
		window.location.href = ORDERS_URL;
	}, () =>
	{
		notifier.showSpecializedServerError(LOG_IN_INVALID_MESSAGE);
	});
}

// ----------------- LISTENER INITIALIZATION -----------------------------

document.getElementById(SUBMISSION_BUTTON).addEventListener('click', logIn);

// ----------------- DATA INITIALIZATION -----------------------------

// ----------------- PAGE INITIALIZATION -----------------------------