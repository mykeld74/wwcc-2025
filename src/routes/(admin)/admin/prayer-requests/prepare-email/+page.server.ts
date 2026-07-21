import { db } from '$lib/server/db';
import { prayerRequests } from '$lib/server/db/schema';
import { desc, sql } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const allowedRoles = new Set(['admin', 'staff']);

export const load: PageServerLoad = async ({ locals }) => {
	if (!allowedRoles.has(locals.user?.role ?? '')) {
		throw redirect(302, '/admin/prayer-requests');
	}

	const requests = await db
		.select({
			firstName: prayerRequests.firstName,
			lastName: prayerRequests.lastName,
			request: prayerRequests.request,
			isStaffOnly: prayerRequests.isStaffOnly,
			isWwKid: prayerRequests.isWwKid,
			submittedAt: prayerRequests.submittedAt
		})
		.from(prayerRequests)
		.orderBy(
			desc(prayerRequests.submittedAt),
			sql`lower(${prayerRequests.lastName}) ASC NULLS LAST`,
			sql`lower(${prayerRequests.firstName}) ASC NULLS LAST`
		);

	return { requests };
};
