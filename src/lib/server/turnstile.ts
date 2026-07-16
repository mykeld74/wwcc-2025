import { env } from '$env/dynamic/private';

interface TurnstileResponse {
	success: boolean;
	'error-codes'?: string[];
}

const siteVerifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(token: FormDataEntryValue | string | null, remoteIp?: string) {
	const secret = env.TURNSTILE_SECRET_KEY;
	const responseToken = typeof token === 'string' ? token : '';

	if (!secret) {
		return {
			success: false,
			error: 'Turnstile is not configured'
		};
	}

	if (!responseToken) {
		return {
			success: false,
			error: 'Please complete the security check'
		};
	}

	const formData = new FormData();
	formData.append('secret', secret);
	formData.append('response', responseToken);

	if (remoteIp) {
		formData.append('remoteip', remoteIp);
	}

	try {
		const response = await fetch(siteVerifyUrl, {
			method: 'POST',
			body: formData
		});
		const result = (await response.json()) as TurnstileResponse;

		if (!result.success) {
			console.error('Turnstile verification failed:', result['error-codes']);
		}

		return {
			success: result.success,
			error: result.success ? '' : 'Please complete the security check'
		};
	} catch (error) {
		console.error('Turnstile verification error:', error);
		return {
			success: false,
			error: 'Unable to verify the security check'
		};
	}
}
