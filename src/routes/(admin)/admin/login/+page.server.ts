import { redirect } from '@sveltejs/kit';
import {
	canAccessAdminArea,
	canManageUsers,
	getAdminHomePath
} from '$lib/adminRoles';
import { getSafeAdminRedirect } from '$lib/adminRedirect';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const redirectTo = getSafeAdminRedirect(url.searchParams.get('redirect'));

	if (locals.user && canAccessAdminArea(locals.user.role ?? '')) {
		if (redirectTo.startsWith('/admin/users') && !canManageUsers(locals.user.role)) {
			return {
				reasonMessage:
					'Only administrators can create or manage accounts. Ask an admin if you need a new account.',
				redirectTo: getAdminHomePath(locals.user.role),
				successMessage: null
			};
		}

		throw redirect(302, redirectTo);
	}

	const reason = url.searchParams.get('reason');
	const reasonMessage = getLoginReasonMessage(reason);
	const successMessage = reason === 'created' ? 'Your account has been created. Sign in below.' : null;

	return {
		reasonMessage,
		successMessage,
		redirectTo
	};
};

function getLoginReasonMessage(reason: string | null) {
	if (reason === 'role') {
		return 'Your account does not have access to this area. Contact an admin if you need a different role.';
	}

	if (reason === 'admin_required') {
		return 'Only administrators can create or manage accounts.';
	}

	if (reason === 'session') {
		return 'Your session was not recognized. Please sign in again.';
	}

	return null;
}
