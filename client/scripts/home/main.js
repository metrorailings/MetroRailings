// ----------------- EXTERNAL MODULES --------------------------

import gallerySection from 'client/scripts/home/gallerySection';
import orderSection from 'client/scripts/home/orderSection';

// ----------------- ENUMS/CONSTANTS ---------------------------

var PAGE_LOADER_CLASS = 'pageLoad',
	SURFACE_CLASS = 'surface',
	SHOW_CLASS = 'show',
	BANNER_IMAGE_CLASS = 'bannerImage',

	BACKGROUND_IMAGE_PHRASE = 'url("::imageSrc")',
	IMAGE_SRC_PLACEHOLDER = '::imageSrc',

	HOME_BANNER_ONE = 'homeBanner1',
	HOME_BANNER_TWO = 'homeBanner2',
	LOADING_VEIL = 'baseLoaderOverlay';

// ----------------- PRIVATE VARIABLES ---------------------------

var _bannerImages = [],
	_randomIndex = Math.floor(Math.random() * 3), // The random index to use to pull the first banner image to load into the main banner
	_activeHomeBanner = 1, // A tracker indicating which home banner is currently being shown

	// Elements
	_bannerImageElements = document.getElementsByClassName(BANNER_IMAGE_CLASS),
	_homeBannerOne = document.getElementById(HOME_BANNER_ONE),
	_homeBannerTwo = document.getElementById(HOME_BANNER_TWO),
	_loadingVeil = document.getElementById(LOADING_VEIL);

// ----------------- PRIVATE FUNCTIONS ---------------------------

// ----------------- LISTENERS ---------------------------

/**
 * Listener responsible for de-surfacing the page overlay and fading in the company name
 *
 * @author kinsho
 */
function _finishIntro()
{
	_loadingVeil.classList.remove(SURFACE_CLASS);
	_loadingVeil.removeEventListener('transitionend', _finishIntro);
}

/**
 * Interval function meant to change the home banner photos on a periodic basis
 *
 * @author kinsho
 */
function _revolveBannerImages()
{
	var visibleHomeBanner = (_activeHomeBanner === 1 ? _homeBannerOne : _homeBannerTwo),
		waitingHomeBanner = (_activeHomeBanner === 1 ? _homeBannerTwo : _homeBannerOne);

	// Figure out which photo to display next
	if (_randomIndex === 2)
	{
		_randomIndex = 0;
	}
	else
	{
		_randomIndex += 1;
	}

	// Set the new background image into the banner that will be shown very soon
	waitingHomeBanner.style.backgroundImage = BACKGROUND_IMAGE_PHRASE.replace(IMAGE_SRC_PLACEHOLDER, _bannerImages[_randomIndex]);

	// Switch out the banners that are currently visible
	visibleHomeBanner.classList.remove(SHOW_CLASS);
	waitingHomeBanner.classList.add(SHOW_CLASS);

	// Update the variable tracking which banner is active
	_activeHomeBanner = (_activeHomeBanner === 1 ? 2 : 1);
}

// ----------------- LISTENER INITIALIZATION -----------------------------

_loadingVeil.addEventListener('transitionend', _finishIntro);

// Set up an interval function that will periodically change out the background photo of the banner
window.setInterval(_revolveBannerImages, 5000);

// ----------------- PAGE INITIALIZATION -----------------------------

var i;

// Collect the source links for all the images that will need to be used
for (i = 0; i < _bannerImageElements.length; i++)
{
	_bannerImages.push(_bannerImageElements[i].src);
}

// Set the initial image into the home banner
_homeBannerOne.style.backgroundImage = BACKGROUND_IMAGE_PHRASE.replace(IMAGE_SRC_PLACEHOLDER, _bannerImages[_randomIndex]);

// Check to see if the page has been loaded after 7.5 seconds. If not, reload the page
window.setTimeout(() =>
{
	if (_loadingVeil.classList.contains(PAGE_LOADER_CLASS))
	{
		window.location.reload();
	}
}, 6000);