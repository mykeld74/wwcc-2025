import { volunteerOpportunities } from '$lib/server/db/schema';
import { and, ilike, or, type SQL } from 'drizzle-orm';

export const volunteerInfoInbox = 'info@westwoodscc.org';

export function getVolunteerVisibilityFilter(
	userEmail: string | null | undefined,
	showAll = false
): SQL | undefined {
	if (showAll) return undefined;

	const email = userEmail?.trim().toLowerCase();
	if (!email) return undefined;

	return or(
		ilike(volunteerOpportunities.sendTo, `%${volunteerInfoInbox}%`),
		ilike(volunteerOpportunities.sendTo, `%${email}%`)
	);
}

export function withVolunteerVisibility(
	userEmail: string | null | undefined,
	...conditions: SQL[]
): SQL | undefined {
	const visibility = getVolunteerVisibilityFilter(userEmail);
	const all = visibility ? [visibility, ...conditions] : conditions;
	if (all.length === 0) return undefined;
	if (all.length === 1) return all[0];
	return and(...all);
}
