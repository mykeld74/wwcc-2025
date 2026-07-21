export const MAX_BULK_PRAYER_ROWS = 200;

export const PRAYER_BULK_CSV_HEADERS = [
	'firstName',
	'lastName',
	'request',
	'isStaffOnly',
	'isWwKid',
	'submittedAt'
] as const;

export type PrayerBulkCsvHeader = (typeof PRAYER_BULK_CSV_HEADERS)[number];

export interface PrayerBulkInputRow {
	firstName?: string | null;
	lastName?: string | null;
	request?: string | null;
	isStaffOnly?: boolean | string | null;
	isWwKid?: boolean | string | null;
	submittedAt?: string | null;
}

export interface PrayerBulkNormalizedRow {
	firstName: string | null;
	lastName: string | null;
	request: string;
	isStaffOnly: boolean;
	isWwKid: boolean;
	submittedAt: Date;
}

export interface PrayerBulkRowError {
	row: number;
	message: string;
}

export interface PrayerBulkParseResult {
	rows: PrayerBulkNormalizedRow[];
	errors: PrayerBulkRowError[];
}

function trimOrNull(value: string | null | undefined) {
	const trimmed = value?.trim() ?? '';
	return trimmed.length > 0 ? trimmed : null;
}

function parseBooleanField(value: boolean | string | null | undefined) {
	if (typeof value === 'boolean') return value;
	if (value == null || String(value).trim() === '') return false;

	const normalized = String(value).trim().toLowerCase();
	if (['true', '1', 'yes', 'y'].includes(normalized)) return true;
	if (['false', '0', 'no', 'n'].includes(normalized)) return false;
	return null;
}

function parseSubmittedAt(value: string | null | undefined, fallback: Date) {
	const trimmed = value?.trim() ?? '';
	if (!trimmed) return { date: fallback, error: null as string | null };

	if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
		return { date: null, error: 'submittedAt must be YYYY-MM-DD' };
	}

	const [year, month, day] = trimmed.split('-').map(Number);
	const date = new Date(year, month - 1, day, 12, 0, 0, 0);

	if (
		Number.isNaN(date.getTime()) ||
		date.getFullYear() !== year ||
		date.getMonth() !== month - 1 ||
		date.getDate() !== day
	) {
		return { date: null, error: 'submittedAt is not a valid date' };
	}

	return { date, error: null as string | null };
}

function isBlankInputRow(row: PrayerBulkInputRow) {
	const staffOnly = parseBooleanField(row.isStaffOnly) === true;
	const wwKid = parseBooleanField(row.isWwKid) === true;

	return (
		!trimOrNull(row.firstName) &&
		!trimOrNull(row.lastName) &&
		!trimOrNull(row.request) &&
		!staffOnly &&
		!wwKid
	);
}

export function normalizePrayerBulkRows(
	inputRows: PrayerBulkInputRow[],
	options?: { now?: Date }
): PrayerBulkParseResult {
	const now = options?.now ?? new Date();
	const rows: PrayerBulkNormalizedRow[] = [];
	const errors: PrayerBulkRowError[] = [];

	if (inputRows.length > MAX_BULK_PRAYER_ROWS) {
		return {
			rows: [],
			errors: [
				{
					row: 0,
					message: `Too many rows. Maximum is ${MAX_BULK_PRAYER_ROWS}.`
				}
			]
		};
	}

	inputRows.forEach((input, index) => {
		const rowNumber = index + 1;

		if (isBlankInputRow(input)) {
			return;
		}

		const request = trimOrNull(input.request);
		if (!request) {
			errors.push({ row: rowNumber, message: 'Request is required' });
			return;
		}

		if (request.length > 2000) {
			errors.push({
				row: rowNumber,
				message: 'Request must be less than 2000 characters'
			});
			return;
		}

		const isStaffOnly = parseBooleanField(input.isStaffOnly);
		if (isStaffOnly === null) {
			errors.push({
				row: rowNumber,
				message: 'isStaffOnly must be true/false, yes/no, or 1/0'
			});
			return;
		}

		const isWwKid = parseBooleanField(input.isWwKid);
		if (isWwKid === null) {
			errors.push({
				row: rowNumber,
				message: 'isWwKid must be true/false, yes/no, or 1/0'
			});
			return;
		}

		const submitted = parseSubmittedAt(input.submittedAt, now);
		if (submitted.error || !submitted.date) {
			errors.push({
				row: rowNumber,
				message: submitted.error ?? 'Invalid submittedAt'
			});
			return;
		}

		rows.push({
			firstName: trimOrNull(input.firstName),
			lastName: trimOrNull(input.lastName),
			request,
			isStaffOnly,
			isWwKid,
			submittedAt: submitted.date
		});
	});

	if (rows.length === 0 && errors.length === 0) {
		errors.push({ row: 0, message: 'No prayer requests to import' });
	}

	return { rows, errors };
}

function parseCsvLine(line: string) {
	const cells: string[] = [];
	let current = '';
	let inQuotes = false;

	for (let i = 0; i < line.length; i += 1) {
		const char = line[i];
		const next = line[i + 1];

		if (char === '"' && inQuotes && next === '"') {
			current += '"';
			i += 1;
			continue;
		}

		if (char === '"') {
			inQuotes = !inQuotes;
			continue;
		}

		if (char === ',' && !inQuotes) {
			cells.push(current);
			current = '';
			continue;
		}

		current += char;
	}

	cells.push(current);
	return cells;
}

export function parsePrayerBulkCsv(csvText: string): PrayerBulkParseResult {
	const lines = csvText
		.replace(/^\uFEFF/, '')
		.split(/\r?\n/)
		.map((line) => line.trimEnd())
		.filter((line, index, all) => {
			if (line.trim() !== '') return true;
			return index < all.length - 1 && all.slice(index + 1).some((l) => l.trim() !== '');
		});

	if (lines.length === 0) {
		return { rows: [], errors: [{ row: 0, message: 'CSV file is empty' }] };
	}

	const headerCells = parseCsvLine(lines[0]).map((cell) => cell.trim());
	const expected = [...PRAYER_BULK_CSV_HEADERS];

	if (
		headerCells.length !== expected.length ||
		!expected.every((header, index) => headerCells[index] === header)
	) {
		return {
			rows: [],
			errors: [
				{
					row: 1,
					message: `CSV header must be: ${expected.join(',')}`
				}
			]
		};
	}

	const dataLines = lines.slice(1);
	if (dataLines.length > MAX_BULK_PRAYER_ROWS) {
		return {
			rows: [],
			errors: [
				{
					row: 0,
					message: `Too many rows. Maximum is ${MAX_BULK_PRAYER_ROWS}.`
				}
			]
		};
	}

	const inputRows: PrayerBulkInputRow[] = dataLines.map((line) => {
		const cells = parseCsvLine(line);
		return {
			firstName: cells[0] ?? '',
			lastName: cells[1] ?? '',
			request: cells[2] ?? '',
			isStaffOnly: cells[3] ?? '',
			isWwKid: cells[4] ?? '',
			submittedAt: cells[5] ?? ''
		};
	});

	const result = normalizePrayerBulkRows(inputRows);

	return {
		rows: result.rows,
		errors: result.errors.map((error) =>
			error.row === 0 ? error : { ...error, row: error.row + 1 }
		)
	};
}

export function getPrayerBulkCsvTemplate() {
	return `${PRAYER_BULK_CSV_HEADERS.join(',')}
Jane,Doe,Please pray for healing,false,false,2026-07-19
John,Smith,Traveling mercies this week,true,true,
`;
}
