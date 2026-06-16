import type { CalendarUiEvent } from '$lib/calendarEventTypes';

export const churchEventHref = (event: CalendarUiEvent) => `/events/${event.eventId}`;
