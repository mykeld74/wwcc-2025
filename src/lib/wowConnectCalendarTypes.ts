/** Shared types for WOW Connect calendar + event detail (safe for client + server imports). */

export type WowConnectUiEvent = {
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

export type WowEventDetailPayload = {
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
