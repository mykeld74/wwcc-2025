export const ADMIN_DASHBOARD_ROLES = ['admin', 'staff'] as const;

export const PRAYER_ADMIN_ROLE = 'prayer_admin';
export const PRAYER_TEAM_ROLE = 'prayer_team';

export const ADMIN_AREA_ROLES = [
	'admin',
	'staff',
	PRAYER_ADMIN_ROLE,
	PRAYER_TEAM_ROLE
] as const;

export const USER_MANAGEMENT_ROLE = 'admin';

export const DEFAULT_ASSIGNABLE_ROLE = PRAYER_TEAM_ROLE;

export const ASSIGNABLE_ROLES = [
	{
		value: PRAYER_TEAM_ROLE,
		label: 'Prayer Team',
		description: 'View public prayer requests only'
	},
	{
		value: PRAYER_ADMIN_ROLE,
		label: 'Prayer Admin',
		description: 'Manage prayer requests, bulk upload, email, and printing'
	},
	{
		value: 'volunteer',
		label: 'Volunteer',
		description: 'Volunteer-focused role (no admin access)'
	},
	{
		value: 'staff',
		label: 'Staff',
		description: 'Full admin dashboard access'
	},
	{
		value: 'admin',
		label: 'Admin',
		description: 'Full access, including user management'
	}
] as const;

export type AssignableRole = (typeof ASSIGNABLE_ROLES)[number]['value'];

const assignableRoleSet = new Set<string>(ASSIGNABLE_ROLES.map((role) => role.value));

export function isAssignableRole(role: string): role is AssignableRole {
	return assignableRoleSet.has(role);
}

export function canAccessAdminArea(role: string | null | undefined): boolean {
	return !!role && (ADMIN_AREA_ROLES as readonly string[]).includes(role);
}

export function canAccessAdminDashboard(role: string | null | undefined): boolean {
	return !!role && ADMIN_DASHBOARD_ROLES.includes(role as (typeof ADMIN_DASHBOARD_ROLES)[number]);
}

export function canAccessPrayerRequests(role: string | null | undefined): boolean {
	return canAccessAdminArea(role);
}

export function canViewStaffOnlyPrayerRequests(role: string | null | undefined): boolean {
	return canAccessAdminDashboard(role) || role === PRAYER_ADMIN_ROLE;
}

export function canManagePrayerRequests(role: string | null | undefined): boolean {
	return canAccessAdminDashboard(role) || role === PRAYER_ADMIN_ROLE;
}

export function canManageUsers(role: string | null | undefined): boolean {
	return role === USER_MANAGEMENT_ROLE;
}

export function getAdminHomePath(role: string | null | undefined): string {
	if (canAccessAdminDashboard(role)) {
		return '/admin';
	}

	if (canAccessPrayerRequests(role)) {
		return '/admin/prayer-requests';
	}

	return '/admin/login';
}

export function canAccessAdminPath(role: string, pathname: string): boolean {
	if (!canAccessAdminArea(role)) {
		return false;
	}

	if (pathname === '/admin' || pathname === '/admin/') {
		return canAccessAdminDashboard(role);
	}

	if (
		pathname.startsWith('/admin/prayer-requests/bulk') ||
		pathname.startsWith('/admin/prayer-requests/prepare-email')
	) {
		return canManagePrayerRequests(role);
	}

	if (pathname.startsWith('/admin/prayer-requests')) {
		return canAccessPrayerRequests(role);
	}

	if (pathname.startsWith('/admin/users')) {
		return canManageUsers(role);
	}

	if (
		pathname.startsWith('/admin/volunteer-opportunities') ||
		pathname.startsWith('/admin/information-requests')
	) {
		return canAccessAdminDashboard(role);
	}

	return canAccessAdminDashboard(role);
}

export type AdminNavItem = {
	label: string;
	href: string;
	icon: 'dashboard' | 'volunteers' | 'prayer' | 'info' | 'users';
};

export function getAdminNavItems(role: string | null | undefined): AdminNavItem[] {
	const items: AdminNavItem[] = [];

	if (canAccessAdminDashboard(role)) {
		items.push(
			{ label: 'Dashboard', href: '/admin', icon: 'dashboard' },
			{ label: 'Volunteers', href: '/admin/volunteer-opportunities', icon: 'volunteers' },
			{ label: 'Prayer Requests', href: '/admin/prayer-requests', icon: 'prayer' },
			{ label: 'Info Requests', href: '/admin/information-requests', icon: 'info' }
		);
	} else if (canAccessPrayerRequests(role)) {
		items.push({ label: 'Prayer Requests', href: '/admin/prayer-requests', icon: 'prayer' });
	}

	if (canManageUsers(role)) {
		items.push({ label: 'Users', href: '/admin/users', icon: 'users' });
	}

	return items;
}
