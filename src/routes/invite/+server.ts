import { redirect } from '@sveltejs/kit';
import { campaignTarget } from '$lib/config/invite';
import type { RequestHandler } from './$types';

/**
 * Short link for print, announcements, and anything a person will actually
 * read: westwoodscc.org/invite -> Plan a Visit, tagged with the UTM parameters
 * Google Analytics needs.
 *
 * The tags live on this redirect rather than on the shared link, so what
 * someone pastes into a text stays clean.
 */
export const GET: RequestHandler = () => {
	// 302 rather than 301: the destination may well move, and a permanent
	// redirect would be cached in people's browsers.
	redirect(302, campaignTarget());
};
