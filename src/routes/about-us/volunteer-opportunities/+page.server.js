import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { volunteerOpportunities } from '$lib/server/db/schema';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: env.GOOGLE_EMAIL,
		pass: env.GOOGLE_EMAIL_PASSWORD
	}
});

export const actions = {
	default: async ({ request }) => {
		try {
			const formData = await request.formData();
			const name = formData.get('name');
			const email = formData.get('email');
			const phone = formData.get('phone');
			const team = formData.get('team');
			const department = formData.get('department');
			const message = formData.get('message');

			let sendTo = formData.get('sendTo');

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

			// Email options
			const mailOptions = {
				from: `"Westwoods Volunteer Inquiry" <${env.GOOGLE_EMAIL}>`,
				to: sendTo, // Send to yourself
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
					<p><strong>Name:</strong> ${name}</p>
					<p><strong>Email:</strong> ${email}</p>
					<p><strong>Phone:</strong> ${phone || 'Not provided'}</p>

					<p><strong>Team:</strong> ${team}</p>
					<h3>Message:</h3>
					<p>${message}</p>
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
			};

			await transporter.sendMail(mailOptions);

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
