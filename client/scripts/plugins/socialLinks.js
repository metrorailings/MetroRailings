/**
 * @main socialLinks
 */

// ----------------- EXTERNAL MODULES --------------------------


// ----------------- ENUMS/CONSTANTS ---------------------------

var FACEBOOK_SHARE_ICON = 'facebookShareLink',
	REDDIT_SHARE_ICON = 'redditShareLink',
	TWITTER_SHARE_ICON = 'twitterShareLink';

// ----------------- PRIVATE FUNCTIONS ---------------------------

// ----------------- LISTENERS ---------------------------

function shareOnFacebook()
{
	window.FB.ui(
	{
		method: 'share',
		href: 'https://www.nuforcfun.com',
	}, function() {});
}

function shareOnTwitter()
{
	window.location = '//twitter.com/intent/tweet?text=http://www.nuforcfun.com';
	return false;
}

function shareOnReddit()
{
	window.location = '//www.reddit.com/submit?url=' + encodeURIComponent(window.location);
	return false;
}

// ----------------- LINKER INITIALIZATION -----------------------------

// Facebook share link
document.getElementById(FACEBOOK_SHARE_ICON).addEventListener('click', shareOnFacebook);

// Twitter share link
document.getElementById(TWITTER_SHARE_ICON).addEventListener('click', shareOnTwitter);

// Reddit share link
document.getElementById(REDDIT_SHARE_ICON).addEventListener('click', shareOnReddit);