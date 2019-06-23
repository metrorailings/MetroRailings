/**
 * @main actionModal
 */

// ----------------- ENUMS/CONSTANTS --------------------------

const MODAL_OVERLAY = 'actionModalOverlay',
	ACTION_MODAL = 'actionModal',
	ACTION_MODAL_BODY = 'actionModalBody',

	ACTION_MODAL_OK_BUTTON = 'actionModalOk',

	REVEAL_CLASS = 'show',
	SURFACE_CLASS = 'surface',
	FADE_CLASSES =
	{
		IN_DOWN: 'fadeInDown',
		OUT_DOWN: 'fadeOutDown'
	};

// ----------------- PRIVATE MEMBERS --------------------------

let _okCallback, // the callback function to execute when the user successfully clicks OK
	_modalExitCallback, // the callback function to execute once the modal finally exits
	_listenerInitFunction, // the function to trigger in order to set up listeners on elements inside the modal body

	// Modal elements
	_modalOverlay = document.getElementById(MODAL_OVERLAY),
	_modal = document.getElementById(ACTION_MODAL),
	_modalBody = document.getElementById(ACTION_MODAL_BODY),
	_modalOkButton = document.getElementById(ACTION_MODAL_OK_BUTTON);

// ----------------- LISTENERS --------------------------

// The following are animation listeners designed to gracefully manage the fading of the modal

function fadeOut()
{
	// Trigger the next series of instructions to execute
	_modal.addEventListener('animationend', exitModal);

	// Now fade the modal downways
	_modal.classList.remove(FADE_CLASSES.IN_DOWN);
	_modal.classList.add(FADE_CLASSES.OUT_DOWN);
}

function fadeIn()
{
	_modal.removeEventListener('animationend', fadeIn);
	_modalOverlay.removeEventListener('transitionend', fadeIn);

	// Now fade the modal downward
	_modal.classList.remove(FADE_CLASSES.OUT_DOWN);
	_modal.classList.add(FADE_CLASSES.IN_DOWN);

	_listenerInitFunction();
}

function exitModal()
{
	_modal.removeEventListener('animationend', exitModal);
	_modalOverlay.removeEventListener('click', fadeOut);

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
 * Listener used to either invoke context-specific logic when the user successfully completes whatever action needs
 * to be completed
 *
 * @author kinsho
 */
function ok()
{
	_modalExitCallback = _okCallback;

	fadeOut();
}

/**
 * Listener used to clear a modal away from the screen should the user click outside the boundaries of the modal
 *
 * @author kinsho
 */
function overlayExit(event)
{
	if (event.target.id === MODAL_OVERLAY)
	{
		fadeOut();
	}
}

// ----------------- MODULE ---------------------------

let modalModule =
{
	/**
	 * Function responsible for initializing and launching a new modal
	 *
	 * @param {String} modalHTML - the HTML to load into the modal
	 * @param {Object} data - the data to use in order to populate any dynamic values in the body of the modal
	 * @param {Function} okCallback - the function to execute once the user successfully finishes the action he's
	 * 		been tasked with
	 * @param {Function} [listenerInitFunction] - the specialized function to execute in order to set up listeners
	 * 		on any form elements in the modal
	 *
	 * @author kinsho
	 */
	open: function(modalHTML, data, okCallback, listenerInitFunction)
	{
		// Initialize the modal with specialized values
		_okCallback = okCallback;
		_modalExitCallback = function(){}; // Just leave without executing any successive logic

		// Load the modal body with the HTML content
		_modalBody.innerHTML = Handlebars.compile(modalHTML)(data);

		// Execute any listeners that may be intended to add listeners to elements within the modal body
		_listenerInitFunction = listenerInitFunction || function(){};

		// Slide the modal down into view after the overlay fades in
		_modalOverlay.addEventListener('transitionend', fadeIn);

		// Now fade into the overlay
		_modalOverlay.classList.add(SURFACE_CLASS);
		_modalOverlay.classList.add(REVEAL_CLASS);

		// Add a listener to the overlay to allow us to exit the modal at any time
		_modalOverlay.addEventListener('click', overlayExit);
	},

	/**
	 * Function responsible for preventing the user from leaving the modal unless the required action has been
	 * successfully completed
	 *
	 * @author kinsho
	 */
	disableOk: function()
	{
		_modalOkButton.disabled = true;
	},

	/**
	 * Function that ensures the user is allowed to progress once the required action has been successfully completed
	 *
	 * @author kinsho
	 */
	enableOk: function()
	{
		_modalOkButton.disabled = false;
	}
};

// ----------------- LISTENER INITIALIZATION --------------------------

document.getElementById(ACTION_MODAL_OK_BUTTON).addEventListener('click', ok);

// ----------------- EXPORT ---------------------------

export default modalModule;