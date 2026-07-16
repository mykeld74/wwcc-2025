import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { contactInformationRequests } from '$lib/server/db/schema';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const submissionType = (data.get('submissionType') as string)?.trim() ?? '';
		const name = (data.get('name') as string)?.trim() ?? '';
		const email = (data.get('email') as string)?.trim() ?? '';
		const phone = (data.get('phone') as string)?.trim() ?? '';
		const street = (data.get('street') as string)?.trim() ?? '';
		const city = (data.get('city') as string)?.trim() ?? '';
		const state = (data.get('state') as string)?.trim() ?? '';
		const zip = (data.get('zip') as string)?.trim() ?? '';
		const notes = (data.get('notes') as string)?.trim() ?? '';

		const formValues = {
			submissionType,
			name,
			email,
			phone,
			street,
			city,
			state,
			zip,
			notes
		};

		if (submissionType !== 'new' && submissionType !== 'update') {
			return fail(400, {
				error: 'Please choose whether this is a new contact or an update',
				...formValues
			});
		}

		if (!name) {
			return fail(400, { error: 'Name is required', ...formValues });
		}

		if (!email) {
			return fail(400, { error: 'Email is required', ...formValues });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, { error: 'Please enter a valid email address', ...formValues });
		}

		try {
			await db.insert(contactInformationRequests).values({
				submissionType,
				name,
				email,
				phone: phone || null,
				street: street || null,
				city: city || null,
				state: state || null,
				zip: zip || null,
				notes: notes || null
			});

			return {
				success: true,
				message: 'Your contact information has been submitted. Thank you!'
			};
		} catch (error) {
			console.error('Error submitting contact information:', error);
			return fail(500, {
				error: 'There was an error submitting your information. Please try again.',
				...formValues
			});
		}
	}
};
