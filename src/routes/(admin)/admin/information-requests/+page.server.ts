import { db } from '$lib/server/db';
import { informationRequests, informationRequestTypes } from '$lib/server/db/schema';
import { ensureInformationRequestTypes } from '$lib/server/db/seedInformationRequestTypes';
import { asc, desc, eq, max } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	await ensureInformationRequestTypes();

	const [requests, types] = await Promise.all([
		db.select().from(informationRequests).orderBy(desc(informationRequests.submittedAt)),
		db
			.select()
			.from(informationRequestTypes)
			.orderBy(asc(informationRequestTypes.sortOrder), asc(informationRequestTypes.label))
	]);

	return {
		requests,
		types,
		user: locals.user
	};
};

export const actions: Actions = {
	markAddressed: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		if (!id) return fail(400, { message: 'Invalid ID' });

		await db
			.update(informationRequests)
			.set({ addressed: true, updatedAt: new Date() })
			.where(eq(informationRequests.id, id));

		return { success: true };
	},

	markPending: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		if (!id) return fail(400, { message: 'Invalid ID' });

		await db
			.update(informationRequests)
			.set({ addressed: false, updatedAt: new Date() })
			.where(eq(informationRequests.id, id));

		return { success: true };
	},

	delete: async ({ request, locals }) => {
		if (locals.user?.role !== 'admin') {
			return fail(403, { message: 'Only admins can delete entries' });
		}

		const formData = await request.formData();
		const id = Number(formData.get('id'));
		if (!id) return fail(400, { message: 'Invalid ID' });

		await db.delete(informationRequests).where(eq(informationRequests.id, id));
		return { success: true };
	},

	addType: async ({ request }) => {
		const formData = await request.formData();
		const label = (formData.get('label') as string)?.trim() ?? '';

		if (!label) {
			return fail(400, { typeError: 'Label is required' });
		}

		const [maxSort] = await db
			.select({ value: max(informationRequestTypes.sortOrder) })
			.from(informationRequestTypes);

		try {
			await db.insert(informationRequestTypes).values({
				label,
				sortOrder: (maxSort?.value ?? -1) + 1,
				isActive: true
			});
		} catch {
			return fail(400, { typeError: 'That type already exists' });
		}

		return { typeSuccess: true };
	},

	updateType: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const label = (formData.get('label') as string)?.trim() ?? '';

		if (!id || !label) {
			return fail(400, { typeError: 'Label is required' });
		}

		try {
			await db
				.update(informationRequestTypes)
				.set({ label, updatedAt: new Date() })
				.where(eq(informationRequestTypes.id, id));
		} catch {
			return fail(400, { typeError: 'Could not update type (label may already exist)' });
		}

		return { typeSuccess: true };
	},

	toggleTypeActive: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const isActive = formData.get('isActive') === 'true';

		if (!id) return fail(400, { typeError: 'Invalid ID' });

		await db
			.update(informationRequestTypes)
			.set({ isActive, updatedAt: new Date() })
			.where(eq(informationRequestTypes.id, id));

		return { typeSuccess: true };
	},

	moveType: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const direction = formData.get('direction') as string;

		if (!id || (direction !== 'up' && direction !== 'down')) {
			return fail(400, { typeError: 'Invalid move request' });
		}

		const types = await db
			.select()
			.from(informationRequestTypes)
			.orderBy(asc(informationRequestTypes.sortOrder), asc(informationRequestTypes.label));

		const index = types.findIndex((type) => type.id === id);
		if (index === -1) return fail(400, { typeError: 'Type not found' });

		const swapIndex = direction === 'up' ? index - 1 : index + 1;
		if (swapIndex < 0 || swapIndex >= types.length) {
			return { typeSuccess: true };
		}

		const current = types[index];
		const neighbor = types[swapIndex];

		await db
			.update(informationRequestTypes)
			.set({ sortOrder: neighbor.sortOrder, updatedAt: new Date() })
			.where(eq(informationRequestTypes.id, current.id));
		await db
			.update(informationRequestTypes)
			.set({ sortOrder: current.sortOrder, updatedAt: new Date() })
			.where(eq(informationRequestTypes.id, neighbor.id));

		return { typeSuccess: true };
	}
};
