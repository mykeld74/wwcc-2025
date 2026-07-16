import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user) {
		const allowedRoles = ['admin', 'staff'];
		if (allowedRoles.includes(locals.user.role ?? '')) {
			throw redirect(302, '/admin');
		}
	}

	const reason = url.searchParams.get('reason');
	const reasonMessage =
		reason === 'role'
			? 'Your account is signed in but does not have admin access yet. Ask an admin to assign the "admin" or "staff" role.'
			: reason === 'session'
				? 'Your session was not recognized. Please sign in again.'
				: null;

	return { reasonMessage };
};
