import { redirect } from '@sveltejs/kit';
import { isPublicAdminPath } from '$lib/adminPublicPaths';
import { canAccessAdminArea, canAccessAdminPath, getAdminHomePath } from '$lib/adminRoles';
import { loginRedirectUrl } from '$lib/adminRedirect';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url, cookies }) => {
	const cookieTheme = cookies.get('adminTheme');
	const adminTheme = cookieTheme === 'dark' || cookieTheme === 'light' ? cookieTheme : undefined;

	if (isPublicAdminPath(url.pathname)) {
		return { user: locals.user, adminTheme };
	}

	if (!locals.user) {
		throw redirect(302, loginRedirectUrl(url.pathname, url.search));
	}

	const role = locals.user.role ?? '';

	if (!canAccessAdminArea(role)) {
		throw redirect(302, '/admin/login?reason=role');
	}

	if (!canAccessAdminPath(role, url.pathname)) {
		throw redirect(302, getAdminHomePath(role));
	}

	return {
		user: locals.user,
		session: locals.session,
		adminTheme
	};
};
