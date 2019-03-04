/**
 * The view model for a new note being added to an order
 */

// ----------------- EXTERNAL MODULES --------------------------

import rQuery from 'client/scripts/utility/rQueryClient';

// ----------------- ENUMS/CONSTANTS --------------------------

const TYPE_CONTAINER = 'typeContainer',
	TYPE_SELECT = 'noteType',
	ASSIGN_TO_CONTAINER = 'assignToContainer',
	ASSIGN_TO_SELECT = 'taskAssignTo',
	ASSIGN_FROM_CONTAINER = 'assignFromContainer',
	NEW_NOTE_TEXT = 'newNoteText',

	ASSIGN_FROM_TEXT = 'assignFromText',
	HIDE_CLASS = 'hide',
	DISABLED_CLASS = 'disabled',

	CATEGORIES =
	{
		NEW : 'new',
		REPLY : 'reply',
		EDIT : 'edit'
	},

	TYPES =
	{
		NOTE : 'note',
		TASK : 'task'
	};

// ----------------- CONSTRUCTOR --------------------------

/**
 * The construction function
 *
 * @param {HTMLElement} newNoteContainer - the container wrapping the section where a user can add a new note
 *
 * @author kinsho
 */
function generateViewModel(newNoteContainer)
{
	let viewModel = {},
		typeSection = newNoteContainer.getElementsByClassName(TYPE_CONTAINER)[0],
		typeSelect = typeSection.getElementsByClassName(TYPE_SELECT)[0],
		assignToSection = newNoteContainer.getElementsByClassName(ASSIGN_TO_CONTAINER)[0],
		assignToSelect = assignToSection.getElementsByClassName(ASSIGN_TO_SELECT)[0],
		assignFromSection = newNoteContainer.getElementsByClassName(ASSIGN_FROM_CONTAINER)[0],
		assignFromStaticValue = assignFromSection.getElementsByClassName(ASSIGN_FROM_TEXT)[0],
		noteTextarea = newNoteContainer.getElementsByClassName(NEW_NOTE_TEXT)[0];

	// Order ID
	Object.defineProperty(viewModel, 'orderId',
	{
		configurable: true,
		enumerable: true,

		get: () =>
		{
			return viewModel.__orderId;
		},

		set: (value) =>
		{
			viewModel.__orderId = value;
		}
	});

	// Text
	Object.defineProperty(viewModel, 'text',
	{
		configurable: true,
		enumerable: true,

		get: () =>
		{
			return viewModel.__text;
		},

		set: (value) =>
		{
			viewModel.__text = value;

			rQuery.setField(noteTextarea, value);
		}
	});

	// Category
	Object.defineProperty(viewModel, 'category',
	{
		configurable: true,
		enumerable: true,

		get: () =>
		{
			return viewModel.__category;
		},

		set: (value) =>
		{
			viewModel.__category = value;

			// Adjust the controls depending on the context which we're dealing with right now
			if (value === CATEGORIES.REPLY)
			{
				typeSection.classList.add(HIDE_CLASS);
				assignToSection.classList.add(HIDE_CLASS);
				assignFromSection.classList.add(HIDE_CLASS);
			}
			else if (value === CATEGORIES.EDIT)
			{
				typeSection.classList.add(DISABLED_CLASS);
				typeSelect.disabled = true;
				assignToSection.classList.add(DISABLED_CLASS);
				assignToSelect.disabled = true;
				assignFromSection.classList.add(DISABLED_CLASS);
			}
		}
	});

	// Type
	Object.defineProperty(viewModel, 'type',
	{
		configurable: true,
		enumerable: true,

		get: () =>
		{
			return viewModel.__type;
		},

		set: (value) =>
		{
			viewModel.__type = value;

			// Adjust which controls are accessible depending on whether we are dealing with a note or a task
			if (value === TYPES.TASK)
			{
				assignToSection.classList.remove(HIDE_CLASS);
				assignFromSection.classList.remove(HIDE_CLASS);
			}
			else if (value === TYPES.NOTE)
			{
				assignToSection.classList.add(HIDE_CLASS);
				assignFromSection.classList.add(HIDE_CLASS);
			}

			rQuery.setField(typeSelect, value);
		}
	});

	// Assign To
	Object.defineProperty(viewModel, 'assignTo',
	{
		configurable: true,
		enumerable: true,

		get: () =>
		{
			return viewModel.__assignTo;
		},

		set: (value) =>
		{
			viewModel.__assignTo = value;

			rQuery.setField(assignToSelect, value);
		}
	});

	// Assigned From
	Object.defineProperty(viewModel, 'assignFrom',
	{
		configurable: true,
		enumerable: true,

		get: () =>
		{
			return viewModel.__assignTo;
		},

		set: (value) =>
		{
			viewModel.__assignFrom = value;

			assignFromStaticValue.innerHTML = value;
		}
	});

	// Set values into this view model depending on the values that are present in the HTML
	viewModel.orderId = newNoteContainer.dataset.orderId;
	viewModel.category = newNoteContainer.dataset.category;
	viewModel.text = noteTextarea.value || '';
	viewModel.type = typeSelect.value;
	viewModel.assignTo = assignToSelect.value;
	viewModel.assignFrom = assignFromStaticValue.innerHTML;

	return viewModel;
}

// ----------------- EXPORT -----------------------------

export default generateViewModel;