import { redirect } from '@sveltejs/kit';
import { canAccessAdminArea, getAdminHomePath } from '$lib/adminRoles';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user && canAccessAdminArea(locals.user.role ?? '')) {
		throw redirect(302, getAdminHomePath(locals.user.role));
	}

	const token = url.searchParams.get('token');
	const error = url.searchParams.get('error');

	return {
		token,
		invalidToken: error === 'INVALID_TOKEN'
	};
};
