/**
 * Everything the invite feature needs in one place.
 *
 * The wording below is what people actually send to a friend, so it is meant
 * to be read and edited by whoever is running the invite push - not treated as
 * code. Change the copy here and every share button and sample block picks it
 * up.
 */

export const site = {
	name: 'Westwoods Community Church',
	shortName: 'Westwoods',

	/** Canonical production URL. Used for share links. */
	url: 'https://westwoodscc.org',

	/** Where an invited friend lands. The guest-facing page, not the home page. */
	landingPath: '/about-us/plan-a-visit'
} as const;

export const services = {
	timesLabel: '9:00 & 10:30am',
	dayLabel: 'Sunday',
	durationLabel: 'About 60-75 minutes',
	address: '7700 W. Woodard Drive, Lakewood, CO 80227',
	phone: '303.279.1616'
} as const;

/**
 * The one link everybody shares: westwoodscc.org/invite
 *
 * Deliberately bare - no query string. People *read* these links. It arrives in
 * a text from a friend, and a tracking URL makes a personal invitation look
 * like an ad. It also has to survive being read out loud and retyped.
 */
export function inviteLink(): string {
	return `${site.url}/invite`;
}

/**
 * Where /invite sends people, tagged for Google Analytics (G-55JS0EX64L,
 * configured in the site layout).
 *
 * The tagging happens here, on the redirect, rather than on the link itself -
 * so GA can still separate invite traffic from everything else while the link
 * people pass around stays clean. GA4 needs `utm_medium` as well as
 * `utm_source`; with a source alone it records the visit but files it under
 * Unassigned.
 */
export const campaignName = 'invite-a-friend';

export function campaignTarget(): string {
	const params = new URLSearchParams({
		utm_source: 'invite',
		utm_medium: 'link',
		utm_campaign: campaignName
	});

	return `${site.landingPath}?${params}`;
}

/** Pre-written invitation copy used by the share buttons and the share kit. */
export const invitation = {
	short: `You're invited to Westwoods Community Church - Sundays at 9:00 & 10:30am in Lakewood. Casual, about an hour, and everyone is welcome.`,
	subject: `Come to church with me sometime?`,
	sms: `Hey! Any interest in coming to church with me sometime? Westwoods, Sundays at 9 or 10:30am off Wadsworth and Morrison. It's casual, about an hour, and there's no pressure at all. Here's what to expect: `,
	email: `Hi,\n\nI wanted to invite you to come to church with me at Westwoods sometime.\n\nWe meet Sunday mornings at 9:00 and 10:30 at 7700 W. Woodard Drive in Lakewood. It's casual - jeans and a t-shirt are completely fine - and the service runs about an hour. There's coffee, there are classes for kids through elementary age if you want them, and nobody is going to single you out or ask you for anything.\n\nWhether church has been part of your life or not, you're genuinely welcome. I'd love for you to come with me.\n\nHere's a page that answers the usual questions - parking, kids, what to wear: `
} as const;
