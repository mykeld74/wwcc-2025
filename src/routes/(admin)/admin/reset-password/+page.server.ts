import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const allowedRoles = ['admin', 'staff'];
	if (locals.user && allowedRoles.includes(locals.user.role ?? '')) {
		throw redirect(302, '/admin');
	}

	const token = url.searchParams.get('token');
	const error = url.searchParams.get('error');

	return {
		token,
		invalidToken: error === 'INVALID_TOKEN'
	};
};
