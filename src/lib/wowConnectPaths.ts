import type { CalendarUiEvent } from '$lib/calendarEventTypes';

export const wowConnectEventHref = (event: CalendarUiEvent) =>
	`/women-of-westwoods/wow-connect/events/${event.eventId}`;
