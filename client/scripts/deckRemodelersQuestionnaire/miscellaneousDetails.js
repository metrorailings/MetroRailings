// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/deckRemodelersQuestionnaire/viewModel';

import dateUtility from 'shared/dateUtility';

// ----------------- ENUMS/CONSTANTS ---------------------------

const OPEN_TEXT_QUESTION = 'openTextQuestion',
	OPEN_TEXT_RESPONSE = 'openTextResponse',
	DUE_DATE = 'dueDate';

// ----------------- PRIVATE MEMBERS ---------------------------

// Elements
let _openTextQuestions = document.getElementsByClassName(OPEN_TEXT_QUESTION),
	_openTextResponses = document.getElementsByClassName(OPEN_TEXT_RESPONSE),
	_dueDateField = document.getElementById(DUE_DATE);

// ----------------- PRIVATE FUNCTION ---------------------------

/**
 * A function that formats the date to a user-friendly string
 *
 * @param {HTMLElement} input - the element with the selected date
 * @param {Date} date - the date to format
 *
 * @author kinsho
 */
function _formatDate(input, date)
{
	input.value = dateUtility.DAYS[date.getDay()]
		+ ', ' + dateUtility.FULL_MONTHS[date.getMonth()]
		+ ' ' + date.getDate() + dateUtility.findOrdinalSuffix(date.getDate())
		+ ', ' + date.getFullYear();
}

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for setting a due date inside the view model
 *
 * @param {Datepicker} instance - the datepicker instance itself
 * @param {Date} date - the date to record
 *
 * @author kinsho
 */
function setDueDate(instance, date)
{
	vm.dueDate = date;
}

/**
 * Listener responsible for recording an updated response into the view model
 *
 * @param {Event} event - the event responsible for invoking this function
 *
 * @author kinsho
 */
function setResponse(event)
{
	let responseField = event.currentTarget,
		index = window.parseInt(responseField.parentNode.dataset.index, 10);

	vm.questions[index].response = responseField.value;
}

// ----------------- LISTENER INITIALIZATION -----------------------------

for (let i = 0; i < _openTextResponses.length; i += 1)
{
	_openTextResponses[i].addEventListener('change', setResponse);
}

// ----------------- DATA INITIALIZATION -----------------------------

datepicker(_dueDateField,
{
	onSelect : setDueDate,
	formatter : _formatDate,
	position : 'tl'
});

// Set all the questions inside the view model
vm.questions = [];
for (let i = 0; i < _openTextQuestions.length; i += 1)
{
	vm.questions[i] =
	{
		question : _openTextQuestions[i].innerHTML.trim()
	};
}