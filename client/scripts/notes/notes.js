/**
 * @main notes
 */

// ----------------- EXTERNAL MODULES --------------------------

import axios from 'client/scripts/utility/axios';
import tooltipManager from 'client/scripts/utility/tooltip';

import viewModel from 'client/scripts/notes/viewModel';

// ----------------- ENUMS/CONSTANTS --------------------------

const NOTE_TEXTAREA = 'newNoteText',
	NOTE_TYPE_SELECT = 'noteType',
	TASK_ASSIGN_TO_SELECT = 'taskAssignTo',
	NOTE_SAVE_BUTTON = 'noteSave',
	NOTE_RECORD_CONTAINER = 'noteRecordContainer',

	NEW_NOTE_TEMPLATE = 'newNoteTemplate',
	NOTE_RECORD_TEMPLATE = 'noteRecordTemplate',

	SAVE_NOTE_URL = 'notes/saveNote',

	NO_TEXT_FOUND_MESSAGE = 'Please enter some text here before trying to save the note.',

	CATEGORIES =
	{
		NEW : 'new',
		REPLY : 'reply',
		EDIT : 'edit'
	};

// ----------------- HANDLEBAR TEMPLATES --------------------------

/**
 * The partial to load note records into view
 */
const noteRecordTemplate = Handlebars.compile(document.getElementById(NOTE_RECORD_TEMPLATE).innerHTML);

// ----------------- MODULE ---------------------------

/**
 * Constructor function that'll help us manage new notes and tasks as they are generated through the notes interface
 *
 * @param {HTMLElement} notesContainer - the HTML container containing the notes section
 *
 * @author kinsho
 */
function initNotesTextfield(notesContainer)
{
	let vm = new viewModel(notesContainer),
		noteTextarea = notesContainer.getElementsByClassName(NOTE_TEXTAREA)[0],
		noteTypeSelect = notesContainer.getElementsByClassName(NOTE_TYPE_SELECT)[0],
		assignToSelect = notesContainer.getElementsByClassName(TASK_ASSIGN_TO_SELECT)[0],
		saveButton = notesContainer.getElementsByClassName(NOTE_SAVE_BUTTON)[0],
		noteRecordContainer = notesContainer.getElementsByClassName(NOTE_RECORD_CONTAINER)[0],

		// Define the listeners to allow us to set values into the view model
		saveText = () =>
		{
			vm.text = noteTextarea.value;
		},

		saveType = () =>
		{
			vm.type = noteTypeSelect.value;
		},

		saveAssignTo = () =>
		{
			vm.assignTo = assignToSelect.value;
		},

		saveNote = () =>
		{
			let data =
			{
				orderId : vm.orderId,
				text : vm.text,
				category : vm.category,
				type : vm.type,
				assignTo : vm.assignTo || '',
				assignFrom : vm.assignFrom || ''
			};

			// Close any warning tooltip that may have been open
			tooltipManager.closeTooltip(notesContainer, true);

			// If no text is actually present, reject the attempt to save this note
			if ( !(vm.text && vm.text.trim()) )
			{
				tooltipManager.setTooltip(notesContainer, NO_TEXT_FOUND_MESSAGE);
			}
			else if ((vm.category === CATEGORIES.NEW) || (vm.category === CATEGORIES.REPLY))
			{
				axios.post(SAVE_NOTE_URL, data, true).then((data) =>
				{
					// For new notes, create a note record and stick it to the top of the record container
					let newHTML = document.createElement('template');
					newHTML.innerHTML = noteRecordTemplate(data);
					noteRecordContainer.insertBefore(newHTML.content.firstChild, noteRecordContainer.firstElementChild);
				});
			}
		};

	// Initialize the listeners
	noteTextarea.addEventListener('change', saveText);
	noteTypeSelect.addEventListener('change', saveType);
	assignToSelect.addEventListener('change', saveAssignTo);
	saveButton.addEventListener('click', saveNote);
}

// ----------------- EXPORT ---------------------------

export default initNotesTextfield;