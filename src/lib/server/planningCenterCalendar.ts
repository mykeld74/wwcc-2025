import { env } from '$env/dynamic/private';
import type { WowConnectUiEvent, WowEventDetailPayload } from '$lib/wowConnectCalendarTypes';

export type { WowConnectUiEvent, WowEventDetailPayload } from '$lib/wowConnectCalendarTypes';

const PC_BASE = 'https://api.planningcenteronline.com/calendar/v2';
const PC_API_VERSION = '2022-07-07';

/** Match Calendar *tags* (e.g. WoW) — substring, case-insensitive; letters-only for W.o.W. */
const DEFAULT_WOW_TAG_PHRASES = ['wow', 'women of westwoods'];

/** Match Planning Center *calendar* names (the colored calendar on the event) */
const DEFAULT_WOW_CALENDAR_PHRASES = ['women of westwoods'];

type JsonApiResource = {
	type: string;
	id: string;
	attributes: Record<string, unknown>;
	relationships?: Record<
		string,
		{
			data:
				| { type: string; id: string }
				| Array<{ type: string; id: string }>
				| null;
		}
	>;
};

type JsonApiDoc = {
	data: JsonApiResource | JsonApiResource[];
	included?: JsonApiResource[];
};

function authHeader(applicationId: string, secret: string): string {
	const token = Buffer.from(`${applicationId}:${secret}`, 'utf8').toString('base64');
	return `Basic ${token}`;
}

function includedMap(included: JsonApiResource[] | undefined): Map<string, JsonApiResource> {
	const map = new Map<string, JsonApiResource>();
	for (const item of included ?? []) {
		map.set(`${item.type}:${item.id}`, item);
	}
	return map;
}

function pickDescription(attrs: JsonApiResource['attributes']): string | null {
	const raw =
		(typeof attrs.description === 'string' && attrs.description) ||
		(typeof attrs.summary === 'string' && attrs.summary) ||
		null;
	return raw && raw.trim() ? raw : null;
}

function stripSummerConnectTitle(title: string): string {
	return title.replace(/^Summer Connect \| /, '');
}

function mapRowToUiEvent(
	row: JsonApiResource,
	included: Map<string, JsonApiResource>
): WowConnectUiEvent | null {
	const attrs = row.attributes;
	const rel = row.relationships?.event?.data;
	if (!rel || Array.isArray(rel) || typeof rel.id !== 'string') {
		return null;
	}

	const parent = included.get(`${rel.type}:${rel.id}`);
	if (!parent) {
		return null;
	}

	const pa = parent.attributes;
	if (pa.visible_in_church_center !== true) {
		return null;
	}

	const startsRaw = attrs.starts_at;
	if (typeof startsRaw !== 'string') {
		return null;
	}

	const start = new Date(startsRaw);
	if (Number.isNaN(start.getTime())) {
		return null;
	}

	const endsRaw = typeof attrs.ends_at === 'string' ? attrs.ends_at : null;
	const endDate =
		endsRaw && !Number.isNaN(new Date(endsRaw).getTime()) ? new Date(endsRaw).toISOString() : null;

	const allDay = attrs.all_day_event === true;

	const titleRaw =
		(typeof attrs.name === 'string' && attrs.name.trim())
			? attrs.name
			: typeof pa.name === 'string'
				? pa.name
				: 'Event';

	const location =
		(typeof attrs.location === 'string' && attrs.location.trim()
			? attrs.location
			: typeof pa.location === 'string' && pa.location.trim()
				? pa.location
				: '') || '';

	const desc = pickDescription(attrs) ?? pickDescription(pa) ?? '';

	const reg =
		(typeof pa.registration_url === 'string' && pa.registration_url) ||
		(typeof pa.registration_link === 'string' && pa.registration_link) ||
		null;

	const publicUrl =
		(typeof attrs.church_center_url === 'string' && attrs.church_center_url) ||
		(typeof pa.public_url === 'string' && pa.public_url) ||
		null;

	const imageUrl = typeof pa.image_url === 'string' ? pa.image_url : null;
	const kind = typeof pa.kind === 'string' ? pa.kind : '';
	const featured = typeof pa.featured === 'boolean' ? pa.featured : null;

	return {
		id: `${rel.id}-${row.id}`,
		eventId: rel.id,
		instanceId: row.id,
		title: stripSummerConnectTitle(titleRaw),
		descriptionHtml: desc,
		startDate: start.toISOString(),
		endDate,
		allDay,
		location,
		kind,
		registrationUrl: reg,
		publicUrl,
		imageUrl,
		featured
	};
}

