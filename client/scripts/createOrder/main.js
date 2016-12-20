// ----------------- EXTERNAL MODULES --------------------------

import smoothScroll from 'smoothScroll';

import vm from 'client/scripts/createOrder/viewModel';
import typeSection from 'client/scripts/createOrder/typeSection';
import curvesSection from 'client/scripts/createOrder/curvesSection';
import lengthSection from 'client/scripts/createOrder/lengthSection';
import styleSection from 'client/scripts/createOrder/styleSection';
import colorSection from 'client/scripts/createOrder/colorsSection';
import submissionSection from 'client/scripts/createOrder/submissionSection';

// ----------------- ENUMS/CONSTANTS ---------------------------

var SCROLL_DOWN_ALERT = 'scrollDownLabel',
	LENGTH_SECTION = 'lengthSection',
	STYLE_SECTION = 'styleSection',
	CURVES_SECTION = 'curvesSection',
	COLOR_SECTION = 'colorSection',

	PICTURE_BUTTON_CLASS = 'pictureButton',
	PRESS_DOWN_CLASS = 'pressDown',
	REVEAL_CLASS = 'reveal';

// ----------------- PRIVATE VARIABLES ---------------------------

	// Elements
var _scrollDownAlert = document.getElementById(SCROLL_DOWN_ALERT),
	_curvesSection = document.getElementById(CURVES_SECTION),
	_lengthSection = document.getElementById(LENGTH_SECTION),
	_styleSection = document.getElementById(STYLE_SECTION),
	_colorSection = document.getElementById(COLOR_SECTION);

// ----------------- PRIVATE FUNCTIONS ---------------------------

// ----------------- LISTENERS ---------------------------

/**
 * Function responsible for taking the user to the next section should the user click on the alert telling him to
 * scroll on down
 *
 * @author kinsho
 */
function scrollDownToNextSection()
{
	_scrollDownAlert.classList.remove(REVEAL_CLASS);

	switch (vm.userProgress)
	{
		case 2:
			smoothScroll.animateScroll(_curvesSection);
			break;

		case 3:
			smoothScroll.animateScroll(_lengthSection);
			break;

		case 4:
			smoothScroll.animateScroll(_styleSection);
			break;

		case 5:
			smoothScroll.animateScroll(_colorSection);
			break;

		default:
			break;
	}
}

/**
 * Function responsible for hiding the scroll alert that pops up should the user scroll manually down to the next
 * section
 *
 * @author kinsho
 */
function checkScrollBarPosition()
{
	var documentHeight = document.body.offsetHeight,
		scrollMaxY = window.scrollMaxY || document.documentElement.scrollHeight - document.documentElement.clientHeight,
		targetSectionY = 100, // Default offset from which to trigger the hiding of the scroll alert
		ratio;

	switch (vm.userProgress)
	{
		case 2:
			targetSectionY = _curvesSection.offsetTop;
			break;

		case 3:
			targetSectionY += _lengthSection.offsetTop;
			break;

		case 4:
			targetSectionY += _styleSection.offsetTop;
			break;

		case 5:
			targetSectionY += _colorSection.offsetTop;
			break;

		default:
			targetSectionY = 0;
			break;
	}

	ratio = Math.min(targetSectionY / documentHeight, 1.0);
	if ((window.scrollY / scrollMaxY) > ratio)
	{
		_scrollDownAlert.classList.remove(REVEAL_CLASS);
	}
}

/**
 * An event that attaches a class to simulate a button press on a picture icon
 *
 * @param {Event} event - the event associated with the firing of this listener
 */
function pictureButtonPressed(event)
{
	event.currentTarget.classList.add(PRESS_DOWN_CLASS);
}

/**
 * An event that attaches a class to simulate a button release on a picture icon
 *
 * @param {Event} event - the event associated with the firing of this listener
 */
function pictureButtonReleased(event)
{
	event.currentTarget.classList.remove(PRESS_DOWN_CLASS);
}

// ----------------- LISTENER INITIALIZATION -----------------------------

var pictureButtons = document.getElementsByClassName(PICTURE_BUTTON_CLASS),
	i;

// Attach standardized event listeners to the picture icons on the page
for (i = 0; i < pictureButtons.length; i++)
{
	pictureButtons[i].addEventListener('mousedown', pictureButtonPressed);
	pictureButtons[i].addEventListener('mouseup', pictureButtonReleased);
}

_scrollDownAlert.addEventListener('click', scrollDownToNextSection);
window.addEventListener('scroll', checkScrollBarPosition);

// ----------------- DATA INITIALIZATION -----------------------------

vm.userProgress = 1;

// ----------------- PAGE INITIALIZATION -----------------------------

smoothScroll.init();