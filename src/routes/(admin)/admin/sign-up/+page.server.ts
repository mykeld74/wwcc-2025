import { redirect } from '@sveltejs/kit';
import { canAccessAdminArea, getAdminHomePath } from '$lib/adminRoles';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user && canAccessAdminArea(locals.user.role ?? '')) {
		throw redirect(302, getAdminHomePath(locals.user.role));
	}

	return {};
};
