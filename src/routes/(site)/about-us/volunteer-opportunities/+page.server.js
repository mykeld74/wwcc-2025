import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { volunteerOpportunities } from '$lib/server/db/schema';
import { escapeHtml } from '$lib/server/escapeHtml';
import { sendMail } from '$lib/server/mail';
import { verifyTurnstile } from '$lib/server/turnstile';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getString = (formData, key) => {
	const value = formData.get(key);
	return typeof value === 'string' ? value.trim() : '';
};

export const actions = {
	default: async ({ request, getClientAddress }) => {
		try {
			const formData = await request.formData();
			const name = getString(formData, 'name');
			const email = getString(formData, 'email');
			const phone = getString(formData, 'phone');
			const team = getString(formData, 'team');
			const department = getString(formData, 'department');
			const message = getString(formData, 'message');
			const turnstile = await verifyTurnstile(
				formData.get('cf-turnstile-response'),
				getClientAddress()
			);

			if (!turnstile.success) {
				return fail(400, { success: false, message: turnstile.error });
			}

			if (!name || name.length > 255) {
				return fail(400, { success: false, message: 'Please provide your name.' });
			}
			if (!email || email.length > 255 || !emailRegex.test(email)) {
				return fail(400, { success: false, message: 'Please provide a valid email address.' });
			}
			if (phone.length > 20) {
				return fail(400, { success: false, message: 'Please provide a valid phone number.' });
			}
			if (!team || team.length > 255 || !department || department.length > 255) {
				return fail(400, { success: false, message: 'Please select a team and department.' });
			}
			if (message.length > 2000) {
				return fail(400, {
					success: false,
					message: 'Message must be less than 2000 characters.'
				});
			}

			let sendTo = getString(formData, 'sendTo');

			switch (sendTo) {
				case 'WWKids':
					sendTo = 'kayla@westwoodscc.org';
					break;
				case 'StudentMinistry':
					sendTo = 'drew@westwoodscc.org';
					break;
				case 'Tech/Worship':
					sendTo = 'chris@westwoodscc.org';
					break;
				case 'General':
					sendTo = 'info@westwoodscc.org';
					break;
				default:
					sendTo = 'info@westwoodscc.org';
					break;
			}

			// Save to database
			await db.insert(volunteerOpportunities).values({
				name,
				email,
				phone: phone || null,
				team,
				sendTo,
				department,
				message: message || null,
				addressed: false
			});

			await sendMail({
				from: 'Westwoods Volunteer Inquiry <noreply@westwoodscc.org>',
				to: sendTo,
				replyTo: email,
				subject: `New volunteer inquiry from ${name}`,
				text: `
					Name: ${name}
					Email: ${email}
					Phone: ${phone || 'Not provided'}
					
					Message:
					${message}
				`,
				html: `
				<div class="emailContent">
					<h2>New Volunteer Opportunity Submission</h2>
					<p><strong>Name:</strong> ${escapeHtml(name)}</p>
					<p><strong>Email:</strong> ${escapeHtml(email)}</p>
					<p><strong>Phone:</strong> ${escapeHtml(phone) || 'Not provided'}</p>

					<p><strong>Team:</strong> ${escapeHtml(team)}</p>
					<h3>Message:</h3>
					<p>${escapeHtml(message)}</p>
					</div>

					<p>This is an automated email from the Westwoods Church website. Please do not reply to this email.</p>
					<style>
						.emailContent {
							background-color: #f0f0f0;
							padding: 20px;
							border-radius: 10px;
							border: 1px solid #ccc;
						}
						h2 {
							color: #222;
						}
						p {
							color: #333;
						}
					</style>
				`
			});

			return {
				success: true,
				message: 'Thank you for your message. We will get back to you soon!'
			};
		} catch (error) {
			return {
				success: false,
				message: 'Sorry, there was an error sending your message. Please try again later.'
			};
		}
	}
};