async function fetchJson(url: string, applicationId: string, secret: string): Promise<JsonApiDoc | null> {
	const res = await fetch(url, {
		headers: {
			Authorization: authHeader(applicationId, secret),
			Accept: 'application/json',
			'X-API-Version': PC_API_VERSION,
			'User-Agent': 'Westwoods Community Church website (wow-connect)'
		}
	});

	if (!res.ok) {
		const detail = await res.text();
		console.error(
			`Planning Center Calendar request failed: ${res.status} ${res.statusText}`,
			detail.slice(0, 500)
		);
		return null;
	}

	return (await res.json()) as JsonApiDoc;
}

function splitEnvList(raw: string | undefined): string[] | null {
	if (!raw?.trim()) return null;
	return raw
		.split(',')
		.map((s) => s.trim().toLowerCase())
		.filter(Boolean);
}

function wowTagPhrases(): string[] {
	return splitEnvList(env.PLANNING_CENTER_WOW_CONNECT_TAG_NAMES) ?? [...DEFAULT_WOW_TAG_PHRASES];
}

function wowCalendarPhrases(): string[] {
	return splitEnvList(env.PLANNING_CENTER_WOW_CALENDAR_NAMES) ?? [...DEFAULT_WOW_CALENDAR_PHRASES];
}

function lettersOnlyLower(s: string): string {
	return s.toLowerCase().replace(/[^a-z]/g, '');
}

function nameMatchesPhrases(displayName: string, phrases: string[]): boolean {
	const n = displayName.toLowerCase().trim();
	const collapsed = lettersOnlyLower(displayName);
	return phrases.some((p) => {
		if (!p) return false;
		if (n.includes(p)) return true;
		const pLetters = lettersOnlyLower(p);
		return pLetters.length > 0 && collapsed.includes(pLetters);
	});
}

function dataRows(doc: JsonApiDoc | null): JsonApiResource[] {
	if (!doc?.data) return [];
	return Array.isArray(doc.data) ? doc.data : [doc.data];
}

async function fetchMatchingCalendarIds(
	applicationId: string,
	secret: string,
	phrases: string[]
): Promise<string[]> {
	const matched: string[] = [];
	let offset = 0;
	const perPage = 100;

	while (true) {
		const params = new URLSearchParams({
			per_page: String(perPage),
			offset: String(offset),
			order: 'name'
		});
		const doc = await fetchJson(`${PC_BASE}/calendars?${params}`, applicationId, secret);
		const rows = dataRows(doc);
		for (const row of rows) {
			if (row.type !== 'Calendar') continue;
			const name = row.attributes.name;
			if (typeof name === 'string' && nameMatchesPhrases(name, phrases)) {
				matched.push(row.id);
			}
		}

		if (!doc || rows.length < perPage) {
			break;
		}
		offset += perPage;
	}

	return matched;
}

async function fetchMatchingTagIds(
	applicationId: string,
	secret: string,
	phrases: string[]
): Promise<string[]> {
	const matchedIds: string[] = [];
	let offset = 0;
	const perPage = 100;

	while (true) {
		const params = new URLSearchParams({
			per_page: String(perPage),
			offset: String(offset),
			order: 'name'
		});
		const doc = await fetchJson(`${PC_BASE}/tags?${params}`, applicationId, secret);
		const rows = dataRows(doc);

		for (const row of rows) {
			if (row.type !== 'Tag') continue;
			const name = row.attributes.name;
			if (typeof name === 'string' && nameMatchesPhrases(name, phrases)) {
				matchedIds.push(row.id);
			}
		}

		if (!doc || rows.length < perPage) {
			break;
		}
		offset += perPage;
	}

	return matchedIds;
}

/**
 * PCO does not expose `GET /calendars/:id/events` (404). Discover events on given calendars by
 * paging `GET /events` and matching `relationships.calendar.data.id`.
 */
