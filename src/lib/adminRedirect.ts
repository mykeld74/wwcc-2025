export const CREATE_USER_PATH = '/admin/users/new';
export const SIGN_UP_PATH = '/admin/sign-up';

export function createUserLoginUrl(): string {
	const params = new URLSearchParams({
		redirect: CREATE_USER_PATH
	});

	return `/admin/login?${params.toString()}`;
}

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

	return value;
}

export function loginRedirectUrl(pathname: string, search = ''): string {
	const redirect = getSafeAdminRedirect(`${pathname}${search}`, '');
	if (!redirect) {
		return '/admin/login?reason=session';
	}

	const params = new URLSearchParams({
		reason: 'session',
		redirect
	});

	return `/admin/login?${params.toString()}`;
}
