import type { CalendarUiEvent } from '$lib/calendarEventTypes';

/** Event detail links scoped to the WOW Connect section. */
export const wowConnectEventHref = (event: CalendarUiEvent) =>
	`/women-of-westwoods/wow-connect/events/${event.eventId}`;
