import { db } from '$lib/server/db';
import { contactInformationRequests } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const requests = await db
		.select()
		.from(contactInformationRequests)
		.orderBy(desc(contactInformationRequests.submittedAt));

	return { requests };
};

export const actions: Actions = {
	markAddressed: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		if (!id) return fail(400, { message: 'Invalid ID' });

		await db
			.update(contactInformationRequests)
			.set({ addressed: true, updatedAt: new Date() })
			.where(eq(contactInformationRequests.id, id));

		return { success: true };
	},

	markPending: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		if (!id) return fail(400, { message: 'Invalid ID' });

		await db
			.update(contactInformationRequests)
			.set({ addressed: false, updatedAt: new Date() })
			.where(eq(contactInformationRequests.id, id));

		return { success: true };
	},

	delete: async ({ request, locals }) => {
		if (locals.user?.role !== 'admin') {
			return fail(403, { message: 'Only admins can delete entries' });
		}

		const formData = await request.formData();
		const id = Number(formData.get('id'));
		if (!id) return fail(400, { message: 'Invalid ID' });

		await db.delete(contactInformationRequests).where(eq(contactInformationRequests.id, id));
		return { success: true };
	}
};
