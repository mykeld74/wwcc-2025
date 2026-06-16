import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { fetchCalendarEventDetailForPage } from '$lib/server/planningCenterCalendar';

export const load: PageServerLoad = async ({ params }) => {
	const eventId = params.eventId;
	if (!eventId) {
		throw error(404, 'Event not found');
	}

	const detail = await fetchCalendarEventDetailForPage(eventId);
	if (!detail) {
		throw error(404, 'Event not found');
	}

	return { detail };
};
