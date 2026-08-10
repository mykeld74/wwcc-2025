import { auth } from '$lib/server/auth';
import {
	canAccessAdminArea,
	getAdminHomePath,
	getRoleDescription,
	getRoleLabel
} from '$lib/adminRoles';
import { LOGIN_PATH } from '$lib/adminRedirect';
import { fail, redirect } from '@sveltejs/kit';
import { APIError } from 'better-auth/api';
import type { Actions, PageServerLoad } from './$types';

const minPasswordLength = 8;

function authErrorMessage(error: unknown, fallback: string) {
	if (error instanceof APIError) {
		return error.message || fallback;
	}

	return fallback;
}

function requireUser(locals: App.Locals) {
	if (!locals.user) {
		throw redirect(302, LOGIN_PATH);
	}

	return locals.user;
}

export const load: PageServerLoad = async ({ locals }) => {
	const user = requireUser(locals);
	const role = user.role ?? '';
	const hasAccess = canAccessAdminArea(role);

	return {
		account: {
			name: user.name,
			email: user.email,
			emailVerified: user.emailVerified,
			roleLabel: getRoleLabel(role),
			roleDescription: getRoleDescription(role)
		},
		hasAccess,
		homePath: hasAccess ? getAdminHomePath(role) : null
	};
};

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		requireUser(locals);

		const formData = await request.formData();
		const name = String(formData.get('name') ?? '').trim();

		if (!name) {
			return fail(400, { profileError: 'Name cannot be empty.', name });
		}

		try {
			await auth.api.updateUser({
				headers: request.headers,
				body: { name }
			});

			return { profileSuccess: 'Your name has been updated.' };
		} catch (error) {
			console.error('Failed to update profile:', error);
			return fail(400, {
				profileError: authErrorMessage(error, 'Unable to update your profile.'),
				name
			});
		}
	},

	changePassword: async ({ request, locals }) => {
		requireUser(locals);

		const formData = await request.formData();
		const currentPassword = String(formData.get('currentPassword') ?? '');
		const newPassword = String(formData.get('newPassword') ?? '');
		const confirmPassword = String(formData.get('confirmPassword') ?? '');

		if (!currentPassword || !newPassword) {
			return fail(400, { passwordError: 'Both your current and new password are required.' });
		}

		if (newPassword.length < minPasswordLength) {
			return fail(400, {
				passwordError: `New password must be at least ${minPasswordLength} characters.`
			});
		}

		if (newPassword !== confirmPassword) {
			return fail(400, { passwordError: 'New passwords do not match.' });
		}

		try {
			// Signs every other device out; better-auth reissues this session's cookie.
			await auth.api.changePassword({
				headers: request.headers,
				body: { currentPassword, newPassword, revokeOtherSessions: true }
			});

			return {
				passwordSuccess: 'Your password has been changed. Other devices have been signed out.'
			};
		} catch (error) {
			console.error('Failed to change password:', error);
			return fail(400, {
				passwordError: authErrorMessage(error, 'Unable to change your password.')
			});
		}
	}
};
