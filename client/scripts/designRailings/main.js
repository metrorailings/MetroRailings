// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/designRailings/viewModel';
import carousel from 'client/scripts/utility/optionsCarousel';
import gallery from 'client/scripts/utility/gallery';

import typeDesigns from 'shared/designs/typeDesigns';
import postDesigns from 'shared/designs/postDesigns';
import postEndDesigns from 'shared/designs/postEndDesigns';
import postCapDesigns from 'shared/designs/postCapDesigns';
import centerDesigns from 'shared/designs/centerDesigns';

import colorSection from 'client/scripts/designRailings/colorSection';
import submissionSection from 'client/scripts/designRailings/submissionSection';

// ----------------- ENUMS/CONSTANTS ---------------------------

var DESIGN_TEMPLATE = 'designTemplate',

	DESIGN_PREVIEW_PIC_CLASS = 'designPreview',
	MAIN_PICTURE_CLASS = 'enlargedCarouselPicture',
	FADE_CLASS = 'fade',
	HIDE_CLASS = 'hide',
	SELECTED_CLASS = 'selected',
	UNSELECTED_CLASS = 'unselected',
	SELECT_DESIGN_BUTTON = 'designChosenButton',

	SET_SELECTED_ICON_LISTENER = 'setSelectedIcon',

	VIEW_MODEL_DESIGN_PROPERTIES =
	{
		TYPE: 'type',
		POST: 'postDesign',
		POST_END: 'postEndDesign',
		POST_CAP: 'postCapDesign',
		CENTER: 'centerDesign'
	};

// ----------------- HANDLEBARS HELPERS ---------------------------

Handlebars.registerHelper('if_more_than_one_image', function(collection, block)
{
	return (collection.length > 1 ? block.fn(this) : block.inverse(this));
});

// ----------------- PRIVATE FUNCTIONS ---------------------------

/**
 * Major function responsible for moving the panels of the posts carousel around as the user
 * selects different options
 *
 * @param {Number} index - the index of the option chosen by the user
 *
 * @returns {Object} - a collection of data and pictures to better illustrate to the user the details of a
 * 		particular design
 *
 * @author kinsho
 */
function _movePostDesignCarousel(index)
{
	var data = postDesigns.designMetadata[index] || {};

	// Note the data we need to determine if the user has already selected this design
	data.selection = vm.postDesign;
	data.isSelected = (vm.postDesign === data.id);

	// Let's also note what property of the view model will be effected should this design be selected
	data.vmProp = VIEW_MODEL_DESIGN_PROPERTIES.POST;

	return data;
}

/**
 * Major function responsible for moving the panels of the post ends carousel around as the user
 * selects different options
 *
 * @param {Number} index - the index of the option chosen by the user
 *
 * @returns {Object} - a collection of data and pictures to better illustrate to the user the details of a
 * 		particular design
 *
 * @author kinsho
 */
function _movePostEndDesignCarousel(index)
{
	var data = postEndDesigns.designMetadata[index] || {};

	// Note the data we need to determine if the user has already selected this design
	data.selection = vm.postEndDesign;
	data.isSelected = (vm.postEndDesign === data.id);

	// Let's also note what property of the view model will be effected should this design be selected
	data.vmProp = VIEW_MODEL_DESIGN_PROPERTIES.POST_END;

	return data;
}

/**
 * Major function responsible for moving the panels of the post tops carousel around as the user
 * selects different options
 *
 * @param {Number} index - the index of the option chosen by the user
 *
 * @returns {Object} - a collection of data and pictures to better illustrate to the user the details of a
 * 		particular design
 *
 * @author kinsho
 */
function _movePostCapDesignCarousel(index)
{
	var data = postCapDesigns.designMetadata[index] || {};

	// Note the data we need to determine if the user has already selected this design
	data.selection = vm.postCapDesign;
	data.isSelected = (vm.postCapDesign === data.id);

	// Let's also note what property of the view model will be effected should this design be selected
	data.vmProp = VIEW_MODEL_DESIGN_PROPERTIES.POST_CAP;

	return data;
}

/**
 * Major function responsible for moving the panels of the center designs carousel around as the user
 * selects different options
 *
 * @param {Number} index - the index of the option chosen by the user
 *
 * @returns {Object} - a collection of data and pictures to better illustrate to the user the details of a
 * 		particular design
 *
 * @author kinsho
 */