async function fetchEventIdsOnCalendars(
	calendarIds: string[],
	applicationId: string,
	secret: string
): Promise<string[]> {
	if (calendarIds.length === 0) {
		return [];
	}

	const calSet = new Set(calendarIds);
	const ids: string[] = [];
	let offset = 0;
	const perPage = 100;

	while (true) {
		const params = new URLSearchParams({
			per_page: String(perPage),
			offset: String(offset),
			'where[approval_status]': 'A'
		});
		const doc = await fetchJson(`${PC_BASE}/events?${params}`, applicationId, secret);
		const rows = dataRows(doc);

		for (const row of rows) {
			if (row.type !== 'Event') continue;
			const cal = row.relationships?.calendar?.data;
			if (cal && !Array.isArray(cal) && calSet.has(cal.id)) {
				ids.push(row.id);
			}
		}

		if (!doc || rows.length < perPage) {
			break;
		}
		offset += perPage;
	}

	return ids;
}

/** Event ids from `GET /tags/:id/events` (tags on the Event). */
async function fetchEventIdsForTag(tagId: string, applicationId: string, secret: string): Promise<string[]> {
	const ids: string[] = [];
	let offset = 0;
	const perPage = 100;
	const path = `${PC_BASE}/tags/${encodeURIComponent(tagId)}/events`;

	while (true) {
		const params = new URLSearchParams({
			per_page: String(perPage),
			offset: String(offset)
		});
		const doc = await fetchJson(`${path}?${params}`, applicationId, secret);
		const rows = dataRows(doc);

		for (const row of rows) {
			if (row.type === 'Event') {
				ids.push(row.id);
			}
		}

		if (!doc || rows.length < perPage) {
			break;
		}
		offset += perPage;
	}

	return ids;
}

function mergeIncluded(into: Map<string, JsonApiResource>, doc: JsonApiDoc): void {
	for (const item of doc.included ?? []) {
		into.set(`${item.type}:${item.id}`, item);
	}
}

async function fetchFutureInstancesForEvent(
	eventId: string,
	applicationId: string,
	secret: string,
	includedAcc: Map<string, JsonApiResource>
): Promise<JsonApiResource[]> {
	const allRows: JsonApiResource[] = [];
	let offset = 0;
	const perPage = 100;

	const instanceFields =
		'name,description,summary,starts_at,ends_at,location,' +
		'published_starts_at,published_ends_at,church_center_url,all_day_event,image_url';

	const eventFields =
		'name,description,summary,kind,event_type,visible_in_church_center,featured,' +
		'registration_url,registration_link,public_url,image_url,location';

	while (true) {
		const params = new URLSearchParams({
			filter: 'future',
			order: 'starts_at',
			per_page: String(perPage),
			offset: String(offset),
			include: 'event',
			'fields[event_instances]': instanceFields,
			'fields[events]': eventFields
		});

		const doc = await fetchJson(
			`${PC_BASE}/events/${encodeURIComponent(eventId)}/event_instances?${params}`,
			applicationId,
			secret
		);

		if (!doc) {
			break;
		}

		mergeIncluded(includedAcc, doc);

		const rows = dataRows(doc);
		allRows.push(...rows);

		if (rows.length < perPage) {
			break;
		}
		offset += perPage;
	}

	return allRows;
}

function sortInstancesByStart(rows: JsonApiResource[]): void {
	rows.sort((a, b) => {
		const ta =
			typeof a.attributes.starts_at === 'string'
				? new Date(a.attributes.starts_at).getTime()
				: 0;
		const tb =
			typeof b.attributes.starts_at === 'string'
				? new Date(b.attributes.starts_at).getTime()
				: 0;
		return ta - tb;
	});
}

async function loadWowScopeIds(
	applicationId: string,
	secret: string
): Promise<{ calendarIds: string[]; tagIds: string[] }> {
	const calendarPhrases = wowCalendarPhrases();
	const tagPhrases = wowTagPhrases();
	const explicitCalendarId = env.PLANNING_CENTER_WOW_CONNECT_CALENDAR_ID?.trim();
	const explicitTagId = env.PLANNING_CENTER_WOW_CONNECT_TAG_ID?.trim();

	const calendarIds = explicitCalendarId
		? [explicitCalendarId]
		: await fetchMatchingCalendarIds(applicationId, secret, calendarPhrases);

	const tagIds = explicitTagId
		? [explicitTagId]
		: await fetchMatchingTagIds(applicationId, secret, tagPhrases);

	return { calendarIds, tagIds };
}

