/**
 * @main confirmationModal
 */

// ----------------- ENUMS/CONSTANTS --------------------------

var MODAL_OVERLAY = 'confirmationModalOverlay',
	CONFIRMATION_MODAL = 'confirmationModal',
	CONFIRMATION_MODAL_BODY = 'confirmationModalBody',

	CONFIRMATION_MODAL_YES_BUTTON = 'confirmationModalYes',
	CONFIRMATION_MODAL_NO_BUTTON = 'confirmationModalNo',

	REVEAL_CLASS = 'show',
	SURFACE_CLASS = 'surface',
	FADE_CLASSES =
	{
		IN_DOWN: 'fadeInDown',
		OUT_DOWN: 'fadeOutDown'
	};

// ----------------- PRIVATE MEMBERS --------------------------

var _yesCallback, // the callback function to execute when the user clicks yes
	_noCallback, // the callback function to execute when the user clicks no
	_modalExitCallback, // the callback function to execute once the modal finally exits (either the yes or no callback)
	_messages, // the collection of messages to show to the user, one after the other
	_nextIndex = 0, // the index of the message currently loaded in the dialog

	// Modal elements
	_modalOverlay = document.getElementById(MODAL_OVERLAY),
	_modal = document.getElementById(CONFIRMATION_MODAL),
	_modalBody = document.getElementById(CONFIRMATION_MODAL_BODY);

// ----------------- PRIVATE FUNCTIONS --------------------------

/**
 * Function used to manage the shifting and textual content of the confirmation modal
 *
 * @author kinsho
 */
function _manageTransitions()
{
	// If we have more messages to show, fade in a new modal with the next message in the queue
	if (_messages[_nextIndex])
	{
		fadeOut(fadeIn);
	}
	// We have no more messages to show, meaning we can close the modal
	else
	{
		fadeOut(exitModal);
	}
}

/**
 * Function used to load text into the modal, if new text is available
 *
 * @author kinsho
 */
function _loadText()
{
	// Load the modal body with the next sequential message from the collection
	_modalBody.innerHTML = _messages[_nextIndex];

	// Increment the index field so that we know which message to display next, if need be
	_nextIndex += 1;
}

// ----------------- LISTENERS --------------------------

// The following are animation listeners designed to gracefully manage the fading of the modal

function fadeOut(callback)
{
	// Trigger the next series of instructions to execute
	_modal.addEventListener('animationend', callback);

	// Now fade the modal downways
	_modal.classList.remove(FADE_CLASSES.IN_DOWN);
	_modal.classList.add(FADE_CLASSES.OUT_DOWN);
}

function fadeIn()
{
	_modal.removeEventListener('animationend', fadeIn);
	_modalOverlay.removeEventListener('transitionend', fadeIn);

	// Load in some new text before fading the modal back into view
	_loadText();

	// Now fade the modal downward
	_modal.classList.remove(FADE_CLASSES.OUT_DOWN);
	_modal.classList.add(FADE_CLASSES.IN_DOWN);
}

function exitModal()
{
	_modal.removeEventListener('animationend', exitModal);

	// Let's trigger some logic to close out the modal
	_modalOverlay.addEventListener('transitionend', desurface);
	_modalOverlay.classList.remove(REVEAL_CLASS);

	// Do not forget to trigger the context-specific logic
	_modalExitCallback();
}

function desurface()
{
	_modalOverlay.removeEventListener('transitionend', desurface);

	_modalOverlay.classList.remove(SURFACE_CLASS);
}

/**
 * Listener used to either invoke context-specific logic when the user confirms his selection
 * or navigate to the next confirmation modal
 *
 * @author kinsho
 */
function confirmed()
{
	_modalExitCallback = _yesCallback;

	_manageTransitions();
}

/**
 * Listener used to close the modal and invoke context-specific logic when the user cancels his selection
 *
 * @author kinsho
 */
function cancelled()
{
	_modalExitCallback = _noCallback;

	// Set the next index to be past the length of the messages array so that we can trigger the logic to exit the modal
	_nextIndex = _messages.length;

	_manageTransitions();
}

// ----------------- MODULE ---------------------------

var modalModule =
{
	/**
	 * Function responsible for initializing and launching a new modal
	 *
	 * @param {Array<String>} messages - an array of messages to display to the user that describe whatever needs to
	 * 		be explicitly confirmed
	 * @param {Function} yesCallback - the function to execute once the user confirms his choice
	 * @param {Function} noCallback - the function to execute once the user backs away from confirming his choice
	 *
	 * @author kinsho
	 */
	open: function(messages, yesCallback, noCallback)
	{
		// Initialize the modal with specialized values
		_messages = messages;
		_nextIndex = 0;
		_yesCallback = yesCallback;
		_noCallback = noCallback;

		// Slide the modal down into view after the overlay fades in
		_modalOverlay.addEventListener('transitionend', fadeIn);

		// Now fade into the overlay
		_modalOverlay.classList.add(SURFACE_CLASS);
		_modalOverlay.classList.add(REVEAL_CLASS);
	}
};

// ----------------- LISTENER INITIALIZATION --------------------------

document.getElementById(CONFIRMATION_MODAL_YES_BUTTON).addEventListener('click', confirmed);
document.getElementById(CONFIRMATION_MODAL_NO_BUTTON).addEventListener('click', cancelled);

// ----------------- EXPORT ---------------------------

export default modalModule;