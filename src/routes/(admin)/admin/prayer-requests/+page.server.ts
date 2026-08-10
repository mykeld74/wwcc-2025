import { db } from '$lib/server/db';
import { prayerRequests } from '$lib/server/db/schema';
import {
	canManagePrayerRequests,
	canViewStaffOnlyPrayerRequests
} from '$lib/adminRoles';
import { desc, eq, sql } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const role = locals.user?.role ?? '';
	const includeStaffOnly = canViewStaffOnlyPrayerRequests(role);

	const requests = includeStaffOnly
		? await db
				.select()
				.from(prayerRequests)
				.orderBy(
					desc(prayerRequests.submittedAt),
					sql`lower(${prayerRequests.lastName}) ASC NULLS LAST`,
					sql`lower(${prayerRequests.firstName}) ASC NULLS LAST`
				)
		: await db
				.select()
				.from(prayerRequests)
				.where(eq(prayerRequests.isStaffOnly, false))
				.orderBy(
					desc(prayerRequests.submittedAt),
					sql`lower(${prayerRequests.lastName}) ASC NULLS LAST`,
					sql`lower(${prayerRequests.firstName}) ASC NULLS LAST`
				);

	return {
		requests,
		canManagePrayer: canManagePrayerRequests(role),
		canViewStaffOnly: includeStaffOnly
	};
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		if (locals.user?.role !== 'admin') {
			return fail(403, { message: 'Only admins can delete prayer requests' });
		}

		const formData = await request.formData();
		const id = Number(formData.get('id'));

		if (!id) return fail(400, { message: 'Invalid ID' });

		await db.delete(prayerRequests).where(eq(prayerRequests.id, id));

		return { success: true };
	}
};
