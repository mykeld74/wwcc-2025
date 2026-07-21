import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

type SendMailOptions = {
	to: string | string[];
	subject: string;
	text?: string;
	html: string;
	replyTo?: string;
	from?: string;
};

let resend: Resend | null = null;

function getResend() {
	if (!resend) {
		const apiKey = env.RESEND_API_KEY?.trim();
		if (!apiKey) {
			throw new Error('RESEND_API_KEY must be set to send email.');
		}

		resend = new Resend(apiKey);
	}

	return resend;
}

function getFromAddress(customFrom?: string) {
	const from = customFrom?.trim() || env.RESEND_FROM_EMAIL?.trim();
	if (!from) {
		throw new Error('RESEND_FROM_EMAIL must be set to send email.');
	}

	return from;
}

export async function sendMail({ to, subject, text, html, replyTo, from }: SendMailOptions) {
	const { data, error } = await getResend().emails.send({
		from: getFromAddress(from),
		to: Array.isArray(to) ? to : [to],
		subject,
		html,
		text,
		replyTo
	});

	if (error) {
		throw new Error(error.message);
	}

	return data;
}
