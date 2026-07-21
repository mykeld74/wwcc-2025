import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const allowedRoles = ['admin', 'staff'];
	if (locals.user && allowedRoles.includes(locals.user.role ?? '')) {
		throw redirect(302, '/admin');
	}

	return {};
};
