// ----------------- ENUMS/CONSTANTS ---------------------------

var QUESTION_CLASS = 'faqsQuestion',
	ANSWER_CLASS = 'faqsAnswer',
	REVEAL_CLASS = 'reveal';

// ----------------- LISTENERS ---------------------------

/**
 * Function meant to reveal an answer to whatever question that the user has clicked on
 *
 * @param {Event} event - the event object associated with the firing of this listener
 *
 * @author kinsho
 */
function revealAnswer(event)
{
	var question = event.currentTarget,
		questionContainer = question.parentNode,
		answer = questionContainer.getElementsByClassName(ANSWER_CLASS)[0];

	answer.classList.add(REVEAL_CLASS);
}

// ----------------- LISTENER INITIALIZATION -----------------------------

var questions = document.getElementsByClassName(QUESTION_CLASS),
	i;

for (i = questions.length - 1; i >= 0; i--)
{
	questions[i].addEventListener('click', revealAnswer);
}

// ----------------- PAGE INITIALIZATION -----------------------------

// If the user was led to this page to seek out the answer to a specific question, then show the answer to that
// question automatically

var currentURL = window.location.href,
	hashSignLocation = currentURL.indexOf('#');

if (hashSignLocation > -1)
{
	// Use the existing reveal listener to show the answer
	revealAnswer(
	{
		currentTarget: document.getElementById(currentURL.slice(hashSignLocation + 1))
	});
}