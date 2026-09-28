import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { fetchStudentsEventDetailForPage } from '$lib/server/planningCenterCalendar';

export const load: PageServerLoad = async ({ params }) => {
	const eventId = params.eventId;
	if (!eventId) {
		throw error(404, 'Event not found');
	}

	const detail = await fetchStudentsEventDetailForPage(eventId);
	if (!detail) {
		throw error(404, 'Event not found');
	}

	return { detail };
};
