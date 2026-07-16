import './instrumentation.server';
import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

const ADMIN_ROLES = ['admin', 'staff'];

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
	if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
		const role = event.locals.user?.role ?? '';
		if (!event.locals.user || !ADMIN_ROLES.includes(role)) {
			if (event.request.method === 'GET' || event.request.method === 'HEAD') {
				throw redirect(302, `/admin/login?reason=${event.locals.user ? 'role' : 'session'}`);
			}
			return new Response('Forbidden', { status: 403 });
		}
	}

	return svelteKitHandler({ event, resolve, auth, building });
});

export const handleError = Sentry.handleErrorWithSentry();
