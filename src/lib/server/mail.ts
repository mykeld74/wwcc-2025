import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

type SendMailOptions = {
	to: string;
	subject: string;
	text?: string;
	html: string;
};

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
	if (!transporter) {
		transporter = nodemailer.createTransport({
			host: env.MAIL_HOST,
			port: Number(env.MAIL_PORT),
			secure: false,
			auth: {
				user: env.GOOGLE_EMAIL,
				pass: env.GOOGLE_EMAIL_PASSWORD
			}
		});
	}

	return transporter;
}

export async function sendMail({ to, subject, text, html }: SendMailOptions) {
	await getTransporter().sendMail({
		from: `"Westwoods Community Church" <${env.GOOGLE_EMAIL}>`,
		to,
		subject,
		text,
		html
	});
}
