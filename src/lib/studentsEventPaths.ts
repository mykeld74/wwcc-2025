import type { CalendarUiEvent } from '$lib/calendarEventTypes';

/** Event detail links scoped to the Westwoods Students section. */
export const studentsEventHref = (event: CalendarUiEvent) =>
	`/westwoods-students/events/${event.eventId}`;
