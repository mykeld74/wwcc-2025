import { auth } from '$lib/server/auth';
import { ASSIGNABLE_ROLES, canManageUsers, DEFAULT_ASSIGNABLE_ROLE, isAssignableRole } from '$lib/adminRoles';
import { CREATE_USER_PATH, LOGIN_PATH } from '$lib/adminRedirect';
import { fail, redirect } from '@sveltejs/kit';
import { APIError } from 'better-auth/api';
import type { Actions, PageServerLoad } from './$types';

function authErrorMessage(error: unknown, fallback: string) {
	if (error instanceof APIError) {
		return error.message || fallback;
	}

	return fallback;
}

function requireUserManager(locals: App.Locals) {
	if (!canManageUsers(locals.user?.role)) {
		const params = new URLSearchParams({
			reason: 'admin_required',
			redirect: CREATE_USER_PATH
		});
		throw redirect(302, `${LOGIN_PATH}?${params.toString()}`);
	}
}

export const load: PageServerLoad = async ({ locals }) => {
	requireUserManager(locals);

	return {
		roles: ASSIGNABLE_ROLES
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		requireUserManager(locals);

		const formData = await request.formData();
		const name = String(formData.get('name') ?? '').trim();
		const email = String(formData.get('email') ?? '').trim().toLowerCase();
		const password = String(formData.get('password') ?? '');
		const confirmPassword = String(formData.get('confirmPassword') ?? '');
		const role = String(formData.get('role') ?? DEFAULT_ASSIGNABLE_ROLE).trim();

		const formValues = { name, email, role };

		if (!name || !email || !password) {
			return fail(400, {
				error: 'Name, email, and password are required.',
				...formValues
			});
		}

		if (password.length < 8) {
			return fail(400, {
				error: 'Password must be at least 8 characters.',
				...formValues
			});
		}

		if (password !== confirmPassword) {
			return fail(400, {
				error: 'Passwords do not match.',
				...formValues
			});
		}

		if (!isAssignableRole(role)) {
			return fail(400, {
				error: 'Please choose a valid role.',
				...formValues
			});
		}

		try {
			await auth.api.createUser({
				headers: request.headers,
				body: { name, email, password, role }
			});

			return {
				success: true,
				createdEmail: email
			};
		} catch (error) {
			console.error('Failed to create user:', error);
			return fail(400, {
				error: authErrorMessage(error, 'Unable to create user.'),
				...formValues
			});
		}
	}
};
