export const PUBLIC_ADMIN_PATHS = [
	'/admin/login',
	'/admin/forgot-password',
	'/admin/reset-password'
] as const;

export function isPublicAdminPath(pathname: string): boolean {
	return PUBLIC_ADMIN_PATHS.includes(pathname as (typeof PUBLIC_ADMIN_PATHS)[number]);
}
