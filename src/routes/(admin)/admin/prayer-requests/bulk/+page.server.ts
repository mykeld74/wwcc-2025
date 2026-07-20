import { db } from '$lib/server/db';
import { prayerRequests } from '$lib/server/db/schema';
import {
	getPrayerBulkCsvTemplate,
	normalizePrayerBulkRows,
	parsePrayerBulkCsv,
	type PrayerBulkInputRow
} from '$lib/server/prayerBulk';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

const bulkRoles = new Set(['admin', 'staff']);

function canBulkCreate(role: string | null | undefined) {
	return !!role && bulkRoles.has(role);
}

export const load: PageServerLoad = async ({ locals }) => {
	if (!canBulkCreate(locals.user?.role)) {
		throw redirect(302, '/admin/prayer-requests');
	}

	return {
		csvTemplate: getPrayerBulkCsvTemplate()
	};
};

export const actions: Actions = {
	bulkCreate: async ({ request, locals }) => {
		if (!canBulkCreate(locals.user?.role)) {
			return fail(403, {
				bulkMessage: 'Only admins and staff can bulk upload prayer requests'
			});
		}

		const formData = await request.formData();
		const source = String(formData.get('source') ?? '');
		const file = formData.get('file');
		const rowsJson = formData.get('rows');

		let parsed =
			source === 'csv'
				? { rows: [], errors: [{ row: 0, message: 'CSV file is required' }] }
				: normalizePrayerBulkRows([]);

		if (source === 'csv') {
			if (!(file instanceof File) || file.size === 0) {
				return fail(400, {
					bulkMessage: 'Please choose a CSV file to upload',
					bulkErrors: []
				});
			}

			const csvText = await file.text();
			parsed = parsePrayerBulkCsv(csvText);
		} else if (source === 'rows') {
			if (typeof rowsJson !== 'string' || rowsJson.trim() === '') {
				return fail(400, {
					bulkMessage: 'No prayer request rows were submitted',
					bulkErrors: []
				});
			}

			let inputRows: PrayerBulkInputRow[];
			try {
				inputRows = JSON.parse(rowsJson) as PrayerBulkInputRow[];
				if (!Array.isArray(inputRows)) {
					throw new Error('Rows payload must be an array');
				}
			} catch {
				return fail(400, {
					bulkMessage: 'Could not read the submitted rows',
					bulkErrors: []
				});
			}

			parsed = normalizePrayerBulkRows(inputRows);
		} else {
			return fail(400, {
				bulkMessage: 'Unknown bulk upload source',
				bulkErrors: []
			});
		}

		if (parsed.errors.length > 0) {
			return fail(400, {
				bulkMessage: 'Please fix the highlighted rows and try again',
				bulkErrors: parsed.errors
			});
		}

		try {
			await db.insert(prayerRequests).values(
				parsed.rows.map((row) => ({
					firstName: row.firstName,
					lastName: row.lastName,
					request: row.request,
					isStaffOnly: row.isStaffOnly,
					submittedAt: row.submittedAt,
					email: row.email
				}))
			);

			return {
				bulkSuccess: true,
				insertedCount: parsed.rows.length,
				bulkMessage: `Added ${parsed.rows.length} prayer request${parsed.rows.length === 1 ? '' : 's'}.`
			};
		} catch (error) {
			console.error('Error bulk inserting prayer requests:', error);
			return fail(500, {
				bulkMessage: 'There was an error saving the prayer requests. Please try again.',
				bulkErrors: []
			});
		}
	}
};
