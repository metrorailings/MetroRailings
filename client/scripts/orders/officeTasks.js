// ----------------- EXTERNAL MODULES --------------------------

import _jQuery from 'jquery';
import _slick from 'slick';

// ----------------- ENUMS/CONSTANTS ---------------------------

var TASKS_LIST = 'tasksList',

	TASK_ACTIONS_CLASS = 'taskActions',
	VISIBILITY_CLASS = 'visible',

	UPWAVE_CARD_URL = 'https://metrorailings.upwave.io/board/::boardID/view/::viewID/card/::cardID',

	BOARD_ID_PLACEHOLDER = '::boardID',
	VIEW_ID_PLACEHOLDER = '::viewID',
	CARD_ID_PLACEHOLDER = '::cardID';

// ----------------- PRIVATE VARIABLES ---------------------------

// Elements
var _tasksList = document.getElementById(TASKS_LIST),
	$_tasksList = $(_tasksList);

// ----------------- LISTENERS ---------------------------

/**
 * Function meant to redirect the user to UpWave in case they want to modify the card in any way
 *
 * @param {Event} event - the event associated with the firing of this event
 *
 * @author kinsho
 */
function navigateToUpWave(event)
{
	var task = event.currentTarget,
		boardID = task.dataset.boardId,
		cardID = task.dataset.cardId,
		url = UPWAVE_CARD_URL;

	url = url.replace(BOARD_ID_PLACEHOLDER, boardID);
	url = url.replace(CARD_ID_PLACEHOLDER, cardID);
	url = url.replace(VIEW_ID_PLACEHOLDER, boardID - 10);

	window.open(url);
}

// ----------------- DATA INITIALIZATION -----------------------------

$_tasksList.on('init', function()
{
	_tasksList.classList.add(VISIBILITY_CLASS);
});

$_tasksList.slick(
{
	adaptiveHeight: true,
	slidesToShow: 1,
	slidesToScroll: 1,
	arrows: true,
	dots: true,
	autoplay: true,
	autoplaySpeed: 6000
});

// ----------------- LISTENER INITIALIZATION -----------------------------

var taskActionContainers = document.getElementsByClassName(TASK_ACTIONS_CLASS),
	i;

for (i = taskActionContainers.length - 1; i >= 0; i--)
{
	taskActionContainers[i].children[0].addEventListener('click', navigateToUpWave);
}