async function fetchEventTagIdsForEvent(
	eventId: string,
	applicationId: string,
	secret: string
): Promise<string[]> {
	const ids: string[] = [];
	let offset = 0;
	const perPage = 100;

	while (true) {
		const doc = await fetchJson(
			`${PC_BASE}/events/${encodeURIComponent(eventId)}/tags?per_page=${perPage}&offset=${offset}`,
			applicationId,
			secret
		);
		const rows = dataRows(doc);
		for (const row of rows) {
			if (row.type === 'Tag') {
				ids.push(row.id);
			}
		}
		if (!doc || rows.length < perPage) {
			break;
		}
		offset += perPage;
	}

	return ids;
}

async function assertWowEventInScope(
	eventId: string,
	applicationId: string,
	secret: string,
	calendarIds: string[],
	tagIds: string[]
): Promise<boolean> {
	const doc = await fetchJson(
		`${PC_BASE}/events/${encodeURIComponent(eventId)}`,
		applicationId,
		secret
	);
	const ev = dataRows(doc)[0];
	if (!ev || ev.type !== 'Event') {
		return false;
	}

	const calSet = new Set(calendarIds);
	const cal = ev.relationships?.calendar?.data;
	if (cal && !Array.isArray(cal) && calSet.has(cal.id)) {
		return true;
	}

	if (tagIds.length === 0) {
		return false;
	}

	const tagSet = new Set(tagIds);
	const onEvent = await fetchEventTagIdsForEvent(eventId, applicationId, secret);
	return onEvent.some((id) => tagSet.has(id));
}

/**
 * WOW Connect: Planning Center events that are either on a matching **calendar** (e.g. Women of
 * Westwoods) or carry a matching **tag** (e.g. WoW). Calendars are resolved by paging `GET /events`
 * and matching `relationships.calendar` (there is no `GET /calendars/:id/events`). Tags use
 * `GET /tags/:id/events` (not `tags/:id/event_instances` when tags live on the Event).
 *
 * Env:
 * - `PLANNING_CENTER_WOW_CALENDAR_NAMES` — comma-separated substrings for calendar names (default:
 *   women of westwoods).
 * - `PLANNING_CENTER_WOW_CONNECT_CALENDAR_ID` — optional; restrict to this calendar id only.
 * - `PLANNING_CENTER_WOW_CONNECT_TAG_NAMES` / `PLANNING_CENTER_WOW_CONNECT_TAG_ID` — same for tags.
 */
export async function fetchWowConnectUiEvents(): Promise<WowConnectUiEvent[]> {
	const applicationId = env.PLANNING_CENTER_APPLICATION_ID;
	const secret = env.PLANNING_CENTER_SECRET;

	if (!applicationId || !secret) {
		console.warn('Planning Center: PLANNING_CENTER_APPLICATION_ID or PLANNING_CENTER_SECRET missing');
		return [];
	}

	const { calendarIds, tagIds } = await loadWowScopeIds(applicationId, secret);

	const eventIdSet = new Set<string>();

	for (const id of await fetchEventIdsOnCalendars(calendarIds, applicationId, secret)) {
		eventIdSet.add(id);
	}

	for (const tagId of tagIds) {
		for (const id of await fetchEventIdsForTag(tagId, applicationId, secret)) {
			eventIdSet.add(id);
		}
	}

	if (eventIdSet.size === 0) {
		console.warn(
			'Planning Center WOW Connect: no events found. Use a calendar whose name includes "Women of Westwoods" ' +
				'and/or a WoW tag on events, or set PLANNING_CENTER_WOW_CONNECT_CALENDAR_ID / PLANNING_CENTER_WOW_CONNECT_TAG_ID.'
		);
		return [];
	}

	const eventIds = [...eventIdSet];
	const mergedIncluded = new Map<string, JsonApiResource>();
	const mergedRows: JsonApiResource[] = [];
	const seenInstanceIds = new Set<string>();

	const concurrency = 8;
	for (let i = 0; i < eventIds.length; i += concurrency) {
		const batch = eventIds.slice(i, i + concurrency);
		const batchResults = await Promise.all(
			batch.map((eventId) =>
				fetchFutureInstancesForEvent(eventId, applicationId, secret, mergedIncluded)
			)
		);
		for (const rows of batchResults) {
			for (const row of rows) {
				if (row.type !== 'EventInstance') continue;
				if (seenInstanceIds.has(row.id)) continue;
				seenInstanceIds.add(row.id);
				mergedRows.push(row);
			}
		}
	}

	sortInstancesByStart(mergedRows);

	const out: WowConnectUiEvent[] = [];
	for (const row of mergedRows) {
		const mapped = mapRowToUiEvent(row, mergedIncluded);
		if (mapped) {
			out.push(mapped);
		}
	}
	return out;
}

