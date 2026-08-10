import './instrumentation.server';
import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { auth } from '$lib/server/auth';
import {
	canAccessAdminArea,
	canAccessAdminPath,
	canManageUsers,
	getAdminHomePath
} from '$lib/adminRoles';
import { ACCOUNT_PATH, LOGIN_PATH, loginRedirectUrl } from '$lib/adminRedirect';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	} else {
		event.locals.session = null;
		event.locals.user = null;
	}

	const { pathname, search } = event.url;

	// Legacy bookmarks from the brief /user URL experiment.
	if (pathname.startsWith('/user')) {
		const destination = `/admin${pathname.slice('/user'.length)}${search}`;
		if (event.request.method === 'GET' || event.request.method === 'HEAD') {
			throw redirect(302, destination);
		}
	}

	// Guard every /admin request here, not just in layout load functions:
	// form actions (POSTs) skip load functions entirely, so a layout guard
	// alone leaves protected actions callable without authentication.
	if (pathname.startsWith('/admin')) {
		const role = event.locals.user?.role ?? '';
		const requiresUserManagement = pathname.startsWith('/admin/users');

		if (!event.locals.user) {
			if (event.request.method === 'GET' || event.request.method === 'HEAD') {
				throw redirect(302, loginRedirectUrl(pathname, search));
			}
			return new Response('Forbidden', { status: 403 });
		}

		if (requiresUserManagement && !canManageUsers(role)) {
			const params = new URLSearchParams({
				reason: 'admin_required',
				redirect: `${pathname}${search}`
			});

			if (event.request.method === 'GET' || event.request.method === 'HEAD') {
				throw redirect(302, `${LOGIN_PATH}?${params.toString()}`);
			}
			return new Response('Forbidden', { status: 403 });
		}

		if (!canAccessAdminArea(role)) {
			if (event.request.method === 'GET' || event.request.method === 'HEAD') {
				throw redirect(302, ACCOUNT_PATH);
			}
			return new Response('Forbidden', { status: 403 });
		}

		if (!canAccessAdminPath(role, pathname)) {
			if (event.request.method === 'GET' || event.request.method === 'HEAD') {
				throw redirect(302, getAdminHomePath(role));
			}
			return new Response('Forbidden', { status: 403 });
		}
	}

	return svelteKitHandler({ event, resolve, auth, building });
});

export const handleError = Sentry.handleErrorWithSentry();
