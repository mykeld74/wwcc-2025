import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { prayerRequests } from '$lib/server/db/schema.js';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const prayerRequest = data.get('request') as string;
		const name = data.get('name') as string;
		const email = data.get('email') as string;
		const isStaffOnly = data.get('isStaffOnly') === 'on';

		// Basic validation
		if (!prayerRequest || prayerRequest.trim().length === 0) {
			return fail(400, {
				error: 'Prayer request is required',
				name,
				email,
				isStaffOnly
			});
		}

		if (prayerRequest.trim().length > 2000) {
			return fail(400, {
				error: 'Prayer request must be less than 2000 characters',
				name,
				email,
				isStaffOnly,
				request: prayerRequest
			});
		}

		// Email validation if provided
		if (email && email.trim().length > 0) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email.trim())) {
				return fail(400, {
					error: 'Please enter a valid email address',
					name,
					email,
					isStaffOnly,
					request: prayerRequest
				});
			}
		}

		try {
			// Insert the prayer request into the database
			await db.insert(prayerRequests).values({
				request: prayerRequest.trim(),
				name: name?.trim() || null,
				email: email?.trim() || null,
				isStaffOnly: isStaffOnly
			});

			return {
				success: true,
				message: 'Your prayer request has been submitted successfully!'
			};
		} catch (error) {
			console.error('Error submitting prayer request:', error);
			return fail(500, {
				error: 'There was an error submitting your prayer request. Please try again.',
				name,
				email,
				isStaffOnly,
				request: prayerRequest
			});
		}
	}
};
