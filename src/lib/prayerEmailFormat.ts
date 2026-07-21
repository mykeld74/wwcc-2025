import { formatPersonName } from '$lib/personName';

export interface PrayerEmailRequest {
	firstName?: string | null;
	lastName?: string | null;
	request: string;
	isStaffOnly?: boolean;
	isWwKid: boolean;
	submittedAt: Date | string;
}

export interface PrayerEmailRange {
	startDate: string;
	endDate: string;
	includeStaffOnly?: boolean;
}

function parseRangeDate(value: string, endOfDay: boolean) {
	const date = new Date(`${value}T00:00:00`);
	if (endOfDay) {
		date.setHours(23, 59, 59, 999);
	}
	return date;
}

function compareByName(
	a: PrayerEmailRequest,
	b: PrayerEmailRequest
) {
	const lastA = (a.lastName ?? '').trim().toLowerCase();
	const lastB = (b.lastName ?? '').trim().toLowerCase();
	if (lastA !== lastB) return lastA.localeCompare(lastB);

	const firstA = (a.firstName ?? '').trim().toLowerCase();
	const firstB = (b.firstName ?? '').trim().toLowerCase();
	return firstA.localeCompare(firstB);
}

function isStaffOnlyRequest(request: PrayerEmailRequest) {
	return request.isStaffOnly === true;
}

export function filterPrayerRequestsForEmail(
	requests: PrayerEmailRequest[],
	range: PrayerEmailRange
) {
	if (!range.startDate || !range.endDate) return [];

	const rangeStart = parseRangeDate(range.startDate, false);
	const rangeEnd = parseRangeDate(range.endDate, true);

	return requests
		.filter((request) => range.includeStaffOnly || !isStaffOnlyRequest(request))
		.filter((request) => {
			const submittedAt = new Date(request.submittedAt);
			return submittedAt >= rangeStart && submittedAt <= rangeEnd;
		})
		.sort((a, b) => {
			if (a.isWwKid !== b.isWwKid) {
				return a.isWwKid ? -1 : 1;
			}
			return compareByName(a, b);
		});
}

function formatRangeLabel(range: PrayerEmailRange) {
	const start = new Date(`${range.startDate}T12:00:00`);
	const end = new Date(`${range.endDate}T12:00:00`);
	const options: Intl.DateTimeFormatOptions = {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	};

	if (range.startDate === range.endDate) {
		return start.toLocaleDateString('en-US', options);
	}

	return `${start.toLocaleDateString('en-US', options)} – ${end.toLocaleDateString('en-US', options)}`;
}

function escapeHtml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

const plainRequestSeparator = '────────────────────────';

const requestBlockStyle =
	'margin: 0 0 18px; break-inside: avoid-page; page-break-inside: avoid;';

const sectionHeadingStyle =
	'margin: 24px 0 12px; font-size: 18px; font-weight: 700; color: #000000; text-transform: uppercase; letter-spacing: 0.04em; break-after: avoid-page; page-break-after: avoid;';

function formatRequestNameForEmail(request: PrayerEmailRequest) {
	const name = formatPersonName(request.firstName, request.lastName);
	return isStaffOnlyRequest(request) ? `${name} - Staff Only` : name;
}

function formatRequestBlockPlain(request: PrayerEmailRequest, showSeparator = true) {
	const name = formatRequestNameForEmail(request);
	const separator = showSeparator ? `\n${plainRequestSeparator}` : '';
	return `${name}\n${request.request.trim()}${separator}`;
}

function formatRequestBlockHtml(request: PrayerEmailRequest, showSeparator = true) {
	const name = escapeHtml(formatRequestNameForEmail(request));
	const body = escapeHtml(request.request.trim()).replaceAll('\n', '<br />');
	const separator = showSeparator
		? '<hr style="border: none; border-top: 1px solid #000000; margin: 0;" />'
		: '';

	return `<div class="prayer-request-block" style="${requestBlockStyle}">
<p style="margin: 0 0 4px; font-size: 18px; font-weight: 700; color: #000000;">${name}</p>
<p style="margin: 0 0 12px; font-size: 17px; color: #000000; line-height: 1.5;">${body}</p>
${separator}
</div>`;
}

export function buildPrayerEmailContent(
	requests: PrayerEmailRequest[],
	range: PrayerEmailRange
) {
	const filtered = filterPrayerRequestsForEmail(requests, range);
	const rangeLabel = formatRangeLabel(range);
	const wwKids = filtered.filter((request) => request.isWwKid);
	const otherRequests = filtered.filter((request) => !request.isWwKid);

	const plainSections: string[] = [];
	const htmlSections: string[] = [];

	const lastSection = otherRequests.length > 0 ? 'other' : 'wwKids';

	if (wwKids.length > 0) {
		plainSections.push(
			'WW KIDS',
			'',
			...wwKids.flatMap((request, index) => [
				formatRequestBlockPlain(
					request,
					!(lastSection === 'wwKids' && index === wwKids.length - 1)
				),
				''
			])
		);
		htmlSections.push(
			`<h3 class="prayer-section-heading" style="${sectionHeadingStyle}">WW Kids</h3>`,
			...wwKids.map((request, index) =>
				formatRequestBlockHtml(
					request,
					!(lastSection === 'wwKids' && index === wwKids.length - 1)
				)
			)
		);
	}

	if (otherRequests.length > 0) {
		if (wwKids.length > 0) {
			plainSections.push('OTHER REQUESTS', '');
			htmlSections.push(
				`<h3 class="prayer-section-heading" style="${sectionHeadingStyle}">Other Requests</h3>`
			);
		}

		plainSections.push(
			...otherRequests.flatMap((request, index) => [
				formatRequestBlockPlain(request, index < otherRequests.length - 1),
				''
			])
		);
		htmlSections.push(
			...otherRequests.map((request, index) =>
				formatRequestBlockHtml(request, index < otherRequests.length - 1)
			)
		);
	}

	const plainText =
		filtered.length === 0
			? `Westwoods Prayer Requests\n${rangeLabel}\n\nNo prayer requests for this date range.`
			: `Westwoods Prayer Requests\n${rangeLabel}\n\n${plainSections.join('\n').trim()}`;

	const htmlBody =
		filtered.length === 0
			? `<p style="margin: 0; font-size: 17px; color: #000000;">No prayer requests for this date range.</p>`
			: htmlSections.join('');

	const html = `<div class="prayer-email-document" style="font-family: Arial, Helvetica, sans-serif; font-size: 17px; color: #000000; background: #ffffff; padding: 20px;">
<p class="prayer-email-title" style="margin: 0 0 6px; font-size: 24px; font-weight: 700; color: #000000;">Westwoods Prayer Requests</p>
<p class="prayer-email-range" style="margin: 0 0 20px; font-size: 16px; color: #000000;">${escapeHtml(rangeLabel)}</p>
${htmlBody}
</div>`;

	return {
		filtered,
		plainText,
		html,
		rangeLabel
	};
}

export function getDefaultPrayerEmailRange() {
	const end = new Date();
	const start = new Date();
	start.setDate(start.getDate() - 6);

	const toInput = (date: Date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

	return {
		startDate: toInput(start),
		endDate: toInput(end)
	};
}
