/** Shared types for Planning Center calendar UI (list, month view, event detail). */

export type CalendarUiEvent = {
	id: string;
	eventId: string;
	instanceId: string;
	title: string;
	descriptionHtml: string;
	startDate: string;
	endDate: string | null;
	allDay: boolean;
	location: string;
	kind: string;
	registrationUrl: string | null;
	publicUrl: string | null;
	imageUrl: string | null;
	featured: boolean | null;
};

export type CalendarEventDetailPayload = {
	event: {
		id: string;
		name: string;
		description: string;
		kind: string;
		registrationUrl: string | null;
		publicUrl: string | null;
		imageUrl: string | null;
	};
	instance: {
		id: string;
		startsAt: string;
		endsAt: string | null;
		allDay: boolean;
		location: string;
	} | null;
};
