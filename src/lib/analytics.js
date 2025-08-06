// Google Analytics utility functions for custom event tracking

/**
 * Track a custom event in Google Analytics
 * @param {string} eventName - The name of the event
 * @param {object} parameters - Additional parameters for the event
 */
export function trackEvent(eventName, parameters = {}) {
	if (typeof window !== 'undefined' && window.gtag) {
		window.gtag('event', eventName, parameters);
	}
}

/**
 * Track button clicks
 * @param {string} buttonName - The name/identifier of the button
 * @param {string} location - Where the button is located (optional)
 */
export function trackButtonClick(buttonName, location = '') {
	trackEvent('button_click', {
		button_name: buttonName,
		location: location,
		page_title: document.title,
		page_location: window.location.href
	});
}

/**
 * Track form submissions
 * @param {string} formName - The name/identifier of the form
 */
export function trackFormSubmission(formName) {
	trackEvent('form_submit', {
		form_name: formName,
		page_title: document.title,
		page_location: window.location.href
	});
}

/**
 * Track external link clicks
 * @param {string} linkUrl - The URL being clicked
 * @param {string} linkText - The text of the link
 */
export function trackExternalLink(linkUrl, linkText = '') {
	trackEvent('external_link_click', {
		link_url: linkUrl,
		link_text: linkText,
		page_title: document.title,
		page_location: window.location.href
	});
}

/**
 * Track social media clicks
 * @param {string} platform - The social media platform
 * @param {string} action - The action being performed (e.g., 'follow', 'share')
 */
export function trackSocialMedia(platform, action = 'click') {
	trackEvent('social_media_click', {
		platform: platform,
		action: action,
		page_title: document.title,
		page_location: window.location.href
	});
}
