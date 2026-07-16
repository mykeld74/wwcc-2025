const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function requiredMessage(label: string) {
	return `Please provide ${label}`;
}

export function validateRequired(value: string | null | undefined, label: string) {
	const trimmed = value?.trim() ?? '';
	if (!trimmed) {
		return requiredMessage(label);
	}
	return '';
}

export function validateEmail(value: string | null | undefined, { required = true } = {}) {
	const trimmed = value?.trim() ?? '';

	if (!trimmed) {
		return required ? 'Please provide a valid email address' : '';
	}

	return emailPattern.test(trimmed) ? '' : 'Please provide a valid email address';
}

export function validateMinLength(
	value: string | null | undefined,
	minLength: number,
	message: string
) {
	const trimmed = value?.trim() ?? '';
	if (trimmed.length < minLength) {
		return message;
	}
	return '';
}
