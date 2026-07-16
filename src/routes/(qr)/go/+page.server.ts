import { db } from '$lib/server/db';
import { informationRequestTypes } from '$lib/server/db/schema';
import { ensureInformationRequestTypes } from '$lib/server/db/seedInformationRequestTypes';
import { asc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	await ensureInformationRequestTypes();

	const types = await db
		.select({
			id: informationRequestTypes.id,
			label: informationRequestTypes.label
		})
		.from(informationRequestTypes)
		.where(eq(informationRequestTypes.isActive, true))
		.orderBy(asc(informationRequestTypes.sortOrder), asc(informationRequestTypes.label));

	return { types };
};
