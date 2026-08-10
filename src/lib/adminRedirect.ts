export const CREATE_USER_PATH = '/admin/users/new';
export const ACCOUNT_PATH = '/account';
export const LOGIN_PATH = '/account/login';
export const SIGN_UP_PATH = '/account/sign-up';
export const FORGOT_PASSWORD_PATH = '/account/forgot-password';
export const RESET_PASSWORD_PATH = '/account/reset-password';

export function createUserLoginUrl(): string {
	const params = new URLSearchParams({
		redirect: CREATE_USER_PATH
	});

	return `${LOGIN_PATH}?${params.toString()}`;
}

/**
 * Auth pages used to live under /admin. Those URLs are gone, so a stale bookmark
 * must not become a post-login destination — it would 404 once signed in.
 */
const LEGACY_AUTH_PATHS = [
	'/admin/login',
	'/admin/sign-up',
	'/admin/forgot-password',
	'/admin/reset-password'
];

export function getSafeAdminRedirect(
	value: string | null | undefined,
	fallback = '/admin'
): string {
	if (!value) {
		return fallback;
	}

	if (!value.startsWith('/admin') || value.startsWith('//')) {
		return fallback;
	}

	if (LEGACY_AUTH_PATHS.includes(value.split('?')[0])) {
		return fallback;
	}

	return value;
}

export function loginRedirectUrl(pathname: string, search = ''): string {
	const redirect = getSafeAdminRedirect(`${pathname}${search}`, '');
	if (!redirect) {
		return `${LOGIN_PATH}?reason=session`;
	}

	const params = new URLSearchParams({
		reason: 'session',
		redirect
	});

	return `${LOGIN_PATH}?${params.toString()}`;
}
