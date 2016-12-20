// ----------------- EXTERNAL MODULES --------------------------

import config from 'config/config';

// ----------------- ENUM/CONSTANTS -----------------------------

var USER_NOTIFICATION_BAR = 'userNotificationBar',
	USER_NOTIFICATION_MESSAGE_SECTION = 'userNotificationMessage',
	USER_NOTIFICATION_CLOSE_ICON = 'userNotificationBarExit',

	REVEAL_CLASS = 'reveal',

	GENERIC_SERVER_MESSAGE = 'We have an issue with our servers. Please reload this page and try again. If you see this' +
		'message again, please contact us at ' + config.SUPPORT_PHONE_NUMBER;

// ----------------- PRIVATE VARIABLES -----------------------------

// Elements
var _serverNotificationBar = document.getElementById(USER_NOTIFICATION_BAR),
	_messageArea = document.getElementById(USER_NOTIFICATION_MESSAGE_SECTION);

// ----------------- PRIVATE METHODS -----------------------------

/**
 * Function that hides the notification bar that informs users that there may be some server issues
 *
 * @author kinsho
 */
function _hideGenericServerError()
{
	_serverNotificationBar.classList.remove(REVEAL_CLASS);
}

// ----------------- MODULE -----------------------------

var notifications =
{
	/**
	 * Function that shows a notification bar indicating that there may be some server issues
	 *
	 * @author kinsho
	 */
	showGenericServerError: function ()
	{
		_messageArea.innerHTML = GENERIC_SERVER_MESSAGE;
		_serverNotificationBar.classList.add(REVEAL_CLASS);
	},

	/**
	 * Function that shows a notification bar containing a specialized message
	 *
	 * @params {String} message - the message to show within the notification area
	 *
	 * @author kinsho
	 */
	showSpecializedServerError: function (message)
	{
		_messageArea.innerHTML = message;
		_serverNotificationBar.classList.add(REVEAL_CLASS);
	},

	/**
	 * Public function that outside modules can use to hide the notification bar from view programatically
	 *
	 * @author kinsho
	 */
	hideServerError: function ()
	{
		_hideGenericServerError();
	}
};

// ----------------- LISTENERS -----------------------------

document.getElementById(USER_NOTIFICATION_CLOSE_ICON).addEventListener('click', _hideGenericServerError);

// ----------------- EXPORT -----------------------------

export default notifications;