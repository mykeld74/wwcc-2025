import { db } from '$lib/server/db';
import { prayerRequests } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const requests = await db
		.select()
		.from(prayerRequests)
		.orderBy(desc(prayerRequests.submittedAt));

	return { requests };
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