/** Full event + next upcoming instance. Returns null if not in WOW scope or not Church Center–published. */
export async function fetchWowEventDetailForPage(eventId: string): Promise<WowEventDetailPayload | null> {
	const applicationId = env.PLANNING_CENTER_APPLICATION_ID;
	const secret = env.PLANNING_CENTER_SECRET;

	if (!applicationId || !secret) {
		return null;
	}

	const { calendarIds, tagIds } = await loadWowScopeIds(applicationId, secret);
	const inScope = await assertWowEventInScope(eventId, applicationId, secret, calendarIds, tagIds);
	if (!inScope) {
		return null;
	}

	const eventDoc = await fetchJson(
		`${PC_BASE}/events/${encodeURIComponent(eventId)}?fields[events]=all`,
		applicationId,
		secret
	);
	const ev = dataRows(eventDoc)[0];
	if (!ev || ev.type !== 'Event') {
		return null;
	}

	const a = ev.attributes;
	if (a.visible_in_church_center !== true) {
		return null;
	}

	const reg =
		(typeof a.registration_url === 'string' && a.registration_url) ||
		(typeof a.registration_link === 'string' && a.registration_link) ||
		null;

	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const todayISO = today.toISOString();

	const instDoc = await fetchJson(
		`${PC_BASE}/events/${encodeURIComponent(eventId)}/event_instances?per_page=100&order=starts_at&where[starts_at][gte]=${encodeURIComponent(todayISO)}`,
		applicationId,
		secret
	);

	type InstRow = {
		id: string;
		attributes?: {
			starts_at?: string;
			ends_at?: string;
			all_day_event?: boolean;
			location?: string;
		};
	};

	let nextInstance: WowEventDetailPayload['instance'] = null;

	if (instDoc) {
		const rows = dataRows(instDoc) as InstRow[];
		const now = new Date();
		const parsed = rows
			.map((instance) => {
				const startsAt = instance.attributes?.starts_at;
				if (!startsAt) {
					return null;
				}
				const endsAt = instance.attributes?.ends_at;
				return {
					id: instance.id,
					startsAt: new Date(startsAt),
					endsAt: endsAt ? new Date(endsAt) : null,
					allDay: instance.attributes?.all_day_event === true,
					location: typeof instance.attributes?.location === 'string' ? instance.attributes.location : ''
				};
			})
			.filter((x): x is NonNullable<typeof x> => x !== null)
			.sort((x, y) => x.startsAt.getTime() - y.startsAt.getTime());

		const chosen = parsed.find((x) => x.startsAt >= now) || parsed[0] || null;
		if (chosen) {
			nextInstance = {
				id: chosen.id,
				startsAt: chosen.startsAt.toISOString(),
				endsAt: chosen.endsAt ? chosen.endsAt.toISOString() : null,
				allDay: chosen.allDay,
				location: chosen.location
			};
		}
	}

	return {
		event: {
			id: ev.id,
			name: typeof a.name === 'string' ? a.name : 'Event',
			description: typeof a.description === 'string' ? a.description : '',
			kind: typeof a.kind === 'string' ? a.kind : '',
			registrationUrl: reg,
			publicUrl: typeof a.public_url === 'string' ? a.public_url : null,
			imageUrl: typeof a.image_url === 'string' ? a.image_url : null
		},
		instance: nextInstance
	};
}
