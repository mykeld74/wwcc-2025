import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { informationRequests, informationRequestTypes } from '$lib/server/db/schema';
import { ensureInformationRequestTypes } from '$lib/server/db/seedInformationRequestTypes';
import { verifyTurnstile } from '$lib/server/turnstile';
import { asc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	await ensureInformationRequestTypes();

	const types = await db
		.select({
			id: informationRequestTypes.id,
			label: informationRequestTypes.label
		})
		.from(informationRequestTypes)
		.where(eq(informationRequestTypes.isActive, true))
		.orderBy(asc(informationRequestTypes.sortOrder), asc(informationRequestTypes.label));

	return { types };
};

export const actions: Actions = {
	informationRequest: async ({ request, getClientAddress }) => {
		const data = await request.formData();
		const requestType = (data.get('requestType') as string)?.trim() ?? '';
		const name = (data.get('name') as string)?.trim() ?? '';
		const email = (data.get('email') as string)?.trim() ?? '';
		const phone = (data.get('phone') as string)?.trim() ?? '';
		const message = (data.get('message') as string)?.trim() ?? '';

		const formValues = {
			requestType,
			name,
			email,
			phone,
			message
		};
		const turnstile = await verifyTurnstile(
			data.get('cf-turnstile-response'),
			getClientAddress()
		);

		if (!turnstile.success) {
			return fail(400, { error: turnstile.error, ...formValues });
		}

		if (!requestType) {
			return fail(400, {
				error: 'Please select or enter a request type',
				...formValues
			});
		}

		if (requestType.length > 255) {
			return fail(400, {
				error: 'Request type must be less than 255 characters',
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

		if (message.length > 2000) {
			return fail(400, {
				error: 'Message must be less than 2000 characters',
				...formValues
			});
		}

		const activeTypes = await db
			.select()
			.from(informationRequestTypes)
			.where(eq(informationRequestTypes.isActive, true));

		const matchedType = activeTypes.find(
			(type) => type.label.toLowerCase() === requestType.toLowerCase()
		);

		try {
			await db.insert(informationRequests).values({
				requestTypeId: matchedType?.id ?? null,
				requestTypeLabel: matchedType?.label ?? requestType,
				name,
				email,
				phone: phone || null,
				message: message || ''
			});

			return {
				success: true,
				message: 'Your information request has been submitted. We will be in touch soon.'
			};
		} catch (error) {
			console.error('Error submitting information request:', error);
			return fail(500, {
				error: 'There was an error submitting your request. Please try again.',
				...formValues
			});
		}
	}
};
