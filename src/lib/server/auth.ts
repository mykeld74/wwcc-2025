import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/private';
import { PENDING_ROLE, VERIFY_EMAIL_CALLBACK_PATH } from '$lib/adminRoles';
import { db } from './db';
import { escapeHtml } from './escapeHtml';
import { sendMail } from './mail';

const statement = {
	...defaultStatements,
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
		disableSignUp: false,
		requireEmailVerification: true,
		revokeSessionsOnPasswordReset: true,
		sendResetPassword: async ({ user, url }) => {
			await sendMail({
				from: 'Westwoods Admin <noreply@westwoodscc.org>',
				to: user.email,
				subject: 'Reset your Westwoods admin password',
				text: `Click the link below to reset your password:\n\n${url}\n\nThis link expires in 1 hour. If you did not request a password reset, you can ignore this email.`,
				html: `
					<body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; font-size: 16px;">
						<div style="max-width: 520px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 8px;">
							<h2 style="color: #1a1a2e; margin-top: 0;">Reset your password</h2>
							<p>Hi ${escapeHtml(user.name || 'there')},</p>
							<p>We received a request to reset the password for your Westwoods account.</p>
							<p style="margin: 24px 0;">
								<a href="${url}" style="display: inline-block; background: #1a1a2e; color: #fff; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: 600;">
									Reset password
								</a>
							</p>
							<p style="color: #666; font-size: 14px;">This link expires in 1 hour. If you did not request a password reset, you can ignore this email.</p>
						</div>
					</body>
				`
			});
		}
	},
	emailVerification: {
		sendOnSignUp: true,
		// Re-send when an unverified account tries to sign in, so admin-created
		// accounts (which start unverified) can get a link without extra UI.
		sendOnSignIn: true,
		sendVerificationEmail: async ({ user, url }) => {
			// better-auth builds `url` with whatever callbackURL the caller passed.
			// Pin it to the login page so the link can't be pointed elsewhere.
			const verifyUrl = new URL(url);
			verifyUrl.searchParams.set('callbackURL', VERIFY_EMAIL_CALLBACK_PATH);

			await sendMail({
				from: 'Westwoods Admin <noreply@westwoodscc.org>',
				to: user.email,
				subject: 'Verify your Westwoods admin email',
				text: `Confirm your email address to activate your Westwoods account:\n\n${verifyUrl}\n\nThis link expires in 1 hour. Once verified, an administrator still needs to grant your account access before you can sign in.\n\nIf you did not create this account, you can ignore this email.`,
				html: `
					<body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; font-size: 16px;">
						<div style="max-width: 520px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 8px;">
							<h2 style="color: #1a1a2e; margin-top: 0;">Verify your email</h2>
							<p>Hi ${escapeHtml(user.name || 'there')},</p>
							<p>Confirm your email address to activate your Westwoods account.</p>
							<p style="margin: 24px 0;">
								<a href="${escapeHtml(verifyUrl.toString())}" style="display: inline-block; background: #1a1a2e; color: #fff; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: 600;">
									Verify email
								</a>
							</p>
							<p style="color: #666; font-size: 14px;">This link expires in 1 hour. Once verified, an administrator still needs to grant your account access before you can sign in.</p>
							<p style="color: #666; font-size: 14px;">If you did not create this account, you can ignore this email.</p>
						</div>
					</body>
				`
			});
		}
	},
	plugins: [
		admin({
			ac,
			roles: {
				// No statements: a pending account can authenticate but can do nothing
				// until an admin assigns a real role.
				[PENDING_ROLE]: ac.newRole({}),
				admin: ac.newRole({
					...adminAc.statements,
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
				}),
				prayer_admin: ac.newRole({
					prayerRequest: ['create', 'read', 'update', 'delete', 'list']
				})
			},
			defaultRole: PENDING_ROLE
		}),
		sveltekitCookies(getRequestEvent)
	]
});

export type Auth = typeof auth;
