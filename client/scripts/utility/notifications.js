// ----------------- EXTERNAL MODULES --------------------------

// ----------------- ENUM/CONSTANTS -----------------------------

const USER_NOTIFICATION_BAR = 'userNotificationBar',
	USER_NOTIFICATION_MESSAGE_SECTION = 'userNotificationMessage',
	USER_NOTIFICATION_CLOSE_ICON = 'userNotificationBarExit',

	USER_SUCCESS_BAR = 'userSuccessBar',
	USER_SUCCESS_MESSAGE_SECTION = 'userSuccessMessage',
	USER_SUCCESS_CLOSE_ICON = 'userSuccessBarExit',

	REVEAL_CLASS = 'reveal',

	GENERIC_SERVER_MESSAGE = 'We have an issue with our servers. Please reload this page and try again. If you see this ' +
		'message again, please contact us at ' + window.MetroRailings.supportNumber + '.';

// ----------------- PRIVATE VARIABLES -----------------------------

// Elements
let _serverNotificationBar = document.getElementById(USER_NOTIFICATION_BAR),
	_errorMessageArea = document.getElementById(USER_NOTIFICATION_MESSAGE_SECTION),

	_successBar = document.getElementById(USER_SUCCESS_BAR),
	_successMessageArea = document.getElementById(USER_SUCCESS_MESSAGE_SECTION);

// ----------------- LISTENERS -----------------------------

/**
 * Function that hides the notification bar that informs users that there may be some errors at hand preventing
 * user progress
 *
 * @author kinsho
 */
function _hideErrorBar()
{
	_serverNotificationBar.classList.remove(REVEAL_CLASS);
}

/**
 * Function that hides the notification bar that informs users of some successful action taking place
 *
 * @author kinsho
 */
function _hideSuccessBar()
{
	_successBar.classList.remove(REVEAL_CLASS);
}

// ----------------- MODULE -----------------------------

let notifications =
{
	/**
	 * Function that shows a notification bar indicating that there may be some server issues
	 *
	 * @author kinsho
	 */
	showGenericServerError: function ()
	{
		_errorMessageArea.innerHTML = GENERIC_SERVER_MESSAGE;
		_serverNotificationBar.classList.add(REVEAL_CLASS);
	},

	/**
	 * Function that shows a notification bar containing a specialized error message
	 *
	 * @params {String} message - the message to show within the notification area
	 *
	 * @author kinsho
	 */
	showSpecializedServerError: function (message)
	{
		_errorMessageArea.innerHTML = message;
		_serverNotificationBar.classList.add(REVEAL_CLASS);
	},

	/**
	 * Function that shows a notification bar informing the user of a successful action that just took place
	 *
	 * @params {String} message - the message to show within the success bar
	 *
	 * @author kinsho
	 */
	showSuccessMessage: function (message)
	{
		_successMessageArea.innerHTML = message;
		_successBar.classList.add(REVEAL_CLASS);
	},

	/**
	 * Public function that outside modules can use to hide the notification bar from view programatically
	 *
	 * @author kinsho
	 */
	hideErrorBar: function ()
	{
		_hideErrorBar();
	},

	/**
	 * Public function that outside modules can use to hide the success bar from view programatically
	 *
	 * @author kinsho
	 */
	hideSuccessBar: function ()
	{
		_hideSuccessBar();
	}
};

// ----------------- LISTENERS -----------------------------

document.getElementById(USER_NOTIFICATION_CLOSE_ICON).addEventListener('click', _hideErrorBar);
document.getElementById(USER_SUCCESS_CLOSE_ICON).addEventListener('click', _hideSuccessBar);

// ----------------- EXPORT -----------------------------

export default notifications;