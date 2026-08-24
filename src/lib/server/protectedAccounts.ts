/**
 * Accounts that must always remain administrators.
 *
 * Enforced by the `hooks.before` guard in ./auth.ts, which covers every
 * better-auth admin endpoint — including direct POSTs to /api/auth/admin/*,
 * not just this app's form actions — plus a `user.delete` database hook that
 * catches deletions from any path at all.
 *
 * Deliberately hardcoded rather than read from the environment: a missing env
 * var would silently switch the protection off.
 */
export const PROTECTED_ADMIN_EMAILS = ['mike@msdweb.pro', 'joe@westwoodscc.org'];

export const PROTECTED_ACCOUNT_MESSAGE =
	'This account is protected and cannot be demoted, banned, or removed.';

const protectedEmails = new Set(PROTECTED_ADMIN_EMAILS.map((email) => email.toLowerCase()));

export function isProtectedAdminEmail(email: string | null | undefined): boolean {
	return typeof email === 'string' && protectedEmails.has(email.trim().toLowerCase());
}
