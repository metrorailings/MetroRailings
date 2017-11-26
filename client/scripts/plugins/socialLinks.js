/**
 * @main socialLinks
 */

// ----------------- ENUMS/CONSTANTS ---------------------------

var FACEBOOK_SHARE_ICON = 'facebookShareLink',
	REDDIT_SHARE_ICON = 'redditShareLink',
	TWITTER_SHARE_ICON = 'twitterShareLink';

// ----------------- LISTENERS ---------------------------

function shareOnFacebook()
{
	window.FB.ui(
	{
		method: 'share',
		href: 'https://www.metrorailings.com',
	}, function() {});
}

function shareOnTwitter()
{
	window.location = '//twitter.com/intent/tweet?text=http://www.metrorailings.com';
	return false;
}

function shareOnReddit()
{
	window.location = '//www.reddit.com/submit?url=' + encodeURIComponent(window.location);
	return false;
}

// ----------------- LINKER INITIALIZATION -----------------------------

window.addEventListener('load', function()
{
	// Facebook share link
	document.getElementById(FACEBOOK_SHARE_ICON).addEventListener('click', shareOnFacebook);

	// Twitter share link
	document.getElementById(TWITTER_SHARE_ICON).addEventListener('click', shareOnTwitter);

	// Reddit share link
	document.getElementById(REDDIT_SHARE_ICON).addEventListener('click', shareOnReddit);
});
