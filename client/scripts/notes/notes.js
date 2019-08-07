/**
 * @main notes
 */

// ----------------- EXTERNAL MODULES --------------------------

import axios from 'client/scripts/utility/axios';
import tooltipManager from 'client/scripts/utility/tooltip';
import handlebarHelpers from 'client/scripts/utility/handlebarHelpers';

import viewModel from 'client/scripts/notes/viewModel';

// ----------------- ENUMS/CONSTANTS --------------------------

const NOTE_TEXTAREA = 'newNoteText',
	NOTE_TYPE_SELECT = 'noteType',
	TASK_ASSIGN_TO_SELECT = 'taskAssignTo',
	NOTE_SAVE_BUTTON = 'noteSave',
	NOTE_RECORD_CONTAINER = 'noteRecordContainer',
	NEW_NOTE_CONTAINER = 'newNoteUpload',
	LOAD_NOTES_LINK = 'loadNotesLink',

	NOTE_RECORD_TEMPLATE = 'noteRecordTemplate',

	SAVE_NOTE_URL = 'notes/saveNewNote',
	FETCH_NOTES_URL = 'notes/retrieveNotesByOrderId',

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

// ----------------- PRIVATE FUNCTION --------------------------

/**
 * Function responsible for loading a new note record into an existing list of note records
 *
 * @param {Object} note - the note data record which will be used to create the new HTML record
 * @param {HTMLElement} noteRecordContainer - the container in which to pop in the new record
 *
 * @author kinsho
 */
function _loadNewRecord(note, noteRecordContainer)
{
	let newHTML = document.createElement('template');
	newHTML.innerHTML = noteRecordTemplate(note);
	noteRecordContainer.insertBefore(newHTML.content.firstChild, noteRecordContainer.firstElementChild);
}

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
	// Instantiate the view model that will be associated with the section that will be used to create new notes
	let vm = new viewModel(notesContainer.getElementsByClassName(NEW_NOTE_CONTAINER)[0]),
		noteTextarea = notesContainer.getElementsByClassName(NOTE_TEXTAREA)[0],
		noteTypeSelect = notesContainer.getElementsByClassName(NOTE_TYPE_SELECT)[0],
		assignToSelect = notesContainer.getElementsByClassName(TASK_ASSIGN_TO_SELECT)[0],
		saveButton = notesContainer.getElementsByClassName(NOTE_SAVE_BUTTON)[0],
		noteRecordContainer = notesContainer.getElementsByClassName(NOTE_RECORD_CONTAINER)[0],
		loadNotesLink = notesContainer.parentElement.getElementsByClassName(LOAD_NOTES_LINK)[0],

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

		loadNotes = () =>
		{
			axios.post(FETCH_NOTES_URL, { id : vm.orderId }, true).then((response) =>
			{
				let notes = response.data;

				// Remove the link now that we're loading the rest of the notes on the screen
				loadNotesLink.remove();

				// Wipe out all existing note records for the order in context
				while (noteRecordContainer.lastChild)
				{
					noteRecordContainer.lastChild.remove();
				}

				// Render all the notes under the notes record container again with the data returned from the back end
				for (let i = notes.length - 1; i >= 0; i -= 1)
				{
					_loadNewRecord(notes[i], noteRecordContainer);
				}
			});
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
				// Format the text so that spacing is kept intact
				data.text = data.text.split('\n').join('<br />');

				axios.post(SAVE_NOTE_URL, data, true).then((response) =>
				{
					// Clear out the writing in the textarea now that we uploaded that text into our database
					vm.text = '';

					_loadNewRecord(response.data, noteRecordContainer);
				});
			}
		};

	// Initialize the listeners
	noteTextarea.addEventListener('change', saveText);
	noteTypeSelect.addEventListener('change', saveType);
	assignToSelect.addEventListener('change', saveAssignTo);
	saveButton.addEventListener('click', saveNote);
	if (loadNotesLink)
	{
		loadNotesLink.addEventListener('click', loadNotes);
	}
}

// ----------------- EXPORT ---------------------------

export default initNotesTextfield;