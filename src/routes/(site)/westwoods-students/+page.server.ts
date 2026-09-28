import type { PageServerLoad } from './$types';
import { fetchStudentsUiEvents } from '$lib/server/planningCenterCalendar';

export const load: PageServerLoad = async () => {
	const events = await fetchStudentsUiEvents();
	return { events };
};
