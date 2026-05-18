import type { CalendarUiEvent } from '$lib/calendarEventTypes';

export const DISPLAY_TZ = 'America/Denver';

export type ParsedCalendarEvent = CalendarUiEvent & { start: Date; end: Date | null };

export function parseCalendarEvents(events: CalendarUiEvent[]): ParsedCalendarEvent[] {
	return events
		.map((e) => ({
			...e,
			start: new Date(e.startDate),
			end: e.endDate ? new Date(e.endDate) : null
		}))
		.filter((e) => !Number.isNaN(e.start.getTime()))
		.sort((a, b) => a.start.getTime() - b.start.getTime());
}

export function getDateKey(date: Date) {
	const formatter = new Intl.DateTimeFormat('en-US', {
		timeZone: DISPLAY_TZ,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
	const parts = formatter.formatToParts(date);
	const y = parts.find((p) => p.type === 'year')?.value || '';
	const m = parts.find((p) => p.type === 'month')?.value || '';
	const d = parts.find((p) => p.type === 'day')?.value || '';
	return `${y}-${m}-${d}`;
}

export function getMonthKey(date: Date) {
	const formatter = new Intl.DateTimeFormat('en-US', {
		timeZone: DISPLAY_TZ,
		year: 'numeric',
		month: '2-digit'
	});
	const parts = formatter.formatToParts(date);
	const y = parts.find((p) => p.type === 'year')?.value || '';
	const m = parts.find((p) => p.type === 'month')?.value || '';
	return `${y}-${m}`;
}

export function isSameLocalDay(a: Date, b: Date) {
	return getDateKey(a) === getDateKey(b);
}

export function buildEventsByDateKey(events: ParsedCalendarEvent[]) {
	const dateMap = new Map<string, ParsedCalendarEvent[]>();
	for (const event of events) {
		const startKey = getDateKey(event.start);
		if (!dateMap.has(startKey)) dateMap.set(startKey, []);
		dateMap.get(startKey)!.push(event);
	}
	return dateMap;
}

export function filterEventsByMonth(events: ParsedCalendarEvent[], month: Date) {
	const monthKey = getMonthKey(month);
	return events.filter((event) => getMonthKey(event.start) === monthKey);
}

export function groupEventsByDate(events: ParsedCalendarEvent[]) {
	const dateMap = buildEventsByDateKey(events);
	return Array.from(dateMap.entries())
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([dateKey, dayEvents]) => ({
			dateKey,
			date: dayEvents[0].start,
			events: dayEvents
		}));
}

export function formatMonthYear(date: Date) {
	return new Intl.DateTimeFormat('en-US', {
		month: 'long',
		year: 'numeric',
		timeZone: DISPLAY_TZ
	}).format(date);
}

export function formatDateLong(date: Date) {
	return new Intl.DateTimeFormat('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: DISPLAY_TZ
	}).format(date);
}

export function formatDateCompact(date: Date) {
	return new Intl.DateTimeFormat('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
		timeZone: DISPLAY_TZ
	}).format(date);
}

export function formatEventTime(event: ParsedCalendarEvent) {
	if (event.allDay) return 'All day';
	const start = formatTime(event.start);
	if (!event.end) return start;
	return `${start} – ${formatTime(event.end)}`;
}

export function formatTime(date: Date) {
	return new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		timeZone: DISPLAY_TZ
	}).format(date);
}

export function shiftMonth(month: Date, delta: number) {
	return new Date(month.getFullYear(), month.getMonth() + delta, 1);
}
