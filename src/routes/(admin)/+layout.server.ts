import { redirect } from '@sveltejs/kit';
import { canAccessAdminArea, canAccessAdminPath, getAdminHomePath } from '$lib/adminRoles';
import { ACCOUNT_PATH, loginRedirectUrl } from '$lib/adminRedirect';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url, cookies }) => {
	const cookieTheme = cookies.get('adminTheme');
	const adminTheme = cookieTheme === 'dark' || cookieTheme === 'light' ? cookieTheme : undefined;

	if (!locals.user) {
		throw redirect(302, loginRedirectUrl(url.pathname, url.search));
	}

	const role = locals.user.role ?? '';

	if (!canAccessAdminArea(role)) {
		throw redirect(302, ACCOUNT_PATH);
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
