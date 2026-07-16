import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: 'https://022115c28797e3b17edea6b4a442eaf1@o4511745769013248.ingest.us.sentry.io/4511745774387200',
	tracesSampleRate: 1,
	enableLogs: true,
	dataCollection: {
		// userInfo: false,
		// httpBodies: []
	}
});
