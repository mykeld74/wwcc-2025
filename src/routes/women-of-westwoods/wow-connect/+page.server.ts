import type { PageServerLoad } from './$types';
import { fetchWowConnectUiEvents } from '$lib/server/planningCenterCalendar';

export const load: PageServerLoad = async () => {
	const events = await fetchWowConnectUiEvents();
	return { events };
};
