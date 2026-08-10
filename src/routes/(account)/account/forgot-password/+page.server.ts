import { redirect } from '@sveltejs/kit';
import { getAdminHomePath } from '$lib/adminRoles';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, getAdminHomePath(locals.user.role));
	}

	return {};
};
