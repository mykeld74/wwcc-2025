import './instrumentation.server';
import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { auth } from '$lib/server/auth';
import { isPublicAdminPath } from '$lib/adminPublicPaths';
import {
	canAccessAdminArea,
	canAccessAdminPath,
	canManageUsers,
	getAdminHomePath
} from '$lib/adminRoles';
import { loginRedirectUrl } from '$lib/adminRedirect';
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

	// Guard every /admin request here, not just in layout load functions:
	// form actions (POSTs) skip load functions entirely, so a layout guard
	// alone leaves admin actions callable without authentication.
	const { pathname } = event.url;
	if (pathname.startsWith('/admin') && !isPublicAdminPath(pathname)) {
		const role = event.locals.user?.role ?? '';
		const requiresUserManagement = pathname.startsWith('/admin/users');

		if (!event.locals.user) {
			if (event.request.method === 'GET' || event.request.method === 'HEAD') {
				throw redirect(302, loginRedirectUrl(pathname, event.url.search));
			}
			return new Response('Forbidden', { status: 403 });
		}

		if (requiresUserManagement && !canManageUsers(role)) {
			const params = new URLSearchParams({
				reason: 'admin_required',
				redirect: `${pathname}${event.url.search}`
			});

			if (event.request.method === 'GET' || event.request.method === 'HEAD') {
				throw redirect(302, `/admin/login?${params.toString()}`);
			}
			return new Response('Forbidden', { status: 403 });
		}

		if (!canAccessAdminArea(role)) {
			if (event.request.method === 'GET' || event.request.method === 'HEAD') {
				throw redirect(302, '/admin/login?reason=role');
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
