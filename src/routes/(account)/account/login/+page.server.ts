import { redirect } from '@sveltejs/kit';
import {
	canAccessAdminArea,
	canManageUsers,
	getAdminHomePath,
	PENDING_ROLE
} from '$lib/adminRoles';
import { ACCOUNT_PATH, getSafeAdminRedirect } from '$lib/adminRedirect';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const redirectTo = getSafeAdminRedirect(url.searchParams.get('redirect'));

	if (locals.user) {
		// No access yet: the account page states where they stand, which beats
		// showing a sign-in form to someone who is already signed in.
		if (!canAccessAdminArea(locals.user.role ?? '')) {
			throw redirect(302, ACCOUNT_PATH);
		}

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
	// The email-verification link comes back as ?reason=verified, plus ?error=CODE
	// from better-auth when the token was bad or expired.
	const verifyError = reason === 'verified' ? url.searchParams.get('error') : null;

	const reasonMessage = verifyError
		? getVerifyErrorMessage(verifyError)
		: getLoginReasonMessage(reason, locals.user?.role);
	const successMessage = getLoginSuccessMessage(reason, verifyError);

	return {
		reasonMessage,
		successMessage,
		redirectTo
	};
};

function getLoginSuccessMessage(reason: string | null, verifyError: string | null) {
	if (reason === 'created') {
		return 'Your account has been created. Check your email for a verification link.';
	}

	if (reason === 'verified' && !verifyError) {
		return 'Your email is verified. Sign in below.';
	}

	return null;
}

function getVerifyErrorMessage(error: string) {
	if (error === 'TOKEN_EXPIRED') {
		return 'That verification link has expired. Sign in below and we will send you a new one.';
	}

	return 'That verification link is not valid. Sign in below and we will send you a new one.';
}

function getLoginReasonMessage(reason: string | null, role?: string | null) {
	if (reason === 'role') {
		if (role === PENDING_ROLE) {
			return 'Your account is waiting for an administrator to approve it. You will be able to sign in once a role has been assigned.';
		}

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
