import {sequence} from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import type { Handle } from '@sveltejs/kit';

Sentry.init({
    dsn: "https://022115c28797e3b17edea6b4a442eaf1@o4511745769013248.ingest.us.sentry.io/4511745774387200",
    tracesSampleRate: 1,
    enableLogs: true,
    dataCollection: {
      // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
      // https://docs.sentry.io/platforms/javascript/guides/sveltekit/configuration/options/#dataCollection
      // userInfo: false,
      // httpBodies: [],
    },
})

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

	return svelteKitHandler({ event, resolve, auth, building });
});
export const handleError = Sentry.handleErrorWithSentry();