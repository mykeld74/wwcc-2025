import { db } from '$lib/server/db';
import {
	prayerRequests,
	volunteerOpportunities,
	informationRequests
} from '$lib/server/db/schema';
import { formatPersonName } from '$lib/personName';
import { and, desc, eq, count, gte, lt } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const now = new Date();
	const twentyFourHoursAgo = new Date(now);
	twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

	const sevenDaysAgo = new Date(now);
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

	const fourteenDaysAgo = new Date(now);
	fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

	const threeDaysAgo = new Date(now);
	threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

	const sevenDaysPendingAgo = new Date(now);
	sevenDaysPendingAgo.setDate(sevenDaysPendingAgo.getDate() - 7);

	const [
		[volunteerTotal],
		[volunteerPending],
		[prayerTotal],
		[prayerLast24Hours],
		[staffOnlyPrayerTotal],
		[volunteerPendingOver3Days],
		[volunteerPendingOver7Days],
		[prayerCurrentWeek],
		[prayerPreviousWeek],
		[volunteerCurrentWeek],
		[volunteerPreviousWeek],
		[infoTotal],
		[infoPending],
		recentPrayerRequests,
		recentVolunteerRequests,
		recentInfoRequests
	] = await Promise.all([
		db.select({ count: count() }).from(volunteerOpportunities),
		db
			.select({ count: count() })
			.from(volunteerOpportunities)
			.where(eq(volunteerOpportunities.addressed, false)),
		db.select({ count: count() }).from(prayerRequests),
		db
			.select({ count: count() })
			.from(prayerRequests)
			.where(gte(prayerRequests.submittedAt, twentyFourHoursAgo)),
		db
			.select({ count: count() })
			.from(prayerRequests)
			.where(eq(prayerRequests.isStaffOnly, true)),
		db
			.select({ count: count() })
			.from(volunteerOpportunities)
			.where(
				and(
					eq(volunteerOpportunities.addressed, false),
					lt(volunteerOpportunities.submittedAt, threeDaysAgo)
				)
			),
		db
			.select({ count: count() })
			.from(volunteerOpportunities)
			.where(
				and(
					eq(volunteerOpportunities.addressed, false),
					lt(volunteerOpportunities.submittedAt, sevenDaysPendingAgo)
				)
			),
		db
			.select({ count: count() })
			.from(prayerRequests)
			.where(gte(prayerRequests.submittedAt, sevenDaysAgo)),
		db
			.select({ count: count() })
			.from(prayerRequests)
			.where(
				and(
					gte(prayerRequests.submittedAt, fourteenDaysAgo),
					lt(prayerRequests.submittedAt, sevenDaysAgo)
				)
			),
		db
			.select({ count: count() })
			.from(volunteerOpportunities)
			.where(gte(volunteerOpportunities.submittedAt, sevenDaysAgo)),
		db
			.select({ count: count() })
			.from(volunteerOpportunities)
			.where(
				and(
					gte(volunteerOpportunities.submittedAt, fourteenDaysAgo),
					lt(volunteerOpportunities.submittedAt, sevenDaysAgo)
				)
			),
		db.select({ count: count() }).from(informationRequests),
		db
			.select({ count: count() })
			.from(informationRequests)
			.where(eq(informationRequests.addressed, false)),
		db
			.select({
				id: prayerRequests.id,
				type: prayerRequests.isStaffOnly,
				firstName: prayerRequests.firstName,
				lastName: prayerRequests.lastName,
				submittedAt: prayerRequests.submittedAt
			})
			.from(prayerRequests)
			.orderBy(desc(prayerRequests.submittedAt))
			.limit(5),
		db
			.select({
				id: volunteerOpportunities.id,
				type: volunteerOpportunities.addressed,
				name: volunteerOpportunities.name,
				submittedAt: volunteerOpportunities.submittedAt
			})
			.from(volunteerOpportunities)
			.orderBy(desc(volunteerOpportunities.submittedAt))
			.limit(5),
		db
			.select({
				id: informationRequests.id,
				type: informationRequests.addressed,
				name: informationRequests.name,
				label: informationRequests.requestTypeLabel,
				submittedAt: informationRequests.submittedAt
			})
			.from(informationRequests)
			.orderBy(desc(informationRequests.submittedAt))
			.limit(5)
	]);

	const recentActivity = [
		...recentPrayerRequests.map((item) => ({
			id: item.id,
			kind: 'prayer' as const,
			name: formatPersonName(item.firstName, item.lastName),
			submittedAt: item.submittedAt,
			status: item.type ? 'Staff Only' : 'Public',
			href: '/admin/prayer-requests'
		})),
		...recentVolunteerRequests.map((item) => ({
			id: item.id,
			kind: 'volunteer' as const,
			name: item.name || 'Anonymous',
			submittedAt: item.submittedAt,
			status: item.type ? 'Addressed' : 'Pending',
			href: '/admin/volunteer-opportunities'
		})),
		...recentInfoRequests.map((item) => ({
			id: item.id,
			kind: 'info' as const,
			name: item.name || 'Anonymous',
			submittedAt: item.submittedAt,
			status: item.type ? `Addressed · ${item.label}` : `Pending · ${item.label}`,
			href: '/admin/information-requests'
		}))
	]
		.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
		.slice(0, 8);

	return {
		stats: {
			volunteerTotal: volunteerTotal.count,
			volunteerPending: volunteerPending.count,
			prayerTotal: prayerTotal.count,
			prayerLast24Hours: prayerLast24Hours.count,
			staffOnlyPrayerTotal: staffOnlyPrayerTotal.count,
			volunteerPendingOver3Days: volunteerPendingOver3Days.count,
			volunteerPendingOver7Days: volunteerPendingOver7Days.count,
			prayerCurrentWeek: prayerCurrentWeek.count,
			prayerPreviousWeek: prayerPreviousWeek.count,
			volunteerCurrentWeek: volunteerCurrentWeek.count,
			volunteerPreviousWeek: volunteerPreviousWeek.count,
			infoTotal: infoTotal.count,
			infoPending: infoPending.count
		},
		recentActivity
	};
};
