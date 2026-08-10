import { auth } from '$lib/server/auth';
import { ASSIGNABLE_ROLES, canManageUsers, isAssignableRole } from '$lib/adminRoles';
import { isProtectedAdminEmail } from '$lib/server/protectedAccounts';
import { fail, redirect } from '@sveltejs/kit';
import { APIError } from 'better-auth/api';
import type { Actions, PageServerLoad } from './$types';

const pageSize = 25;

function authErrorMessage(error: unknown, fallback: string) {
	if (error instanceof APIError) {
		return error.message || fallback;
	}

	return fallback;
}

function requireUserManager(locals: App.Locals) {
	if (!canManageUsers(locals.user?.role)) {
		throw redirect(302, '/admin');
	}
}

export const load: PageServerLoad = async ({ locals, url, request }) => {
	requireUserManager(locals);

	const search = url.searchParams.get('search')?.trim() ?? '';
	const page = Math.max(1, Number(url.searchParams.get('page') ?? '1') || 1);
	const offset = (page - 1) * pageSize;

	try {
		const result = await auth.api.listUsers({
			headers: request.headers,
			query: {
				limit: pageSize,
				offset,
				sortBy: 'createdAt',
				sortDirection: 'desc',
				...(search
					? {
							searchValue: search,
							searchField: 'email',
							searchOperator: 'contains'
						}
					: {})
			}
		});

		return {
			// The rule itself lives in the better-auth guard; this only drives the UI.
			users: result.users.map((user) => ({
				...user,
				isProtected: isProtectedAdminEmail(user.email)
			})),
			total: result.total,
			page,
			pageSize,
			search,
			roles: ASSIGNABLE_ROLES,
			currentUserId: locals.user?.id ?? null
		};
	} catch (error) {
		console.error('Failed to load users:', error);
		return {
			users: [],
			total: 0,
			page: 1,
			pageSize,
			search,
			roles: ASSIGNABLE_ROLES,
			currentUserId: locals.user?.id ?? null,
			loadError: authErrorMessage(error, 'Unable to load users right now.')
		};
	}
};

export const actions: Actions = {
	setRole: async ({ request, locals }) => {
		requireUserManager(locals);

		const formData = await request.formData();
		const userId = String(formData.get('userId') ?? '').trim();
		const role = String(formData.get('role') ?? '').trim();

		if (!userId || !isAssignableRole(role)) {
			return fail(400, { actionError: 'Invalid user or role.' });
		}

		if (userId === locals.user?.id) {
			return fail(400, { actionError: 'You cannot change your own role.' });
		}

		try {
			await auth.api.setRole({
				headers: request.headers,
				body: { userId, role }
			});

			return { actionSuccess: true };
		} catch (error) {
			console.error('Failed to set role:', error);
			return fail(400, {
				actionError: authErrorMessage(error, 'Unable to update role.')
			});
		}
	},

	banUser: async ({ request, locals }) => {
		requireUserManager(locals);

		const formData = await request.formData();
		const userId = String(formData.get('userId') ?? '').trim();
		const banReason = String(formData.get('banReason') ?? '').trim();

		if (!userId) {
			return fail(400, { actionError: 'Invalid user.' });
		}

		if (userId === locals.user?.id) {
			return fail(400, { actionError: 'You cannot ban yourself.' });
		}

		try {
			await auth.api.banUser({
				headers: request.headers,
				body: {
					userId,
					banReason: banReason || 'Banned by admin'
				}
			});

			return { actionSuccess: true };
		} catch (error) {
			console.error('Failed to ban user:', error);
			return fail(400, {
				actionError: authErrorMessage(error, 'Unable to ban user.')
			});
		}
	},

	unbanUser: async ({ request, locals }) => {
		requireUserManager(locals);

		const formData = await request.formData();
		const userId = String(formData.get('userId') ?? '').trim();

		if (!userId) {
			return fail(400, { actionError: 'Invalid user.' });
		}

		try {
			await auth.api.unbanUser({
				headers: request.headers,
				body: { userId }
			});

			return { actionSuccess: true };
		} catch (error) {
			console.error('Failed to unban user:', error);
			return fail(400, {
				actionError: authErrorMessage(error, 'Unable to unban user.')
			});
		}
	},

	removeUser: async ({ request, locals }) => {
		requireUserManager(locals);

		const formData = await request.formData();
		const userId = String(formData.get('userId') ?? '').trim();

		if (!userId) {
			return fail(400, { actionError: 'Invalid user.' });
		}

		if (userId === locals.user?.id) {
			return fail(400, { actionError: 'You cannot delete your own account.' });
		}

		try {
			await auth.api.removeUser({
				headers: request.headers,
				body: { userId }
			});

			return { actionSuccess: true };
		} catch (error) {
			console.error('Failed to remove user:', error);
			return fail(400, {
				actionError: authErrorMessage(error, 'Unable to delete user.')
			});
		}
	}
};
