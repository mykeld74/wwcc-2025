import { json } from '@sveltejs/kit';
import { escapeHtml } from '$lib/server/escapeHtml';
import { sendMail } from '$lib/server/mail';
import { verifyTurnstile } from '$lib/server/turnstile';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST = async ({ request, getClientAddress }) => {
	let body;
	try {
		body = await request.json();
	} catch {
		return json({ success: false, error: 'Invalid request' }, { status: 400 });
	}

	const name = typeof body.name === 'string' ? body.name.trim() : '';
	const email = typeof body.email === 'string' ? body.email.trim() : '';
	const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
	const message = typeof body.message === 'string' ? body.message.trim() : '';
	const turnstileToken = typeof body.turnstileToken === 'string' ? body.turnstileToken : '';
	const turnstile = await verifyTurnstile(turnstileToken, getClientAddress());

	if (!turnstile.success) {
		return json({ success: false, error: turnstile.error }, { status: 400 });
	}

	if (!name || name.length > 255) {
		return json({ success: false, error: 'Please provide your name' }, { status: 400 });
	}
	if (!email || email.length > 255 || !emailRegex.test(email)) {
		return json({ success: false, error: 'Please provide a valid email address' }, { status: 400 });
	}
	if (phone.length > 30) {
		return json({ success: false, error: 'Please provide a valid phone number' }, { status: 400 });
	}
	if (!message || message.length > 5000) {
		return json(
			{ success: false, error: 'Please provide a message under 5000 characters' },
			{ status: 400 }
		);
	}

	try {
		await sendMail({
			from: 'Westwoods Web Inquiry <noreply@westwoodscc.org>',
			to: 'info@westwoodscc.org',
			replyTo: email,
			subject: `New Contact Form Submission from ${name}`,
			html: `
			<body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; font-size: 18px;">
				<h2 style="color: #038bc7; font-size: 24px; font-weight: 600; text-decoration: underline;">New Contact Form Submission</h2>
				<p><strong>Name:</strong> ${escapeHtml(name)}</p>
				<p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
				<p><strong>Phone:</strong> <a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></p>
				<p><strong>Message:</strong> ${escapeHtml(message)}</p>
			</body>
			`
		});

		return json({ success: true });
	} catch (error) {
		console.error('Email error:', error);
		return json({ success: false, error: 'Failed to send email' }, { status: 500 });
	}
};
