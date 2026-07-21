import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
import { createAccessControl } from 'better-auth/plugins/access';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/private';
import { db } from './db';
import { escapeHtml } from './escapeHtml';
import { sendMail } from './mail';

const statement = {
	prayerRequest: ['create', 'read', 'update', 'delete', 'list'],
	volunteerOpportunity: ['create', 'read', 'update', 'delete', 'list'],
	informationRequest: ['create', 'read', 'update', 'delete', 'list']
} as const;

const ac = createAccessControl(statement);

export const auth = betterAuth({
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL,
	database: drizzleAdapter(db, {
		provider: 'pg',
		usePlural: true
	}),
	emailAndPassword: {
		enabled: true,
		// No public sign-up UI exists; accounts are created by admins
		// (seed script / admin plugin). Without this flag, anyone could
		// self-register via POST /api/auth/sign-up/email.
		disableSignUp: true,
		revokeSessionsOnPasswordReset: true,
		sendResetPassword: async ({ user, url }) => {
			void sendMail({
				to: user.email,
				subject: 'Reset your Westwoods admin password',
				text: `Click the link below to reset your password:\n\n${url}\n\nThis link expires in 1 hour. If you did not request a password reset, you can ignore this email.`,
				html: `
					<body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; font-size: 16px;">
						<div style="max-width: 520px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 8px;">
							<h2 style="color: #1a1a2e; margin-top: 0;">Reset your password</h2>
							<p>Hi ${escapeHtml(user.name || 'there')},</p>
							<p>We received a request to reset the password for your Westwoods admin account.</p>
							<p style="margin: 24px 0;">
								<a href="${escapeHtml(url)}" style="display: inline-block; background: #1a1a2e; color: #fff; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: 600;">
									Reset password
								</a>
							</p>
							<p style="color: #666; font-size: 14px;">This link expires in 1 hour. If you did not request a password reset, you can ignore this email.</p>
						</div>
					</body>
				`
			}).catch((error) => {
				console.error('Failed to send password reset email:', error);
			});
		}
	},
	plugins: [
		admin({
			ac,
			roles: {
				admin: ac.newRole({
					prayerRequest: ['create', 'read', 'update', 'delete', 'list'],
					volunteerOpportunity: ['create', 'read', 'update', 'delete', 'list'],
					informationRequest: ['create', 'read', 'update', 'delete', 'list']
				}),
				staff: ac.newRole({
					prayerRequest: ['read', 'update', 'list'],
					volunteerOpportunity: ['read', 'update', 'list'],
					informationRequest: ['read', 'update', 'list']
				}),
				volunteer: ac.newRole({
					volunteerOpportunity: ['read', 'list']
				}),
				prayer_team: ac.newRole({
					prayerRequest: ['read', 'list']
				})
			},
			defaultRole: 'prayer_team'
		}),
		sveltekitCookies(getRequestEvent)
	]
});

export type Auth = typeof auth;
