import type { PageServerLoad } from './$types';
import { fetchAllCalendarUiEvents } from '$lib/server/planningCenterCalendar';

export const load: PageServerLoad = async () => {
	const events = await fetchAllCalendarUiEvents();
	return { events };
};