function _moveCenterDesignCarousel(index)
{
	var data = centerDesigns.designMetadata[index] || {};

	// Note the data we need to determine if the user has already selected this design
	data.selection = vm.centerDesign;
	data.isSelected = (vm.centerDesign === data.id);

	// Let's also note what property of the view model will be effected should this design be selected
	data.vmProp = VIEW_MODEL_DESIGN_PROPERTIES.CENTER;

	return data;
}

/**
 * Function used to conduct any logic that needs to be processed following a new panel being loaded into the carousel
 *
 * @param {HTMLElement} viewer - the panel itself
 *
 * @author kinsho
 */
function _newDesignTemplateLoaded(viewer)
{
	var designPreviewPics = viewer.getElementsByClassName(DESIGN_PREVIEW_PIC_CLASS),
		enlargedPic = viewer.getElementsByClassName(MAIN_PICTURE_CLASS)[0],
		selectionButton = viewer.getElementsByClassName(SELECT_DESIGN_BUTTON)[0];

	// Ensure that whenever the user clicks on a preview image, the image is loaded into the image viewer
	for (let i = designPreviewPics.length - 1; i >= 0; i--)
	{
		designPreviewPics[i].addEventListener('click', (event) =>
		{
			var selectedPic = event.currentTarget;

			// Mark which picture has been selected
			for (let j = designPreviewPics.length - 1; j >= 0; j--)
			{
				if (designPreviewPics[j].src === selectedPic.src)
				{
					designPreviewPics[j].classList.add(SELECTED_CLASS);
				}
				else
				{
					designPreviewPics[j].classList.remove(SELECTED_CLASS);
				}
			}

			// Fade out the picture, and then switch it out
			enlargedPic.classList.add(FADE_CLASS);
			window.setTimeout(() =>
			{
				enlargedPic.src = designPreviewPics[i].src;
				enlargedPic.classList.remove(FADE_CLASS);
			}, 500);
		});
	}

	if (selectionButton)
	{
		// Also allow for the user to select or deselect the design
		selectionButton.addEventListener('click', () =>
		{
			var vmProp = selectionButton.dataset.vmProp,
				designCode = selectionButton.dataset.designCode,
				wasSelected = (vm[vmProp] === designCode);

			if (wasSelected)
			{
				vm[vmProp] = '';

				viewer.dispatchEvent(new CustomEvent(SET_SELECTED_ICON_LISTENER, { detail: true, bubbles: true }));

				selectionButton.getElementsByClassName(SELECTED_CLASS)[0].classList.add(HIDE_CLASS);
				selectionButton.getElementsByClassName(UNSELECTED_CLASS)[0].classList.remove(HIDE_CLASS);

				selectionButton.classList.add(UNSELECTED_CLASS);
				selectionButton.classList.remove(SELECTED_CLASS);
			}
			else
			{
				vm[vmProp] = designCode;

				viewer.dispatchEvent(new CustomEvent(SET_SELECTED_ICON_LISTENER, { bubbles: true }));

				selectionButton.getElementsByClassName(SELECTED_CLASS)[0].classList.remove(HIDE_CLASS);
				selectionButton.getElementsByClassName(UNSELECTED_CLASS)[0].classList.add(HIDE_CLASS);

				selectionButton.classList.remove(UNSELECTED_CLASS);
				selectionButton.classList.add(SELECTED_CLASS);
			}
		});
	}

	if (enlargedPic)
	{
		enlargedPic.addEventListener('click', (event) =>
		{
			gallery.open([event.currentTarget.src], 0);
		});
	}
}

// ----------------- VIEW MODEL INITIALIZATION -----------------------------

var propKeys = Object.keys(VIEW_MODEL_DESIGN_PROPERTIES);

for (let i = propKeys.length - 1; i >= 0; i--)
{
	vm[propKeys[i]] = '';
}

// ----------------- MODULE INITIALIZATION -----------------------------

// Instantiate all the carousels
new carousel(POST_DESIGN_CAROUSEL, postDesigns.options, _movePostDesignCarousel, DESIGN_TEMPLATE, vm, _newDesignTemplateLoaded);
new carousel(POST_END_DESIGN_CAROUSEL, postEndDesigns.options, _movePostEndDesignCarousel, DESIGN_TEMPLATE, vm, _newDesignTemplateLoaded);
new carousel(POST_CAPS_DESIGN_CAROUSEL, postCapDesigns.options, _movePostCapDesignCarousel, DESIGN_TEMPLATE, vm, _newDesignTemplateLoaded);
new carousel(CENTER_DESIGN_CAROUSEL, centerDesigns.options, _moveCenterDesignCarousel, DESIGN_TEMPLATE, vm, _newDesignTemplateLoaded);