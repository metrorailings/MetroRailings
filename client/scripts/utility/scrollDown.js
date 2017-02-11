// ----------------- EXTERNAL MODULES --------------------------

import smoothScroll from 'smoothScroll';

// ----------------- ENUMS/CONSTANTS ---------------------------

var SCROLL_DOWN_ALERT = 'scrollDownLabel',
	ANCHOR_TAG_CLASS = 'scrollDownAnchor',

	REVEAL_CLASS = 'reveal';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
var _scrollDownAlert = document.getElementById(SCROLL_DOWN_ALERT);

// ----------------- PRIVATE FUNCTIONS ---------------------------

// ----------------- LISTENERS ---------------------------

/**
 * Function responsible for taking the user to the anchor point should the user click on the alert telling him to
 * scroll on down
 *
 * @author kinsho
 */
function scrollDownToNextSection()
{
	var anchor = document.getElementsByClassName(ANCHOR_TAG_CLASS)[0];

	if (anchor)
	{
		smoothScroll.animateScroll(anchor);
		scrollDownModule.hideAlert();
	}
}

/**
 * Function responsible for hiding the scroll alert that pops up should the user scroll manually down to the location
 * of the next anchor
 *
 * @author kinsho
 */
function checkScrollBarPosition()
{
	var documentHeight = document.body.offsetHeight,
		scrollMaxY = window.scrollMaxY || (document.documentElement.scrollHeight - document.documentElement.clientHeight),
		targetSectionY = 100, // Default offset from which to trigger the hiding of the scroll alert
		anchor = document.getElementsByClassName(ANCHOR_TAG_CLASS)[0],
		ratio;

	targetSectionY = (anchor ? anchor.offsetTop : targetSectionY);

	ratio = Math.min(targetSectionY / documentHeight, 1.0);
	if ((window.scrollY / scrollMaxY) > ratio)
	{
		scrollDownModule.hideAlert();
	}
}

// ----------------- MODULE DEFINITION -----------------------------

var scrollDownModule =
{
	/**
	 * Public function meant to show the alert and attach an anchor to the spot on the page that we are trying to
	 * get the user to scroll towards
	 *
	 * @param {HTMLElement} anchor - the element towards which we want the user to scroll
	 *
	 * @author kinsho
	 */
	showAlert: function (anchor)
	{
		_scrollDownAlert.classList.add(REVEAL_CLASS);
		anchor.classList.add(ANCHOR_TAG_CLASS);
	},

	/**
	 * Public function used to hide the alert and detach any lingering anchors that may be out there
	 *
	 * @author kinsho
	 */
	hideAlert: function ()
	{
		var anchor = document.getElementsByClassName(ANCHOR_TAG_CLASS)[0];

		_scrollDownAlert.classList.remove(REVEAL_CLASS);
		if (anchor)
		{
			anchor.classList.remove(ANCHOR_TAG_CLASS);
		}
	}
};

// ----------------- LISTENERS -----------------------------

_scrollDownAlert.addEventListener('click', scrollDownToNextSection);
window.addEventListener('scroll', checkScrollBarPosition);

// ----------------- PAGE INITIALIZATION -----------------------------

smoothScroll.init();

// ----------------- EXPORT -----------------------------

export default scrollDownModule;