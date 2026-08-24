import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { prayerRequests } from '$lib/server/db/schema.js';
import { verifyTurnstile } from '$lib/server/turnstile';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, getClientAddress }) => {
		const data = await request.formData();
		const prayerRequest = data.get('request') as string;
		const firstName = data.get('firstName') as string;
		const lastName = data.get('lastName') as string;
		const isStaffOnly = data.get('isStaffOnly') === 'on';
		const turnstile = await verifyTurnstile(
			data.get('cf-turnstile-response'),
			getClientAddress()
		);

		const formValues = {
			firstName,
			lastName,
			isStaffOnly,
			request: prayerRequest
		};

		if (!turnstile.success) {
			return fail(400, {
				error: turnstile.error,
				...formValues
			});
		}

		if (!prayerRequest || prayerRequest.trim().length === 0) {
			return fail(400, {
				error: 'Prayer request is required',
				...formValues,
				request: undefined
			});
		}

		if (prayerRequest.trim().length > 2000) {
			return fail(400, {
				error: 'Prayer request must be less than 2000 characters',
				...formValues
			});
		}

		try {
			await db.insert(prayerRequests).values({
				request: prayerRequest.trim(),
				firstName: firstName?.trim() || null,
				lastName: lastName?.trim() || null,
				isStaffOnly
			});

			return {
				success: true,
				message: 'Your prayer request has been submitted successfully!'
			};
		} catch (error) {
			console.error('Error submitting prayer request:', error);
			return fail(500, {
				error: 'There was an error submitting your prayer request. Please try again.',
				...formValues
			});
		}
	}
};
