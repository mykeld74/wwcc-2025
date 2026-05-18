import type { CalendarUiEvent } from '$lib/calendarEventTypes';

export type CalendarEventHref = (event: CalendarUiEvent) => string;

export const defaultCalendarEventHref: CalendarEventHref = (event) =>
	`/events/${event.eventId}`;

export type CalendarEventsViewProps = {
	events?: CalendarUiEvent[];
	currentMonth?: Date;
	eventHref?: CalendarEventHref;
	heading?: string;
	emptyMonthMessage?: (monthYear: string) => string;
	calendarSelectHint?: string;
	viewToggleAriaLabel?: string;
};

export const defaultEmptyMonthMessage = (monthYear: string) =>
	`No events in ${monthYear}. Try another month.`;

export const defaultCalendarSelectHint = 'Select a highlighted date to see events.';
