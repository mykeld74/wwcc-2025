import { db } from '$lib/server/db';
import { volunteerOpportunities } from '$lib/server/db/schema';
import {
	getVolunteerVisibilityFilter,
	volunteerInfoInbox
} from '$lib/server/volunteerVisibility';
import { desc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const userEmail = locals.user?.email?.trim().toLowerCase();
	const showAll = url.searchParams.get('showAll') === '1';

	const visibilityFilter = getVolunteerVisibilityFilter(userEmail, showAll);

	const opportunities = await db
		.select()
		.from(volunteerOpportunities)
		.where(visibilityFilter)
		.orderBy(desc(volunteerOpportunities.submittedAt));

	return {
		opportunities,
		showAll,
		infoInbox: volunteerInfoInbox,
		userEmail: userEmail ?? null
	};
};

export const actions: Actions = {
	markAddressed: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));

		if (!id) return fail(400, { message: 'Invalid ID' });

		await db
			.update(volunteerOpportunities)
			.set({ addressed: true, updatedAt: new Date() })
			.where(eq(volunteerOpportunities.id, id));

		return { success: true };
	},

	markPending: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));

		if (!id) return fail(400, { message: 'Invalid ID' });

		await db
			.update(volunteerOpportunities)
			.set({ addressed: false, updatedAt: new Date() })
			.where(eq(volunteerOpportunities.id, id));

		return { success: true };
	},

	delete: async ({ request, locals }) => {
		if (locals.user?.role !== 'admin') {
			return fail(403, { message: 'Only admins can delete entries' });
		}

		const formData = await request.formData();
		const id = Number(formData.get('id'));

		if (!id) return fail(400, { message: 'Invalid ID' });

		await db.delete(volunteerOpportunities).where(eq(volunteerOpportunities.id, id));

		return { success: true };
	}
};
