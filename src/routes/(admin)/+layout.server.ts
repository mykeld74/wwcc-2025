import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url, cookies }) => {
	const cookieTheme = cookies.get('adminTheme');
	const adminTheme = cookieTheme === 'dark' || cookieTheme === 'light' ? cookieTheme : undefined;

	if (url.pathname === '/admin/login') {
		return { user: locals.user, adminTheme };
	}

	if (!locals.user) {
		throw redirect(302, '/admin/login?reason=session');
	}

	const allowedRoles = ['admin', 'staff'];
	if (!allowedRoles.includes(locals.user.role ?? '')) {
		throw redirect(302, '/admin/login?reason=role');
	}

	return {
		user: locals.user,
		session: locals.session,
		adminTheme
	};
};
