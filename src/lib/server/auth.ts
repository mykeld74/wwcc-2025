import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { APIError, createAuthMiddleware } from 'better-auth/api';
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
import { isProtectedAdminEmail, PROTECTED_ACCOUNT_MESSAGE } from './protectedAccounts';

const statement = {
	...defaultStatements,
	prayerRequest: ['create', 'read', 'update', 'delete', 'list'],
	volunteerOpportunity: ['create', 'read', 'update', 'delete', 'list'],
	informationRequest: ['create', 'read', 'update', 'delete', 'list']
} as const;

const ac = createAccessControl(statement);

/**
 * Admin endpoints that act on another account by id. Every one of these is
 * reachable directly at /api/auth/... by anyone holding an admin session, so
 * the protected-account rule has to live here rather than in a form action.
 */
const TARGETED_ADMIN_PATHS = new Set([
	'/admin/set-role',
	'/admin/update-user',
	'/admin/remove-user',
	'/admin/ban-user',
	'/admin/impersonate-user',
	'/admin/set-user-password'
]);

/** A role change is allowed against a protected account only if it stays admin. */
function staysAdmin(role: unknown): boolean {
	const roles = Array.isArray(role) ? role : [role];
	return roles.length === 1 && roles[0] === 'admin';
}

/**
 * /admin/update-user can write arbitrary columns. Editing `email` would move the
 * account out from under this guard, so it is treated as an escape hatch too.
 */
function isHarmlessAdminUpdate(data: unknown): boolean {
	if (!data || typeof data !== 'object') {
		return true;
	}

	const guarded = ['role', 'email', 'banned', 'banReason', 'banExpires'];
	const touched = Object.keys(data).filter((key) => guarded.includes(key));

	if (touched.length === 0) {
		return true;
	}

	return (
		touched.length === 1 &&
		touched[0] === 'role' &&
		staysAdmin((data as Record<string, unknown>).role)
	);
}

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
	hooks: {
		before: createAuthMiddleware(async (ctx) => {
			if (!TARGETED_ADMIN_PATHS.has(ctx.path)) {
				return;
			}

			const body = (ctx.body ?? {}) as Record<string, unknown>;
			const userId = body.userId;

			if (typeof userId !== 'string' || !userId) {
				return;
			}

			const target = await ctx.context.internalAdapter.findUserById(userId);

			if (!isProtectedAdminEmail(target?.email)) {
				return;
			}

			// Promoting/re-affirming admin is always fine; anything else is not.
			if (ctx.path === '/admin/set-role' && staysAdmin(body.role)) {
				return;
			}

			if (ctx.path === '/admin/update-user' && isHarmlessAdminUpdate(body.data)) {
				return;
			}

			throw new APIError('FORBIDDEN', { message: PROTECTED_ACCOUNT_MESSAGE });
		})
	},
	databaseHooks: {
		user: {
			delete: {
				// Backstop for deletions that do not go through /admin/remove-user,
				// including a protected user deleting their own account.
				before: async (user) => {
					if (isProtectedAdminEmail((user as { email?: string }).email)) {
						throw new APIError('FORBIDDEN', { message: PROTECTED_ACCOUNT_MESSAGE });
					}
				}
			}
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
