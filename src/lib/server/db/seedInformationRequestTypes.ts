import { db } from '$lib/server/db';
import { informationRequestTypes } from '$lib/server/db/schema';
import { count } from 'drizzle-orm';

const defaultTypes = [
	{ label: 'Connect Lunch', sortOrder: 0 },
	{ label: 'Family Promise', sortOrder: 1 }
];

export async function ensureInformationRequestTypes() {
	const [existing] = await db.select({ count: count() }).from(informationRequestTypes);

	if (existing.count > 0) {
		return;
	}

	await db.insert(informationRequestTypes).values(
		defaultTypes.map((type) => ({
			label: type.label,
			sortOrder: type.sortOrder,
			isActive: true
		}))
	);
}
